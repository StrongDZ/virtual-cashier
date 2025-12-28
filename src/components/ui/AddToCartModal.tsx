import { X, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../data/MockData';
import Button from './Button';

interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number, size: string) => void;
}

const AddToCartModal = ({ product, onClose, onAdd }: AddToCartModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.size[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (selectedSize && quantity > 0) {
      onAdd(product, quantity, selectedSize);
      onClose();
    }
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
        className="glass-card rounded-3xl p-8 max-w-md w-full border-2 border-accent relative"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-accent touch-target rounded-lg hover:bg-white/10 p-2"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={32} />
        </motion.button>

        {/* Product Info */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{product.image}</div>
          <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
          <p className="text-gradient-gold text-3xl font-black mb-4">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.size.map((size) => (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all ${
                  selectedSize === size
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 shadow-lg'
                    : 'glass text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="glass rounded-xl p-3 hover:bg-white/20 touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus size={24} className="text-white" />
            </motion.button>
            <span className="text-3xl font-bold text-white min-w-[60px] text-center">
              {quantity}
            </span>
            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="glass rounded-xl p-3 hover:bg-white/20 touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={24} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Add Button */}
        <Button
          variant="primary"
          size="xl"
          onClick={handleAdd}
          fullWidth
          disabled={!selectedSize || quantity <= 0}
        >
          Add to Cart ({quantity})
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AddToCartModal;

