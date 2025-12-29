import { useState } from 'react';
import { Camera, Search, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '../data/MockData';
import type { Product } from '../data/MockData';
import Button from '../components/ui/Button';
import AddToCartModal from '../components/ui/AddToCartModal';
import BackButton from '../components/ui/BackButton';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';

const TryOn = () => {
  const { addToCart } = useApp();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productToAdd, setProductToAdd] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product, quantity: number, size: string) => {
    addToCart({ product, quantity, selectedSize: size });
    showToast(`${product.name} (Size: ${size}) added to cart!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Camera className="mx-auto mb-4 text-accent" size={64} />
        <h1 className="text-5xl font-black text-gradient-gold mb-2">Virtual Try-On</h1>
        <p className="text-xl text-gray-300">See how items look on you</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection with Search */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Select Product</h2>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`glass rounded-xl p-4 border-2 transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-accent bg-accent/20 scale-105'
                        : 'border-accent/30 hover:border-accent hover:scale-102'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-2">{product.image}</div>
                    <p className="text-white text-sm font-semibold line-clamp-2">{product.name}</p>
                    <p className="text-accent text-xs mt-1">${product.price.toFixed(2)}</p>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-2 text-center py-8 text-gray-400"
                >
                  <p>No products found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add to Cart Button - Small */}
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button
                variant="primary"
                size="md"
                onClick={() => setProductToAdd(selectedProduct)}
                className="w-full"
              >
                <ShoppingCart className="inline mr-2" size={18} />
                Add to Cart
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Virtual Mirror */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Virtual Mirror</h2>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl aspect-[3/4] flex items-center justify-center border-2 border-accent/30 relative overflow-hidden">
            {selectedProduct ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-9xl mb-4">{selectedProduct.image}</div>
                <div className="glass rounded-xl p-4 border border-accent">
                  <p className="text-white text-xl font-semibold mb-2">
                    {selectedProduct.name}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {selectedProduct.isOnSale && selectedProduct.originalPrice ? (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ${selectedProduct.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-gradient-gold text-xl font-bold">
                          ${selectedProduct.price.toFixed(2)}
                        </span>
                        <span className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                          -{selectedProduct.discountPercentage}%
                        </span>
                      </>
                    ) : (
                      <p className="text-gradient-gold text-xl font-bold">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  (Overlay on mannequin placeholder)
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-400">
                <Camera size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">Select a product to try on</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add to Cart Modal */}
      <AnimatePresence>
        {productToAdd && (
          <AddToCartModal
            product={productToAdd}
            onClose={() => setProductToAdd(null)}
            onAdd={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TryOn;
