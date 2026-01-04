import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Calendar, CreditCard, LogOut, Receipt, Sparkles, Lock, Mail, Camera, X, ScanLine, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/ui/ToastProvider";
import Button from "../components/ui/Button";
import BackButton from "../components/ui/BackButton";

const Account = () => {
    const { user, receipts, setUser, signIn, signInWithFaceId, users } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showSignIn, setShowSignIn] = useState(false);
    const [signInMethod, setSignInMethod] = useState<'phone' | 'faceid'>('phone');
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    // FaceID states
    const [showFaceScan, setShowFaceScan] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Check if any user has FaceID enrolled
    const hasFaceIdUsers = users.some(u => u.faceIdEnrolled);

    // Start camera when face scan modal opens
    useEffect(() => {
        if (showFaceScan) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [showFaceScan]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            // Simulate face detection after camera loads
            const detectionTimer = setTimeout(() => {
                setFaceDetected(true);
            }, 1500);
            return () => {
                clearTimeout(detectionTimer);
            };
        } catch (error) {
            console.error("Error accessing camera:", error);
            showToast("Cannot access camera. Please allow camera permissions.", "error");
            setShowFaceScan(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleStartFaceScan = () => {
        setIsScanning(true);
        setScanProgress(0);

        // Simulate face scanning progress
        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    handleFaceScanComplete();
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    const handleFaceScanComplete = () => {
        setTimeout(() => {
            stopCamera();
            setShowFaceScan(false);
            setIsScanning(false);
            setScanProgress(0);
            setFaceDetected(false);
            
            // Try to sign in with FaceID
            const foundUser = signInWithFaceId();
            if (foundUser) {
                showToast(`Welcome back, ${foundUser.name}!`, "success");
                setShowSignIn(false);
            } else {
                showToast("Face not recognized. Please try again or use phone/password.", "error");
            }
        }, 500);
    };

    const handleCloseFaceScan = () => {
        stopCamera();
        setShowFaceScan(false);
        setIsScanning(false);
        setScanProgress(0);
        setFaceDetected(false);
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        const foundUser = signIn(formData.phone, formData.password);
        if (foundUser) {
            showToast(`Welcome back, ${foundUser.name}!`, "success");
            setShowSignIn(false);
            setFormData({ phone: "", password: "" });
        } else {
            showToast("Invalid phone number or password", "error");
        }
    };

    const handleLogout = () => {
        setUser(null);
        showToast("Logged out successfully", "info");
        navigate("/");
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
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <BackButton />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-8"
                >
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
                                        onClick={() => navigate("/signup")}
                                        className="flex-1"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signin"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white text-center mb-6">Sign In</h2>
                                
                                {/* Sign In Method Tabs */}
                                <div className="flex gap-2 p-1 glass rounded-xl">
                                    <button
                                        onClick={() => setSignInMethod('phone')}
                                        className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                            signInMethod === 'phone'
                                                ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 font-semibold'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Phone size={18} />
                                        Phone & Password
                                    </button>
                                    <button
                                        onClick={() => setSignInMethod('faceid')}
                                        className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                            signInMethod === 'faceid'
                                                ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 font-semibold'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Camera size={18} />
                                        Face ID
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {signInMethod === 'phone' ? (
                                        <motion.form
                                            key="phone-form"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onSubmit={handleSignIn}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
                                                    <Phone size={16} />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none"
                                                    placeholder="+84 123 456 789"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
                                                    <Lock size={16} />
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none"
                                                    placeholder="Enter your password"
                                                />
                                            </div>
                                            <div className="flex gap-4 pt-2">
                                                <Button variant="secondary" size="lg" type="button" onClick={() => setShowSignIn(false)} className="flex-1">
                                                    Back
                                                </Button>
                                                <Button variant="primary" size="lg" type="submit" className="flex-1">
                                                    Sign In
                                                </Button>
                                            </div>
                                        </motion.form>
                                    ) : (
                                        <motion.div
                                            key="faceid-form"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            {/* FaceID Sign In UI */}
                                            <div className="text-center py-6">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="inline-block mb-4"
                                                >
                                                    <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent-dark/20 rounded-full flex items-center justify-center border-2 border-accent/50">
                                                        <Camera className="text-accent" size={40} />
                                                    </div>
                                                </motion.div>
                                                <h3 className="text-xl font-bold text-white mb-2">Sign in with Face ID</h3>
                                                <p className="text-gray-400 text-sm mb-6">
                                                    {hasFaceIdUsers 
                                                        ? "Quick and secure sign-in using your face"
                                                        : "No Face ID enrolled yet. Please sign up first to enroll your Face ID."
                                                    }
                                                </p>
                                                
                                                <Button
                                                    variant="primary"
                                                    size="xl"
                                                    onClick={() => setShowFaceScan(true)}
                                                    className="w-full mb-4"
                                                    disabled={!hasFaceIdUsers}
                                                >
                                                    <ScanLine className="mr-2" size={20} />
                                                    Start Face Scan
                                                </Button>

                                                {!hasFaceIdUsers && (
                                                    <p className="text-orange-400 text-sm">
                                                        💡 Tip: Sign up and enroll Face ID during registration
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-4">
                                                <Button variant="secondary" size="lg" type="button" onClick={() => setShowSignIn(false)} className="flex-1">
                                                    Back
                                                </Button>
                                                <Button variant="ghost" size="lg" onClick={() => navigate("/signup")} className="flex-1">
                                                    Sign Up Instead
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Face Scan Modal */}
                <AnimatePresence>
                    {showFaceScan && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={handleCloseFaceScan}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="glass-card rounded-3xl p-8 max-w-2xl w-full relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseFaceScan}
                                    className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
                                >
                                    <X size={24} />
                                </button>

                                <h2 className="text-3xl font-bold text-white mb-6 text-center">Face ID Sign In</h2>

                                {/* Camera View */}
                                <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-6 aspect-video">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                        style={{ transform: "scaleX(-1)" }}
                                    />

                                    {/* Scanning Overlay */}
                                    {isScanning && (
                                        <>
                                            {/* Scanning Grid */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                                                    {Array.from({ length: 9 }).map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="border-2 border-accent/30 rounded"
                                                            animate={{
                                                                borderColor: ["rgba(255, 215, 0, 0.3)", "rgba(255, 215, 0, 1)", "rgba(255, 215, 0, 0.3)"],
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                delay: i * 0.1,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Scanning Line Animation */}
                                            <motion.div
                                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
                                                initial={{ top: "0%" }}
                                                animate={{ top: "100%" }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            />

                                            {/* Face Detection Circle */}
                                            <motion.div
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-accent rounded-full"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                <div className="absolute inset-0 border-4 border-accent/50 rounded-full animate-ping" />
                                            </motion.div>

                                            {/* Progress Indicator */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4">
                                                <div className="bg-slate-800/80 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-accent to-accent-dark"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scanProgress}%` }}
                                                        transition={{ duration: 0.1 }}
                                                    />
                                                </div>
                                                <p className="text-center text-white mt-2 text-sm">Verifying... {scanProgress}%</p>
                                            </div>
                                        </>
                                    )}

                                    {/* Face Guide Overlay */}
                                    {!isScanning && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="text-center">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className={`w-64 h-80 border-4 rounded-3xl mb-4 relative ${
                                                        faceDetected ? "border-green-400 shadow-lg shadow-green-400/50" : "border-accent/50"
                                                    }`}
                                                >
                                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-2 border-accent/30 rounded-full" />
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-accent/30 rounded-full" />

                                                    {/* Face Detected Indicator */}
                                                    {faceDetected && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: "spring", delay: 0.2 }}
                                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                                        >
                                                            <div className="bg-green-500 rounded-full p-4 shadow-2xl">
                                                                <CheckCircle className="text-white" size={48} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                                <AnimatePresence mode="wait">
                                                    {faceDetected ? (
                                                        <motion.p
                                                            key="detected"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="text-green-400 text-xl font-bold"
                                                        >
                                                            ✓ Face Detected
                                                        </motion.p>
                                                    ) : (
                                                        <motion.p
                                                            key="positioning"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-white text-lg font-semibold"
                                                        >
                                                            Position your face within the frame
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button variant="secondary" size="lg" onClick={handleCloseFaceScan} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleStartFaceScan}
                                        disabled={isScanning || !faceDetected}
                                        className="flex-1"
                                    >
                                        {isScanning ? (
                                            <>
                                                <Loader2 className="inline mr-2 animate-spin" size={20} />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <ScanLine className="inline mr-2" size={20} />
                                                {faceDetected ? "Verify Face" : "Waiting for face..."}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <BackButton />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8"
            >
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
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
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
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
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
        </div>
    );
};

export default Account;
