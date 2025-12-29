import { useState } from 'react';
import { Receipt, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';
import type { CartItem } from '../data/MockData';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';

const Return = () => {
  const { receipts } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<CartItem[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleScanReceipt = () => {
    if (receipts.length > 0) {
      setSelectedReceipt(receipts[0].items);
    } else {
      setSelectedReceipt([
        {
          product: {
            id: '1',
            name: 'Classic White Shirt',
            price: 49.99,
            category: 'men',
            size: ['M'],
            image: '👔',
            description: 'Premium cotton dress shirt',
            inStock: true,
          },
          quantity: 2,
          selectedSize: 'M',
        },
        {
          product: {
            id: '2',
            name: 'Slim Fit Jeans',
            price: 79.99,
            category: 'men',
            size: ['32'],
            image: '👖',
            description: 'Classic blue denim jeans',
            inStock: true,
          },
          quantity: 1,
          selectedSize: '32',
        },
      ]);
    }
    showToast('Receipt scanned successfully!', 'success');
    setStep(2);
  };

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleConfirmReturn = () => {
    const refundAmount = selectedReceipt
      ?.filter((item) => selectedItems.has(item.product.id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
    showToast(`Return processed! Refund: $${refundAmount.toFixed(2)}`, 'success');
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Receipt className="mx-auto mb-4 text-accent" size={64} />
        <h1 className="text-5xl font-black text-gradient-gold mb-2">Return & Exchange</h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Scan Receipt */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Receipt className="mx-auto mb-6 text-accent" size={80} />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Step 1: Scan Receipt</h2>
            <p className="text-xl text-gray-300 mb-8">
              Place your receipt in front of the scanner
            </p>
            <Button variant="primary" size="xl" onClick={handleScanReceipt}>
              Simulate Scan Receipt
            </Button>
          </motion.div>
        )}

        {/* Step 2: Select Items */}
        {step === 2 && selectedReceipt && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card rounded-3xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Step 2: Select Items to Return</h2>
            <div className="space-y-4 mb-6">
              {selectedReceipt.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleItem(item.product.id)}
                  className={`glass rounded-xl p-6 cursor-pointer transition-all ${
                    selectedItems.has(item.product.id)
                      ? 'ring-4 ring-accent bg-accent/20'
                      : 'hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{item.product.image}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-300 mb-1">Quantity: {item.quantity}</p>
                      <p className="text-gradient-gold text-xl font-bold">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    {selectedItems.has(item.product.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle className="text-accent" size={32} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <Button
              variant="primary"
              size="xl"
              onClick={handleConfirmReturn}
              disabled={selectedItems.size === 0}
              fullWidth
            >
              Confirm Return
            </Button>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle className="mx-auto mb-6 text-green-400" size={100} />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Return Confirmed!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Your return has been processed successfully
            </p>
            <p className="text-gradient-gold text-3xl font-black mb-8">
              Refund Amount: $
              {selectedReceipt
                ?.filter((item) => selectedItems.has(item.product.id))
                .reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </p>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => {
                setStep(1);
                setSelectedReceipt(null);
                setSelectedItems(new Set());
              }}
            >
              Return Another Item
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Return;
