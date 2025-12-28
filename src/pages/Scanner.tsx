import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getRandomProduct } from '../data/MockData';
import { useToast } from '../components/ui/ToastProvider';
import Button from '../components/ui/Button';

const Scanner = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const { showToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const product = getRandomProduct();
      const defaultSize = product.size[0] || 'M';
      addToCart({ product, quantity: 1, selectedSize: defaultSize });
      showToast(`${product.name} (Size: ${defaultSize}) added to cart!`, 'success');
      setIsScanning(false);
    }, 1500);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black text-gradient-gold mb-8 text-center"
      >
        Item Scanner
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Camera View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden border-2 border-accent/30">
            {/* Scanning Corner Markers */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Left */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-accent rounded-tl-lg" />
              {/* Top Right */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-accent rounded-tr-lg" />
              {/* Bottom Left */}
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-accent rounded-bl-lg" />
              {/* Bottom Right */}
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-accent rounded-br-lg" />
            </div>

            {/* Scanning Laser Line */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}

            {/* Content */}
            {isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-accent text-5xl mb-4 font-bold"
                  >
                    Scanning...
                  </motion.div>
                  <ScanLine className="mx-auto text-accent" size={64} />
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                <ScanLine className="mx-auto text-accent/50 mb-4" size={80} />
                <p className="text-gray-400 text-lg">Position item in viewfinder</p>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="xl"
            onClick={handleSimulateScan}
            disabled={isScanning}
            fullWidth
          >
            {isScanning ? 'Scanning...' : 'Simulate Scan Item'}
          </Button>
        </motion.div>

        {/* Right Side - Cart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-accent" size={36} />
            <h2 className="text-3xl font-bold text-white">Your Cart</h2>
            {cart.length > 0 && (
              <span className="ml-auto px-4 py-1 bg-accent/20 text-accent rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {cart.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-gray-400"
              >
                <ShoppingCart size={80} className="mx-auto mb-4 opacity-30" />
                <p className="text-2xl font-semibold mb-2">Your cart is empty</p>
                <p className="text-lg">Scan items to add them</p>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-4xl mb-2">{item.product.image}</div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-1">
                            Size: <span className="text-accent font-semibold">{item.selectedSize}</span>
                          </p>
                          <p className="text-gradient-gold text-lg font-bold">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                          <motion.button
                            onClick={() => {
                              removeFromCart(item.product.id, item.selectedSize);
                              showToast('Item removed', 'info');
                            }}
                            className="text-red-400 hover:text-red-300 touch-target p-2 rounded-lg hover:bg-red-500/10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={24} />
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-4">
                          <motion.button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                            className="glass rounded-lg p-2 hover:bg-white/20 touch-target"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={20} className="text-white" />
                          </motion.button>
                          <span className="text-xl font-bold text-white min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                            className="glass rounded-lg p-2 hover:bg-white/20 touch-target"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={20} className="text-white" />
                          </motion.button>
                          <div className="ml-auto text-xl font-bold text-gradient-gold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t-2 border-accent/30 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">Total:</span>
                    <span className="text-4xl font-black text-gradient-gold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      clearCart();
                      showToast('Cart cleared', 'info');
                    }}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/payment')}
                    disabled={cart.length === 0}
                    className="flex-1"
                  >
                    <CreditCard className="inline mr-2" size={20} />
                    Pay Now
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Scanner;
