import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '../../data/MockData';
import Button from './Button';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
  onClick?: (product: Product) => void;
  index?: number;
}

const ProductCard = ({ product, onAdd, onClick, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div
        className={cn(
          'glass-card rounded-2xl p-6 cursor-pointer h-full',
          'hover:bg-white/10 transition-all duration-300'
        )}
        onClick={() => onClick?.(product)}
      >
        {/* Product Image/Emoji */}
        <div className="relative mb-4 aspect-square flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
            {product.image}
          </span>
          
          {/* Sale Badge */}
          {product.isOnSale && (
            <div className="absolute top-2 left-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white backdrop-blur-md">
                -{product.discountPercentage}%
              </span>
            </div>
          )}
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md',
                product.inStock
                  ? 'bg-green-500/80 text-white'
                  : 'bg-red-500/80 text-white'
              )}
            >
              {product.inStock ? 'In Stock' : 'Out'}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
          
          {/* Price and Sizes */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.isOnSale && product.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-gradient-gold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gradient-gold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {product.size.slice(0, 3).map((size) => (
                  <span
                    key={size}
                    className="px-2 py-1 bg-slate-800/50 rounded text-xs text-gray-300"
                  >
                    {size}
                  </span>
                ))}
                {product.size.length > 3 && (
                  <span className="px-2 py-1 bg-slate-800/50 rounded text-xs text-gray-300">
                    +{product.size.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Button - Appears on Hover */}
        {onAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => onAdd(product)}
              className="shadow-2xl"
            >
              <Plus className="inline mr-2" size={20} />
              Add to Cart
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;

