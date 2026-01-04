import { useState, useMemo } from 'react';
import { Camera, Search, ShoppingCart, User, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductsByBodyPart, getDefaultProductForBodyPart } from '../data/MockData';
import type { Product, BodyPart } from '../data/MockData';
import Button from '../components/ui/Button';
import AddToCartModal from '../components/ui/AddToCartModal';
import BackButton from '../components/ui/BackButton';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';

// Body part configuration
const bodyParts: { id: BodyPart; name: string; icon: string; position: string }[] = [
  { id: 'head', name: 'Head', icon: '🧢', position: 'Head & Hat' },
  { id: 'top', name: 'Top', icon: '👕', position: 'Upper Body' },
  { id: 'bottom', name: 'Bottom', icon: '👖', position: 'Lower Body' },
  { id: 'feet', name: 'Feet', icon: '👟', position: 'Footwear' },
  { id: 'accessory', name: 'Accessory', icon: '⌚', position: 'Accessories' },
];

const TryOn = () => {
  const { addToCart } = useApp();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [productToAdd, setProductToAdd] = useState<Product | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('top');
  const [showProductList, setShowProductList] = useState(true);
  
  // Selected products for each body part (initialized with defaults)
  const [selectedProducts, setSelectedProducts] = useState<Record<BodyPart, Product | null>>(() => {
    const defaults: Record<BodyPart, Product | null> = {
      head: getDefaultProductForBodyPart('head') || null,
      top: getDefaultProductForBodyPart('top') || null,
      bottom: getDefaultProductForBodyPart('bottom') || null,
      feet: getDefaultProductForBodyPart('feet') || null,
      accessory: getDefaultProductForBodyPart('accessory') || null,
    };
    return defaults;
  });

  // Get products for the selected body part
  const bodyPartProducts = useMemo(() => {
    return getProductsByBodyPart(selectedBodyPart);
  }, [selectedBodyPart]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return bodyPartProducts;
    return bodyPartProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bodyPartProducts, searchQuery]);

  // Handle product selection for a body part
  const handleSelectProduct = (product: Product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [selectedBodyPart]: product,
    }));
    showToast(`${product.name} selected for ${selectedBodyPart}`, 'success');
  };

  // Clear product from a body part
  const handleClearBodyPart = (bodyPart: BodyPart) => {
    setSelectedProducts(prev => ({
      ...prev,
      [bodyPart]: null,
    }));
  };

  // Calculate total price of all selected products
  const totalPrice = useMemo(() => {
    return Object.values(selectedProducts).reduce((sum, product) => {
      return sum + (product?.price || 0);
    }, 0);
  }, [selectedProducts]);

  // Add all selected products to cart
  const handleAddAllToCart = () => {
    const products = Object.values(selectedProducts).filter(p => p !== null) as Product[];
    if (products.length === 0) {
      showToast('No products selected', 'error');
      return;
    }
    products.forEach(product => {
      addToCart({ product, quantity: 1, selectedSize: product.size[0] || 'M' });
    });
    showToast(`Added ${products.length} items to cart!`, 'success');
  };

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
        <p className="text-xl text-gray-300">Mix and match to create your perfect outfit</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Product Selection & Body Parts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Product Search & Selection */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Select Product</h2>
              <button
                onClick={() => setShowProductList(!showProductList)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showProductList ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            
            <AnimatePresence>
              {showProductList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Category Tabs for Body Parts */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {bodyParts.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => {
                          setSelectedBodyPart(part.id);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                          selectedBodyPart === part.id
                            ? 'bg-accent text-slate-900 font-bold'
                            : 'glass text-white hover:bg-white/20'
                        }`}
                      >
                        <span>{part.icon}</span>
                        <span className="text-sm">{part.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${bodyParts.find(p => p.id === selectedBodyPart)?.name.toLowerCase()}...`}
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                    />
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <motion.button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`glass rounded-xl p-3 border-2 transition-all ${
                            selectedProducts[selectedBodyPart]?.id === product.id
                              ? 'border-accent bg-accent/20'
                              : 'border-white/10 hover:border-accent/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-3xl mb-1">{product.image}</div>
                          <p className="text-white text-xs font-medium line-clamp-1">{product.name}</p>
                          <p className="text-accent text-xs">${product.price.toFixed(2)}</p>
                        </motion.button>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-6 text-gray-400">
                        <p>No products found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Body Parts Overview */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Outfit</h2>
            <div className="space-y-3">
              {bodyParts.map((part, index) => {
                const selectedProduct = selectedProducts[part.id];
                return (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                      selectedBodyPart === part.id
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setSelectedBodyPart(part.id);
                      setShowProductList(true);
                    }}
                  >
                    {/* Body Part Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-2xl">
                      {selectedProduct ? selectedProduct.image : part.icon}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">{part.position}</p>
                      {selectedProduct ? (
                        <>
                          <p className="text-white font-medium truncate">{selectedProduct.name}</p>
                          <p className="text-accent text-sm">${selectedProduct.price.toFixed(2)}</p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No item selected</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {selectedProduct && (
                        <>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToAdd(selectedProduct);
                            }}
                            className="p-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ShoppingCart size={16} />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearBodyPart(part.id);
                            }}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ✕
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Total & Add All */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total Outfit Price:</span>
                <span className="text-2xl font-bold text-gradient-gold">${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddAllToCart}
                fullWidth
                disabled={Object.values(selectedProducts).every(p => p === null)}
              >
                <ShoppingCart className="inline mr-2" size={20} />
                Add Entire Outfit to Cart
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Virtual Mannequin */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Virtual Mirror</h2>
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={20} />
              <span className="text-sm">Live Preview</span>
            </div>
          </div>
          
          {/* Mannequin Display */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl aspect-[3/4] relative overflow-hidden border-2 border-accent/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Mannequin Silhouette */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <User className="text-white/10 absolute" size={300} />
              
              {/* Product Display Stack */}
              <div className="relative z-10 flex flex-col items-center gap-2 py-8">
                {/* Head */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedProducts.head ? (
                    <motion.div
                      key={selectedProducts.head.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-6xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setSelectedBodyPart('head');
                        setShowProductList(true);
                      }}
                      title={selectedProducts.head.name}
                    >
                      {selectedProducts.head.image}
                    </motion.div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white/30 cursor-pointer hover:border-accent hover:text-accent transition-colors"
                      onClick={() => {
                        setSelectedBodyPart('head');
                        setShowProductList(true);
                      }}
                    >
                      🧢
                    </div>
                  )}
                </motion.div>

                {/* Top */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedProducts.top ? (
                    <motion.div
                      key={selectedProducts.top.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-8xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setSelectedBodyPart('top');
                        setShowProductList(true);
                      }}
                      title={selectedProducts.top.name}
                    >
                      {selectedProducts.top.image}
                    </motion.div>
                  ) : (
                    <div
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center text-white/30 text-4xl cursor-pointer hover:border-accent hover:text-accent transition-colors"
                      onClick={() => {
                        setSelectedBodyPart('top');
                        setShowProductList(true);
                      }}
                    >
                      👕
                    </div>
                  )}
                </motion.div>

                {/* Bottom */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedProducts.bottom ? (
                    <motion.div
                      key={selectedProducts.bottom.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-8xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setSelectedBodyPart('bottom');
                        setShowProductList(true);
                      }}
                      title={selectedProducts.bottom.name}
                    >
                      {selectedProducts.bottom.image}
                    </motion.div>
                  ) : (
                    <div
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center text-white/30 text-4xl cursor-pointer hover:border-accent hover:text-accent transition-colors"
                      onClick={() => {
                        setSelectedBodyPart('bottom');
                        setShowProductList(true);
                      }}
                    >
                      👖
                    </div>
                  )}
                </motion.div>

                {/* Feet */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {selectedProducts.feet ? (
                    <motion.div
                      key={selectedProducts.feet.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-6xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setSelectedBodyPart('feet');
                        setShowProductList(true);
                      }}
                      title={selectedProducts.feet.name}
                    >
                      {selectedProducts.feet.image}
                    </motion.div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center text-white/30 text-2xl cursor-pointer hover:border-accent hover:text-accent transition-colors"
                      onClick={() => {
                        setSelectedBodyPart('feet');
                        setShowProductList(true);
                      }}
                    >
                      👟
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Accessory - Floating to the side */}
              <motion.div
                className="absolute right-8 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {selectedProducts.accessory ? (
                  <motion.div
                    key={selectedProducts.accessory.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => {
                      setSelectedBodyPart('accessory');
                      setShowProductList(true);
                    }}
                    title={selectedProducts.accessory.name}
                  >
                    {selectedProducts.accessory.image}
                  </motion.div>
                ) : (
                  <div
                    className="w-14 h-14 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white/30 cursor-pointer hover:border-accent hover:text-accent transition-colors"
                    onClick={() => {
                      setSelectedBodyPart('accessory');
                      setShowProductList(true);
                    }}
                  >
                    ⌚
                  </div>
                )}
              </motion.div>
            </div>

            {/* Selected Product Info Overlay */}
            {selectedProducts[selectedBodyPart] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="glass rounded-xl p-4 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedProducts[selectedBodyPart]?.image}</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{selectedProducts[selectedBodyPart]?.name}</p>
                      <p className="text-accent">${selectedProducts[selectedBodyPart]?.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setProductToAdd(selectedProducts[selectedBodyPart])}
                    >
                      <ShoppingCart size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p>💡 Click on any body part to change the item</p>
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
