import { MessageSquare, HelpCircle, Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const Help = () => {
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
    {
      question: 'How do I join the loyalty program?',
      answer: 'Click "Not a member? Join Now" on the home page or go to the Signup page. Fill in your name and phone number to register.',
    },
    {
      question: 'Where can I browse products?',
      answer: 'Visit the "Catalogue" page to see all available products. You can filter by category (Men/Women/Unisex) and size.',
    },
    {
      question: 'How does virtual try-on work?',
      answer: 'Go to the "Try-On" page or click "Try On" from any product in the catalogue. Select a product to see how it looks.',
    },
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <HelpCircle className="mx-auto mb-4 text-accent" size={80} />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-gradient-gold mb-4">
          Help & Support
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions or chat with our support team
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-8 h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-accent" size={32} />
              <h2 className="text-3xl font-bold text-white">Chat Support</h2>
            </div>

            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 mb-6 bg-slate-900/50 rounded-2xl">
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
            <div>
              <p className="text-white text-lg font-semibold mb-4">Quick Questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => handleQuestion(item.question, item.answer)}
                      className="w-full text-left justify-start h-auto py-3"
                    >
                      <span className="line-clamp-1">{item.question}</span>
                    </Button>
                  </motion.div>
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
            className="space-y-6"
          >
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Search className="text-accent" size={28} />
                <h2 className="text-2xl font-bold text-white">FAQ</h2>
              </div>

              <div className="space-y-6">
                {faqCategories.map((category, catIndex) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={catIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + catIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="text-accent" size={20} />
                        <h3 className="text-lg font-bold text-white">{category.title}</h3>
                      </div>
                      <div className="space-y-2 ml-7">
                        {category.questions.map((faq, faqIndex) => (
                          <motion.div
                            key={faqIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + catIndex * 0.1 + faqIndex * 0.05 }}
                            className="glass rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleQuestion(faq.q, faq.a)}
                          >
                            <p className="text-sm font-semibold text-white mb-1">{faq.q}</p>
                            <p className="text-xs text-gray-400 line-clamp-2">{faq.a}</p>
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
              className="glass-card rounded-3xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Need More Help?</h3>
              <div className="space-y-3 text-gray-300">
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



