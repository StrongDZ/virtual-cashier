import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '../data/MockData';
import type { Product } from '../data/MockData';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import AddToCartModal from '../components/ui/AddToCartModal';
import FilterModal from '../components/ui/FilterModal';
import BackButton from '../components/ui/BackButton';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';

const Catalogue = () => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedClothingType, setSelectedClothingType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToAdd, setProductToAdd] = useState<Product | null>(null);

  const toggleFilter = (value: string, selected: string[], setter: (value: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const filteredProducts = mockProducts.filter((product) => {
    const categoryMatch = 
      selectedCategory.length === 0 || selectedCategory.includes(product.category);
    const sizeMatch = 
      selectedSize.length === 0 || product.size.some((s) => selectedSize.includes(s));
    const seasonMatch = 
      selectedSeason.length === 0 || (product.season && selectedSeason.includes(product.season));
    const brandMatch = 
      selectedBrand.length === 0 || (product.brand && selectedBrand.includes(product.brand));
    const clothingTypeMatch = 
      selectedClothingType.length === 0 || (product.clothingType && selectedClothingType.includes(product.clothingType));
    const searchMatch = 
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && sizeMatch && seasonMatch && brandMatch && clothingTypeMatch && searchMatch;
  });

  const activeFiltersCount = [
    selectedCategory.length > 0,
    selectedSize.length > 0,
    selectedSeason.length > 0,
    selectedBrand.length > 0,
    selectedClothingType.length > 0,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSelectedCategory([]);
    setSelectedSize([]);
    setSelectedSeason([]);
    setSelectedBrand([]);
    setSelectedClothingType([]);
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
        <Package className="mx-auto mb-4 text-accent" size={64} />
        <h1 className="text-5xl font-black text-gradient-gold mb-2">Clothing Catalogue</h1>
      </motion.div>

      {/* Search Bar with Filter Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full pl-14 pr-4 py-4 rounded-2xl glass text-white placeholder-gray-400 text-lg focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
          </div>
          <motion.button
            onClick={() => setShowFilterModal(true)}
            className="bg-gradient-to-r from-accent to-accent-dark text-slate-900 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:from-accent-light hover:to-accent transition-all relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={24} />
            {activeFiltersCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
              {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAdd={() => setProductToAdd(product)}
                onClick={setSelectedProduct}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400">No products found</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card rounded-3xl p-8 max-w-2xl w-full border-2 border-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-8xl">{selectedProduct.image}</div>
                <motion.button
                  onClick={() => setSelectedProduct(null)}
                  className="text-white hover:text-accent touch-target rounded-lg hover:bg-white/10 p-2"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={32} />
                </motion.button>
              </div>

              <h2 className="text-4xl font-black text-white mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-6">
                {selectedProduct.isOnSale && selectedProduct.originalPrice ? (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 line-through text-2xl">
                      ${selectedProduct.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-gradient-gold text-4xl font-black">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500/80 text-white text-sm px-3 py-1 rounded-full font-bold">
                      -{selectedProduct.discountPercentage}% OFF
                    </span>
                  </div>
                ) : (
                  <p className="text-gradient-gold text-4xl font-black">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-white text-lg font-semibold mb-3">Available Sizes:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.size.map((size) => (
                    <span
                      key={size}
                      className="px-4 py-2 glass rounded-lg text-white text-lg font-semibold"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className={`text-center py-3 rounded-lg font-semibold ${
                  selectedProduct.inStock
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                    : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                }`}>
                  {selectedProduct.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    navigate('/try-on');
                    setSelectedProduct(null);
                  }}
                  className="flex-1"
                >
                  Try On
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setProductToAdd(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedCategory={selectedCategory}
        selectedSize={selectedSize}
        selectedSeason={selectedSeason}
        selectedBrand={selectedBrand}
        selectedClothingType={selectedClothingType}
        onCategoryChange={(cat) => toggleFilter(cat, selectedCategory, setSelectedCategory)}
        onSizeChange={(size) => toggleFilter(size, selectedSize, setSelectedSize)}
        onSeasonChange={(season) => toggleFilter(season, selectedSeason, setSelectedSeason)}
        onBrandChange={(brand) => toggleFilter(brand, selectedBrand, setSelectedBrand)}
        onClothingTypeChange={(type) => toggleFilter(type, selectedClothingType, setSelectedClothingType)}
        onReset={handleResetFilters}
      />
    </div>
  );
};

export default Catalogue;
