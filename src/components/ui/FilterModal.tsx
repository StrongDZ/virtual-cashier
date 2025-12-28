import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string[];
  selectedSize: string[];
  selectedSeason: string[];
  selectedBrand: string[];
  selectedClothingType: string[];
  onCategoryChange: (category: string) => void;
  onSizeChange: (size: string) => void;
  onSeasonChange: (season: string) => void;
  onBrandChange: (brand: string) => void;
  onClothingTypeChange: (type: string) => void;
  onReset: () => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedSize,
  selectedSeason,
  selectedBrand,
  selectedClothingType,
  onCategoryChange,
  onSizeChange,
  onSeasonChange,
  onBrandChange,
  onClothingTypeChange,
  onReset,
}: FilterModalProps) => {
  if (!isOpen) return null;

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
        className="glass-card rounded-3xl p-8 max-w-3xl w-full border-2 border-accent max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Filters</h2>
          <motion.button
            onClick={onClose}
            className="text-white hover:text-accent touch-target rounded-lg hover:bg-white/10 p-2"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={32} />
          </motion.button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {['Men', 'Women', 'Unisex'].map((cat) => {
              const isSelected = selectedCategory.includes(cat.toLowerCase());
              return (
                <motion.button
                  key={cat}
                  onClick={() => onCategoryChange(cat.toLowerCase())}
                  className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 shadow-lg'
                      : 'glass text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                  {isSelected && (
                    <Check className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1" size={16} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Clothing Type Filter */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">Clothing Type</label>
          <div className="flex flex-wrap gap-2">
            {['Shirt', 'T-Shirt', 'Pants', 'Jeans', 'Dress', 'Jacket', 'Blazer', 'Accessory'].map((type) => {
              const isSelected = selectedClothingType.includes(type);
              return (
                <motion.button
                  key={type}
                  onClick={() => onClothingTypeChange(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-accent text-slate-900'
                      : 'glass text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {type}
                  {isSelected && (
                    <Check className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1" size={14} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">Size</label>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', 'One Size'].map((size) => {
              const isSelected = selectedSize.includes(size);
              return (
                <motion.button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-accent text-slate-900'
                      : 'glass text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {size}
                  {isSelected && (
                    <Check className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1" size={14} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Season Filter */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">Season</label>
          <div className="flex flex-wrap gap-2">
            {['Spring', 'Summer', 'Fall', 'Winter', 'All Season'].map((season) => {
              const isSelected = selectedSeason.includes(season);
              return (
                <motion.button
                  key={season}
                  onClick={() => onSeasonChange(season)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-accent text-slate-900'
                      : 'glass text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {season}
                  {isSelected && (
                    <Check className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1" size={14} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <label className="block text-white text-lg font-semibold mb-3">Brand</label>
          <div className="flex flex-wrap gap-2">
            {['Fashion Store', 'Premium', 'Classic', 'Designer'].map((brand) => {
              const isSelected = selectedBrand.includes(brand);
              return (
                <motion.button
                  key={brand}
                  onClick={() => onBrandChange(brand)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-accent text-slate-900'
                      : 'glass text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {brand}
                  {isSelected && (
                    <Check className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-1" size={14} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t-2 border-accent/30">
          <Button variant="ghost" size="lg" onClick={onReset} className="flex-1">
            Reset Filters
          </Button>
          <Button variant="primary" size="lg" onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal;
