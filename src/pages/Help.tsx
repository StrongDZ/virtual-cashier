import { MessageSquare, HelpCircle, Search, ArrowRight, Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { useVoice } from '../context/VoiceContext';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const Help = () => {
  const { interactionMode } = useVoice();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! How can I help you today? You can type your question, use voice, or tap a quick question below.',
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

  // Initialize speech recognition for help page
  useEffect(() => {
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
          // Auto-send after voice input
          setTimeout(() => {
            handleSendMessageWithText(finalTranscript);
          }, 300);
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
  }, []);

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
      return 'You can use voice commands in Voice + Touch mode. Just speak naturally and I\'ll understand commands like "Go to checkout", "Scan item", or "Pay now". The voice status bar at the top shows what I hear.';
    }
    if (lowerQuestion.includes('catalogue') || lowerQuestion.includes('catalog') || lowerQuestion.includes('browse') || lowerQuestion.includes('product')) {
      return 'Visit the Catalogue page to browse all available products. You can filter by category, size, season, and more!';
    }
    if (lowerQuestion.includes('member') || lowerQuestion.includes('signup') || lowerQuestion.includes('register') || lowerQuestion.includes('account') || lowerQuestion.includes('loyalty')) {
      return 'Click on "Not a member? Join Now" on the home page or the account icon to sign up. Members get personalized recommendations and exclusive discounts!';
    }
    if (lowerQuestion.includes('try on') || lowerQuestion.includes('virtual')) {
      return 'Our Virtual Try-On feature lets you see how clothes look on you! Find it in the product details or Catalogue page.';
    }
    if (lowerQuestion.includes('cart') || lowerQuestion.includes('basket')) {
      return 'Click the cart icon in the header to view your shopping cart. You can adjust quantities or remove items there.';
    }
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return 'Hello! Welcome to Virtual Cashier. How can I assist you today?';
    }
    if (lowerQuestion.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }
    if (lowerQuestion.includes('size') || lowerQuestion.includes('fit')) {
      return 'Each product shows available sizes. You can try our Virtual Try-On feature to see how items look. If unsure, check our size guide in the product details.';
    }

    // Default response
    return `I understand you're asking about "${question}". For specific assistance, you can ask about: scanning items, making payments, returns, browsing products, membership, voice commands, or virtual try-on.`;
  };

  const handleSendMessageWithText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: 'bot',
        text: generateBotResponse(text),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    handleSendMessageWithText(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestion = (question: string) => {
    handleSendMessageWithText(question);
  };

  const quickQuestions = [
    'Where is the scanner?',
    'How do I pay?',
    'Can I return items?',
    'How to use voice commands?',
    'How do I join the loyalty program?',
    'How does virtual try-on work?',
  ];

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: HelpCircle,
      questions: [
        {
          q: 'How do I start shopping?',
          a: 'Click "Start Checkout" on the home page to begin scanning items, or browse the "Catalogue" to see all products.',
        },
        {
          q: 'Do I need an account?',
          a: 'No, you can shop as a guest. However, joining our loyalty program gives you exclusive discounts and rewards.',
        },
      ],
    },
    {
      title: 'Payment',
      icon: MessageSquare,
      questions: [
        {
          q: 'What payment methods are accepted?',
          a: 'We accept Credit Card and FaceID Payment. Both methods are secure and easy to use.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, all payment information is encrypted and secure. We use industry-standard security measures.',
        },
      ],
    },
    {
      title: 'Returns & Exchanges',
      icon: ArrowRight,
      questions: [
        {
          q: 'Can I return items?',
          a: 'Yes! Use the "Return Items" feature to scan your receipt and select items to return. Refunds are processed immediately.',
        },
        {
          q: 'What is the return policy?',
          a: 'Items can be returned within 30 days of purchase with a valid receipt. Items must be in original condition.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <HelpCircle className="mx-auto mb-4 text-accent" size={64} />
        </motion.div>
        <h1 className="text-5xl font-black text-gradient-gold mb-2">
          Help & Support
        </h1>
        <p className="text-lg text-gray-300">
          Chat with us, use voice, or browse FAQs
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 h-full flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-accent" size={28} />
              <h2 className="text-2xl font-bold text-white">Chat Support</h2>
              {interactionMode === 'voice-touch' && (
                <span className="ml-auto text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                  Voice enabled
                </span>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 min-h-[350px] max-h-[400px] overflow-y-auto p-4 space-y-3 mb-4 bg-slate-900/50 rounded-2xl">
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
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900'
                          : 'glass text-white'
                      }`}
                    >
                      <p className="text-base">{msg.text}</p>
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
                  <div className="glass rounded-2xl p-3 flex items-center gap-2">
                    <Loader2 className="animate-spin text-accent" size={18} />
                    <span className="text-gray-400 text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              {/* Text/Voice Input */}
              <div className="flex items-center gap-2">
                {/* Voice Button */}
                <motion.button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all flex-shrink-0 ${
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
                      <MicOff size={22} />
                    </motion.div>
                  ) : (
                    <Mic size={22} />
                  )}
                </motion.button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? '🎤 Listening...' : 'Type or speak your question...'}
                    className={`w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all ${
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
                  className="px-4 py-3 flex-shrink-0"
                >
                  <Send size={22} />
                </Button>
              </div>

              {isListening && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-400 text-sm"
                >
                  🎤 Listening... Speak your question
                </motion.p>
              )}

              {/* Quick Questions */}
              <div className="flex gap-2 flex-wrap">
                {quickQuestions.slice(0, 4).map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuestion(question)}
                    className="px-3 py-1.5 glass rounded-full text-xs text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section - Takes 1 column */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="text-accent" size={24} />
                <h2 className="text-xl font-bold text-white">FAQ</h2>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {faqCategories.map((category, catIndex) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={catIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + catIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="text-accent" size={16} />
                        <h3 className="text-sm font-bold text-white">{category.title}</h3>
                      </div>
                      <div className="space-y-2 ml-6">
                        {category.questions.map((faq, faqIndex) => (
                          <motion.div
                            key={faqIndex}
                            className="glass rounded-lg p-2.5 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleQuestion(faq.q)}
                            whileHover={{ x: 4 }}
                          >
                            <p className="text-xs font-semibold text-white mb-1">{faq.q}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-2xl p-4"
            >
              <h3 className="text-lg font-bold text-white mb-3">Need More Help?</h3>
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">
                  <span className="font-semibold text-white">Phone:</span> +84 123 456 789
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-white">Email:</span> support@fashionstore.com
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-white">Hours:</span> Mon-Sun, 9AM-9PM
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Help;
