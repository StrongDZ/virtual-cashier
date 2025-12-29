import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, User, Phone, Calendar, CreditCard, LogOut, Receipt, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useToast } from "./ui/ToastProvider";
import Button from "./ui/Button";

interface AccountModalProps {
    onClose: () => void;
}

const AccountModal = ({ onClose }: AccountModalProps) => {
    const { user, receipts, setUser } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showSignIn, setShowSignIn] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            id: Date.now().toString(),
            name: formData.name,
            phone: formData.phone,
            membershipLevel: "silver" as const,
            faceIdEnrolled: false,
        };
        setUser(newUser);
        showToast(`Welcome, ${formData.name}!`, "success");
        setShowSignIn(false);
        setFormData({ name: "", phone: "" });
    };

    const handleLogout = () => {
        setUser(null);
        showToast("Logged out successfully", "info");
        onClose();
    };

    const getMembershipBadge = (level: string) => {
        switch (level) {
            case "gold":
                return "🥇 Gold Member";
            case "platinum":
                return "💎 Platinum Member";
            case "silver":
                return "🥈 Silver Member";
            default:
                return "";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="glass-card rounded-3xl p-8 max-w-md w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-accent transition-colors">
                        <X size={24} />
                    </button>

                    <AnimatePresence mode="wait">
                        {!showSignIn ? (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="text-center"
                            >
                                <User className="mx-auto mb-4 text-accent" size={64} />
                                <h2 className="text-3xl font-black text-gradient-gold mb-4">Welcome!</h2>
                                <p className="text-gray-300 mb-6">Sign in to your account or create a new one</p>
                                <div className="flex gap-4">
                                    <Button variant="secondary" size="lg" onClick={() => setShowSignIn(true)} className="flex-1">
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => {
                                            navigate("/signup");
                                            onClose();
                                        }}
                                        className="flex-1"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="signin"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSignIn}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-white mb-4">Sign In</h2>
                                <div>
                                    <label className="block text-white text-sm font-semibold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-semibold mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none"
                                        placeholder="+84 123 456 789"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="secondary" size="lg" type="button" onClick={() => setShowSignIn(false)} className="flex-1">
                                        Back
                                    </Button>
                                    <Button variant="primary" size="lg" type="submit" className="flex-1">
                                        Sign In
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10">
                    <X size={24} />
                </button>

                {/* User Info Header */}
                <div className="text-center mb-8">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-block mb-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-4xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </motion.div>
                    <h2 className="text-3xl font-black text-white mb-2">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-xl text-gradient-gold font-bold">{getMembershipBadge(user.membershipLevel)}</span>
                        <Sparkles className="text-accent" size={24} />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                    </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4 mb-6">
                    <div className="glass rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                            <User className="text-accent" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Account Type</p>
                            <p className="text-white font-semibold capitalize">{user.membershipLevel} Member</p>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="text-accent" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Face ID</p>
                            <p className="text-white font-semibold">{user.faceIdEnrolled ? "✓ Enrolled" : "Not Enrolled"}</p>
                        </div>
                    </div>
                </div>

                {/* Purchase History */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Receipt size={24} />
                        Purchase History
                    </h3>
                    {receipts.length === 0 ? (
                        <div className="glass rounded-xl p-8 text-center">
                            <Receipt className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-400">No purchase history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {receipts.map((receipt) => (
                                <motion.div
                                    key={receipt.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass rounded-xl p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white font-semibold">Order #{receipt.id.slice(-6)}</p>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(receipt.date)}
                                            </p>
                                        </div>
                                        <p className="text-gradient-gold font-bold text-lg">${receipt.total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <CreditCard size={14} />
                                        <span>{receipt.paymentMethod}</span>
                                        <span>•</span>
                                        <span>{receipt.items.length} item(s)</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <Button variant="secondary" size="lg" onClick={handleLogout} fullWidth className="flex items-center justify-center gap-2">
                    <LogOut size={20} />
                    Log Out
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default AccountModal;
