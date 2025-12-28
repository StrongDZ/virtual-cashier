import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "./ui/ToastProvider";
import Button from "./ui/Button";

interface FloatingCartProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const FloatingCart = ({ isOpen, onClose }: FloatingCartProps) => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
    const { showToast } = useToast();

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleClearCart = () => {
        clearCart();
        showToast("Cart cleared", "info");
        onClose();
    };

    return (
        <>
            {/* Cart Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md glass-card z-50 flex flex-col shadow-glass-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b-2 border-accent/30">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="text-accent" size={32} />
                                    <h2 className="text-2xl font-bold text-white">
                                        Your Cart
                                        {totalItems > 0 && <span className="ml-2 text-accent">({totalItems})</span>}
                                    </h2>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="text-white hover:text-accent touch-target rounded-lg hover:bg-white/10 p-2"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={32} />
                                </motion.button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <AnimatePresence>
                                    {cart.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-16 text-gray-400"
                                        >
                                            <ShoppingCart size={80} className="mx-auto mb-4 opacity-30" />
                                            <p className="text-2xl font-semibold mb-2">Your cart is empty</p>
                                            <p className="text-lg">Add items to get started</p>
                                        </motion.div>
                                    ) : (
                                        cart.map((item, index) => {
                                            const itemKey = `${item.product.id}-${item.selectedSize}`;
                                            return (
                                                <motion.div
                                                    key={itemKey}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="glass rounded-xl p-4"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="text-4xl">{item.product.image}</div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-white mb-1">{item.product.name}</h3>
                                                            <p className="text-sm text-gray-400 mb-2">
                                                                Size: <span className="text-accent font-semibold">{item.selectedSize}</span>
                                                            </p>
                                                            <p className="text-gradient-gold text-lg font-bold">${item.product.price.toFixed(2)}</p>
                                                        </div>
                                                        <motion.button
                                                            onClick={() => {
                                                                removeFromCart(item.product.id, item.selectedSize);
                                                                showToast("Item removed", "info");
                                                            }}
                                                            className="text-red-400 hover:text-red-300 touch-target p-2 rounded-lg hover:bg-red-500/10"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Trash2 size={20} />
                                                        </motion.button>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-4">
                                                        <motion.button
                                                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                                                            className="glass rounded-lg p-2 hover:bg-white/20 touch-target"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Minus size={18} className="text-white" />
                                                        </motion.button>
                                                        <span className="text-lg font-bold text-white min-w-[30px] text-center">{item.quantity}</span>
                                                        <motion.button
                                                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                                                            className="glass rounded-lg p-2 hover:bg-white/20 touch-target"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Plus size={18} className="text-white" />
                                                        </motion.button>
                                                        <div className="ml-auto text-lg font-bold text-gradient-gold">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            {cart.length > 0 && (
                                <div className="border-t-2 border-accent/30 p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-semibold text-white">Total:</span>
                                        <span className="text-3xl font-black text-gradient-gold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="ghost" size="md" onClick={handleClearCart} className="flex-1">
                                            Clear Cart
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            onClick={() => {
                                                navigate("/payment");
                                                onClose();
                                            }}
                                            className="flex-1"
                                        >
                                            Checkout
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingCart;
