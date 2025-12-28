import { X, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal = ({ onClose }: HelpModalProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! How can I help you today?',
    },
  ]);

  const handleQuestion = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'user', text: question },
      { id: prev.length + 2, sender: 'bot', text: answer },
    ]);
  };

  const quickQuestions = [
    {
      question: 'Where is scanner?',
      answer: 'The scanner is available on the "Start Checkout" page. Click the "Simulate Scan Item" button to add items to your cart.',
    },
    {
      question: 'How do I pay?',
      answer: 'After adding items to your cart, click "Pay Now" and choose your payment method: Credit Card or FaceID Payment.',
    },
    {
      question: 'Can I return items?',
      answer: 'Yes! Go to the "Return Items" section from the home page. You can scan your receipt and select items to return.',
    },
  ];

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
        className="glass-card rounded-3xl w-full max-w-2xl h-[600px] flex flex-col shadow-glass-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-accent/30">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-accent" size={32} />
            <h2 className="text-2xl font-bold text-white">Help & Support</h2>
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
                transition={{ delay: index * 0.1 }}
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
        </div>

        {/* Quick Questions */}
        <div className="p-6 border-t-2 border-accent/30 space-y-3">
          <p className="text-white text-lg font-semibold mb-2">Quick Questions:</p>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => handleQuestion(item.question, item.answer)}
                  className="w-full text-left justify-start"
                >
                  {item.question}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpModal;
