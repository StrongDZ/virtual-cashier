import { X, MessageSquare, Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { useVoice } from '../context/VoiceContext';

interface HelpModalProps {
  onClose: () => void;
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const HelpModal = ({ onClose }: HelpModalProps) => {
  const { interactionMode, isSupported } = useVoice();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! How can I help you today? You can type your question or use the microphone to speak.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition for help modal (separate from global)
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputText(finalTranscript);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const generateBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Common questions and answers
    if (lowerQuestion.includes('scanner') || lowerQuestion.includes('scan')) {
      return 'The scanner is available on the "Start Checkout" page. Click the "Simulate Scan Item" button to add items to your cart.';
    }
    if (lowerQuestion.includes('pay') || lowerQuestion.includes('payment') || lowerQuestion.includes('checkout')) {
      return 'After adding items to your cart, click "Pay Now" and choose your payment method: Credit Card or FaceID Payment.';
    }
    if (lowerQuestion.includes('return') || lowerQuestion.includes('refund')) {
      return 'Yes! Go to the "Return Items" section from the home page. You can scan your receipt and select items to return.';
    }
    if (lowerQuestion.includes('voice') || lowerQuestion.includes('speak') || lowerQuestion.includes('command')) {
      return 'You can use voice commands in Voice + Touch mode. Just speak naturally and I\'ll understand commands like "Go to checkout", "Scan item", or "Pay now".';
    }
    if (lowerQuestion.includes('catalogue') || lowerQuestion.includes('catalog') || lowerQuestion.includes('browse') || lowerQuestion.includes('product')) {
      return 'Visit the Catalogue page to browse all available products. You can filter by category, size, season, and more!';
    }
    if (lowerQuestion.includes('member') || lowerQuestion.includes('signup') || lowerQuestion.includes('register') || lowerQuestion.includes('account')) {
      return 'Click on "Not a member? Join Now" on the home page or the account icon to sign up. Members get personalized recommendations!';
    }
    if (lowerQuestion.includes('try on') || lowerQuestion.includes('virtual')) {
      return 'Our Virtual Try-On feature lets you see how clothes look on you! Find it in the product details or Catalogue page.';
    }
    if (lowerQuestion.includes('cart') || lowerQuestion.includes('basket')) {
      return 'Click the cart icon in the header to view your shopping cart. You can adjust quantities or remove items there.';
    }
    if (lowerQuestion.includes('help') || lowerQuestion.includes('assist')) {
      return 'I\'m here to help! You can ask about scanning, payments, returns, products, membership, and more.';
    }
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return 'Hello! Welcome to Virtual Cashier. How can I assist you today?';
    }
    if (lowerQuestion.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    // Default response
    return `I understand you're asking about "${question}". For specific assistance, you can ask about: scanning items, making payments, returns, browsing products, membership, or using voice commands.`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: 'bot',
        text: generateBotResponse(userMessage.text),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Where is the scanner?',
    'How do I pay?',
    'Can I return items?',
    'How to use voice commands?',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-3xl w-full max-w-2xl h-[700px] flex flex-col shadow-glass-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-accent/30">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-accent" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">Help & Support</h2>
              <p className="text-sm text-gray-400">Ask me anything or use voice</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="text-white hover:text-accent transition-colors touch-target rounded-lg hover:bg-white/10 p-2"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={32} />
          </motion.button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900'
                      : 'glass text-white'
                  }`}
                >
                  <p className="text-lg">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Processing indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl p-4 flex items-center gap-2">
                <Loader2 className="animate-spin text-accent" size={20} />
                <span className="text-gray-400">Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-6 py-3 border-t border-white/10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 glass rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/20 whitespace-nowrap transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {question}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t-2 border-accent/30">
          <div className="flex items-center gap-3">
            {/* Voice Button */}
            {interactionMode !== 'touch' && isSupported && (
              <motion.button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'glass text-gray-400 hover:text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <MicOff size={24} />
                  </motion.div>
                ) : (
                  <Mic size={24} />
                )}
              </motion.button>
            )}

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? 'Listening...' : 'Type your question...'}
                className={`w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 text-lg focus:ring-2 focus:ring-accent focus:outline-none transition-all ${
                  isListening ? 'ring-2 ring-red-500 bg-red-500/10' : ''
                }`}
                disabled={isListening}
              />
            </div>

            {/* Send Button */}
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="px-4"
            >
              <Send size={24} />
            </Button>
          </div>

          {isListening && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-400 text-sm mt-2"
            >
              🎤 Listening... Speak your question
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpModal;
