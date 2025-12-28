import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { HelpCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import HelpModal from "./HelpModal";
import FloatingCart from "./FloatingCart";
import { useApp } from "../context/AppContext";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const { cart } = useApp();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="glass-dark border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl"
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-3xl font-black text-gradient-gold hover:scale-105 transition-transform">
                            VIRTUAL CASHIER
                        </Link>
                        <div className="flex items-center gap-4">
                            {location.pathname !== "/" && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/"
                                        className="glass px-6 py-3 rounded-xl text-white hover:bg-white/20 text-lg font-semibold transition-all"
                                    >
                                        Home
                                    </Link>
                                </motion.div>
                            )}
                            {/* Cart Icon in Header */}
                            <button onClick={() => setShowCart(true)} className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-accent to-accent-dark px-4 py-3 rounded-xl text-white hover:from-accent-light hover:to-accent transition-all cursor-pointer shadow-lg"
                                >
                                    <ShoppingCart size={24} className="text-white" />
                                    {totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-8 w-full">{children}</main>

            {/* Footer */}
            <footer className="glass-dark border-t border-white/10 py-6 mt-auto">
                <div className="container mx-auto px-6 text-center text-gray-400">
                    <p className="text-lg font-light">Virtual Cashier</p>
                </div>
            </footer>

            {/* Floating Help Button */}
            <motion.button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-accent to-accent-dark text-slate-900 rounded-full p-6 shadow-2xl z-50 touch-target"
                aria-label="Help"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
            >
                <HelpCircle size={32} />
            </motion.button>

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

            {/* Floating Cart */}
            <FloatingCart isOpen={showCart} onClose={() => setShowCart(false)} onOpen={() => setShowCart(true)} />
        </div>
    );
};

export default Layout;
