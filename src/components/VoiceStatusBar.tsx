import { Mic, Volume2, CheckCircle, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../context/VoiceContext';

const VoiceStatusBar = () => {
  const { 
    interactionMode, 
    isListening, 
    transcript, 
    interimTranscript, 
    matchedCommand, 
    lastCommand,
    availableCommands,
  } = useVoice();

  // Only show in voice-touch mode
  if (interactionMode !== 'voice-touch') {
    return null;
  }

  const displayText = transcript || interimTranscript;
  const hasContent = displayText || matchedCommand || lastCommand;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4"
    >
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Status Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          {/* Listening Indicator */}
          <div className="relative">
            <Mic 
              size={20} 
              className={isListening ? 'text-green-400' : 'text-orange-400'} 
            />
            {isListening && (
              <motion.div
                className="absolute inset-0 bg-green-400/30 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {matchedCommand ? (
                <motion.div
                  key="matched"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                  <span className="text-green-400 font-medium truncate">
                    Executing: {matchedCommand.command}
                  </span>
                </motion.div>
              ) : lastCommand ? (
                <motion.div
                  key="last"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                  <span className="text-green-400 font-medium truncate">
                    ✓ {lastCommand}
                  </span>
                </motion.div>
              ) : displayText ? (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="text-accent flex-shrink-0" size={16} />
                  <span className="text-white truncate">"{displayText}"</span>
                </motion.div>
              ) : (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-green-400">
                    🎤 Listening for commands...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live indicator - Always show in prototype mode */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-1"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </motion.div>
        </div>

        {/* Available Commands Preview (show when listening and idle) */}
        <AnimatePresence>
          {!hasContent && isListening && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-2 bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Command size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-500">Try saying:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {availableCommands.slice(0, 4).map((cmd, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 glass rounded-full text-gray-400"
                    >
                      "{cmd.command}"
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VoiceStatusBar;
