import { useState, useEffect, useCallback, useRef } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface VoiceCommand {
  command: string;
  keywords: string[];
  action: () => void;
  description: string;
}

export interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  matchedCommand: VoiceCommand | null;
  isContinuousMode: boolean;
  setContinuousMode: (enabled: boolean) => void;
}

export const useVoiceRecognition = (
  commands: VoiceCommand[] = [],
  autoExecute: boolean = true
): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [matchedCommand, setMatchedCommand] = useState<VoiceCommand | null>(null);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const commandsRef = useRef(commands);
  const continuousModeRef = useRef(isContinuousMode);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update refs when values change
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    continuousModeRef.current = isContinuousMode;
  }, [isContinuousMode]);

  // Check if Speech Recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        
        // Match command
        const lowerTranscript = finalTranscript.toLowerCase().trim();
        const matched = commandsRef.current.find(cmd => 
          cmd.keywords.some(keyword => 
            lowerTranscript.includes(keyword.toLowerCase())
          )
        );

        if (matched) {
          setMatchedCommand(matched);
          if (autoExecute) {
            // Execute command immediately
            matched.action();
          }
          
          // Clear the matched command after a short delay
          setTimeout(() => {
            setMatchedCommand(null);
          }, 2000);
        }

        // Clear transcript after processing
        setTimeout(() => {
          setTranscript('');
          setInterimTranscript('');
        }, 3000);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't treat 'no-speech' or 'aborted' as errors in continuous mode
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      setError(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      
      // Auto-restart if in continuous mode
      if (continuousModeRef.current) {
        // Small delay before restarting to prevent rapid restarts
        restartTimeoutRef.current = setTimeout(() => {
          if (continuousModeRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              // Already started or other error
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      recognition.abort();
    };
  }, [isSupported, autoExecute]);

  // Handle continuous mode changes
  useEffect(() => {
    if (!recognitionRef.current || !isSupported) return;

    if (isContinuousMode) {
      try {
        recognitionRef.current.start();
      } catch {
        // Already started
      }
    } else {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      recognitionRef.current.stop();
    }
  }, [isContinuousMode, isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError('Speech recognition not supported');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setMatchedCommand(null);

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setMatchedCommand(null);
  }, []);

  const setContinuousMode = useCallback((enabled: boolean) => {
    setIsContinuousMode(enabled);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    matchedCommand,
    isContinuousMode,
    setContinuousMode,
  };
};

export default useVoiceRecognition;
