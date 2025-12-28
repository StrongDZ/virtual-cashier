import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Loader2, CheckCircle, Printer, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';
import Button from '../components/ui/Button';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, clearCart, addReceipt, user } = useApp();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'faceid' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (!paymentMethod) return;
    setIsProcessing(true);
    showToast('Processing payment...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const receipt = {
        id: Date.now().toString(),
        items: cart,
        total,
        date: new Date().toISOString(),
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'FaceID',
      };
      addReceipt(receipt);
      clearCart();
      showToast('Payment successful!', 'success');
    }, 2000);
  };

  const handleRatingClick = (stars: number) => {
    setRating(stars);
    setShowCommentBox(true);
  };

  const handleSubmitFeedback = () => {
    setShowThankYou(true);
    showToast('Thank you for your feedback!', 'success');
    setTimeout(() => {
      setShowThankYou(false);
      navigate('/');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card rounded-3xl p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle className="mx-auto mb-6 text-green-400" size={100} />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your purchase
          </p>

          {/* Receipt Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button variant="secondary" size="lg" className="flex items-center justify-center gap-3">
              <Printer size={24} />
              Print Receipt
            </Button>
            <Button variant="secondary" size="lg" className="flex items-center justify-center gap-3">
              <Mail size={24} />
              Email Receipt
            </Button>
          </div>

          {/* Rating & Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Rate your experience
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className="text-5xl touch-target"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {star <= rating ? '⭐' : '☆'}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showCommentBox && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-3 rounded-lg glass text-white text-lg mb-4 resize-none"
                    rows={4}
                  />
                  <Button variant="primary" size="lg" onClick={handleSubmitFeedback} fullWidth>
                    Submit Feedback
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {showThankYou && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-gradient-gold text-xl font-bold"
              >
                Thank you for your feedback! 🎉
              </motion.div>
            )}
          </motion.div>

          <Button variant="primary" size="xl" onClick={() => navigate('/')} fullWidth>
            Return to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card rounded-3xl p-16 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Loader2 className="mx-auto mb-6 text-accent" size={80} />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Processing Payment...</h1>
          <p className="text-xl text-gray-300">Please wait</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black text-gradient-gold mb-8 text-center"
      >
        Payment
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 mb-8"
      >
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-white">Total Amount:</span>
          <span className="text-5xl font-black text-gradient-gold">
            ${total.toFixed(2)}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Credit Card - Apple Pay Style */}
        <motion.button
          onClick={() => setPaymentMethod('card')}
          className={`glass-card rounded-2xl p-8 relative overflow-hidden transition-all ${
            paymentMethod === 'card'
              ? 'ring-4 ring-accent scale-105'
              : 'hover:scale-102'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={32} />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">•••• •••• ••••</div>
                <div className="text-sm text-gray-300">1234</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Credit Card</h2>
            <p className="text-gray-400 text-sm">Tap to pay with card</p>
          </div>
          {paymentMethod === 'card' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            >
              <CheckCircle className="text-slate-900" size={20} />
            </motion.div>
          )}
        </motion.button>

        {/* FaceID Payment - Apple Pay Style */}
        <motion.button
          onClick={() => setPaymentMethod('faceid')}
          className={`glass-card rounded-2xl p-8 relative overflow-hidden transition-all ${
            paymentMethod === 'faceid'
              ? 'ring-4 ring-accent scale-105'
              : 'hover:scale-102'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={36} />
              </div>
              {user && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.membershipLevel}</div>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">FaceID Payment</h2>
            <p className="text-gray-400 text-sm">Secure biometric payment</p>
          </div>
          {paymentMethod === 'faceid' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            >
              <CheckCircle className="text-slate-900" size={20} />
            </motion.div>
          )}
        </motion.button>
      </div>

      <Button
        variant="primary"
        size="xl"
        onClick={handlePayment}
        disabled={!paymentMethod || cart.length === 0}
        fullWidth
      >
        Confirm Payment
      </Button>
    </div>
  );
};

export default Payment;
