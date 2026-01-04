import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, X, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PRODUCTS_PER_PAGE = 6;

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
  const [currentPage, setCurrentPage] = useState(1);

  const toggleFilter = (value: string, selected: string[], setter: (value: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  // Listen for voice filter commands
  useEffect(() => {
    const handleVoiceFilter = (event: CustomEvent<{ gender: string }>) => {
      const { gender } = event.detail;
      if (gender === 'men') {
        setSelectedCategory(['Men']);
        showToast('Showing men\'s clothing', 'info');
      } else if (gender === 'women') {
        setSelectedCategory(['Women']);
        showToast('Showing women\'s clothing', 'info');
      } else if (gender === 'all') {
        setSelectedCategory([]);
        showToast('Showing all products', 'info');
      }
    };

    window.addEventListener('voice-filter', handleVoiceFilter as EventListener);
    return () => {
      window.removeEventListener('voice-filter', handleVoiceFilter as EventListener);
    };
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
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
  }, [selectedCategory, selectedSize, selectedSeason, selectedBrand, selectedClothingType, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSize, selectedSeason, selectedBrand, selectedClothingType, searchQuery]);

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

      {/* Active Filter Indicator */}
      {selectedCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex items-center gap-2"
        >
          <span className="text-gray-400">Showing:</span>
          {selectedCategory.map(cat => (
            <span key={cat} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {cat}
            </span>
          ))}
          <button 
            onClick={() => setSelectedCategory([])}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Clear
          </button>
        </motion.div>
      )}

      {/* Product Grid - Fixed minimum height to prevent pagination jumping */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={`products-page-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedProducts.map((product, index) => (
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          {/* Previous Button - Yellow & Larger */}
          <motion.button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === 1
                ? 'bg-accent/30 text-accent/50 cursor-not-allowed'
                : 'bg-accent text-slate-900 hover:bg-accent-light shadow-lg'
            }`}
            whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft size={32} />
          </motion.button>

          {/* Page Numbers with Ellipsis */}
          <div className="flex items-center gap-2">
            {(() => {
              const pages: (number | string)[] = [];
              
              if (totalPages <= 5) {
                // Show all pages if 5 or fewer
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);
                
                if (currentPage > 3) {
                  pages.push('...');
                }
                
                // Show pages around current
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                
                for (let i = start; i <= end; i++) {
                  if (!pages.includes(i)) {
                    pages.push(i);
                  }
                }
                
                if (currentPage < totalPages - 2) {
                  pages.push('...');
                }
                
                // Always show last page
                if (!pages.includes(totalPages)) {
                  pages.push(totalPages);
                }
              }
              
              return pages.map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="text-gray-400 px-2 text-xl">
                    ...
                  </span>
                ) : (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                      currentPage === page
                        ? 'bg-accent text-slate-900 shadow-lg'
                        : 'glass text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                )
              ));
            })()}
          </div>

          {/* Next Button - Yellow & Larger */}
          <motion.button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-4 rounded-2xl transition-all ${
              currentPage === totalPages
                ? 'bg-accent/30 text-accent/50 cursor-not-allowed'
                : 'bg-accent text-slate-900 hover:bg-accent-light shadow-lg'
            }`}
            whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            <ChevronRight size={32} />
          </motion.button>

          {/* Page Info */}
          <span className="text-gray-400 ml-4 text-sm">
            {filteredProducts.length} sản phẩm
          </span>
        </motion.div>
      )}

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
