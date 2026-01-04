import { Link } from 'react-router-dom';
import { ShoppingCart, Package, RotateCcw, UserPlus, Sparkles, ArrowRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getRecommendations } from '../data/MockData';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import AddToCartModal from '../components/ui/AddToCartModal';
import { useToast } from '../components/ui/ToastProvider';

const Home = () => {
  const { user, addToCart } = useApp();
  const { showToast } = useToast();
  const recommendations = user ? getRecommendations(user.membershipLevel) : [];
  const [productToAdd, setProductToAdd] = useState<any>(null);

  const handleAddToCart = (product: any, quantity: number, size: string) => {
    addToCart({ product, quantity, selectedSize: size });
    showToast(`${product.name} (Size: ${size}) added to cart!`, 'success');
  };

  const getMembershipBadge = (level: string) => {
    switch (level) {
      case 'gold':
        return '🥇 Gold Member';
      case 'platinum':
        return '💎 Platinum Member';
      case 'silver':
        return '🥈 Silver Member';
      default:
        return '';
    }
  };

  const navItems = [
    {
      icon: ShoppingCart,
      title: 'Start Checkout',
      subtitle: 'Scan Items',
      to: '/scanner',
      gradient: 'from-accent to-accent-dark',
    },
    {
      icon: Package,
      title: 'Catalogue',
      subtitle: 'Browse Products',
      to: '/catalogue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: RotateCcw,
      title: 'Return Items',
      subtitle: 'Scan Receipt',
      to: '/return',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Camera,
      title: 'Virtual Try-On',
      subtitle: 'See How Items Look',
      to: '/try-on',
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden mb-12 h-[400px] md:h-[500px]"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {user ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl text-gradient-gold font-bold">
                  {getMembershipBadge(user.membershipLevel)}
                </span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="text-accent" size={32} />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                Welcome to
                <span className="block text-gradient-gold mt-2">Fashion Store</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">
                Experience luxury shopping with our virtual cashier kiosk
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      {user && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gradient-gold mb-6">
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAdd={() => setProductToAdd(product)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={item.to}>
                <motion.div
                  className={`glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4 h-full min-h-[200px] group cursor-pointer relative overflow-hidden`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0`} />
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                    className="relative z-10"
                  >
                    <Icon size={64} className="text-accent group-hover:text-accent-light transition-colors" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-gradient-gold transition-colors relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-lg text-gray-400 relative z-10">{item.subtitle}</p>
                  <ArrowRight className="absolute bottom-6 right-6 text-gray-400 group-hover:text-accent group-hover:translate-x-2 transition-all z-10" size={24} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Membership Enrollment */}
      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link to="/signup">
            <Button variant="secondary" size="xl" className="inline-flex items-center gap-3">
              <UserPlus size={28} />
              <span>Not a member? Join Now</span>
            </Button>
          </Link>
        </motion.div>
      )}

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

export default Home;
