import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, User, Loader2, CheckCircle, Printer, Mail, X, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/ui/ToastProvider";
import Button from "../components/ui/Button";
import BackButton from "../components/ui/BackButton";

const Payment = () => {
    const navigate = useNavigate();
    const { cart, clearCart, addReceipt, user } = useApp();
    const { showToast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "faceid" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [showFaceIdScan, setShowFaceIdScan] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Start camera when FaceID scan modal opens
    useEffect(() => {
        if (showFaceIdScan) {
            startCamera();
            setFaceDetected(false);
            // Simulate face detection after camera loads
            const detectionTimer = setTimeout(() => {
                setFaceDetected(true);
            }, 1500);
            return () => {
                clearTimeout(detectionTimer);
            };
        } else {
            stopCamera();
            setFaceDetected(false);
        }
        return () => {
            stopCamera();
        };
    }, [showFaceIdScan]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            showToast("Cannot access camera. Please allow camera permissions.", "error");
            setShowFaceIdScan(false);
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

    const handleFaceIdClick = useCallback(() => {
        setPaymentMethod("faceid");
        setShowFaceIdScan(true);
    }, []);

    const handleCardClick = useCallback(() => {
        setPaymentMethod("card");
    }, []);

    const handleStartScan = () => {
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
            setShowFaceIdScan(false);
            setIsScanning(false);
            setScanProgress(0);
            handlePayment();
        }, 500);
    };

    const handleCloseFaceIdScan = () => {
        stopCamera();
        setShowFaceIdScan(false);
        setIsScanning(false);
        setScanProgress(0);
        setFaceDetected(false);
        setPaymentMethod(null);
    };

    const handlePayment = useCallback(() => {
        if (!paymentMethod) return;
        setIsProcessing(true);
        showToast("Processing payment...", "info");

        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            const receipt = {
                id: Date.now().toString(),
                items: cart,
                total,
                date: new Date().toISOString(),
                paymentMethod: paymentMethod === "card" ? "Credit Card" : "FaceID",
            };
            addReceipt(receipt);
            clearCart();
            showToast("Payment successful!", "success");
        }, 2000);
    }, [paymentMethod, cart, total, addReceipt, clearCart, showToast]);

    // Listen for voice commands
    useEffect(() => {
        const handleSelectCard = () => {
            handleCardClick();
            showToast("Card payment selected", "info");
        };

        const handleSelectFaceId = () => {
            handleFaceIdClick();
        };

        const handleConfirmPayment = () => {
            if (paymentMethod) {
                if (paymentMethod === "card") {
                    handlePayment();
                }
                // FaceID requires the scan modal flow
            } else {
                showToast("Please select a payment method first", "info");
            }
        };

        window.addEventListener('voice-select-card', handleSelectCard);
        window.addEventListener('voice-select-faceid', handleSelectFaceId);
        window.addEventListener('voice-confirm-payment', handleConfirmPayment);

        return () => {
            window.removeEventListener('voice-select-card', handleSelectCard);
            window.removeEventListener('voice-select-faceid', handleSelectFaceId);
            window.removeEventListener('voice-confirm-payment', handleConfirmPayment);
        };
    }, [handleCardClick, handleFaceIdClick, handlePayment, paymentMethod, showToast]);

    const handleRatingClick = (stars: number) => {
        setRating(stars);
        setShowCommentBox(true);
    };

    const handleSubmitFeedback = () => {
        setShowThankYou(true);
        showToast("Thank you for your feedback!", "success");
        setTimeout(() => {
            setShowThankYou(false);
            navigate("/");
        }, 2000);
    };

    if (isSuccess) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <BackButton />
                </div>
                <div className="glass-card rounded-3xl p-12 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                        <CheckCircle className="mx-auto mb-6 text-green-400" size={100} />
                    </motion.div>
                    <h1 className="text-5xl font-black text-white mb-4">Payment Successful!</h1>
                    <p className="text-xl text-gray-300 mb-8">Thank you for your purchase</p>

                    {/* Receipt Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Button variant="secondary" size="lg" className="flex items-center justify-center gap-3">
                            <Printer size={24} />
                            Print Receipt
                        </Button>
                        <Button variant="secondary" size="lg" className="flex items-center justify-center gap-3">
                            <Mail size={24} />
                            Email Receipt
                        </Button>
                    </div>

                    {/* Rating & Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-2xl p-6 mb-6"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Rate your experience</h2>
                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    onClick={() => handleRatingClick(star)}
                                    className="text-5xl touch-target"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {star <= rating ? "⭐" : "☆"}
                                </motion.button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {showCommentBox && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4"
                                >
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us about your experience..."
                                        className="w-full px-4 py-3 rounded-lg glass text-white text-lg mb-4 resize-none"
                                        rows={4}
                                    />
                                    <Button variant="primary" size="lg" onClick={handleSubmitFeedback} fullWidth>
                                        Submit Feedback
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {showThankYou && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-gradient-gold text-xl font-bold">
                                Thank you for your feedback! 🎉
                            </motion.div>
                        )}
                    </motion.div>

                    <Button variant="primary" size="xl" onClick={() => navigate("/")} fullWidth>
                        Return to Home
                    </Button>
                </div>
            </motion.div>
        );
    }

    if (isProcessing) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <BackButton />
                </div>
                <div className="glass-card rounded-3xl p-16 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 className="mx-auto mb-6 text-accent" size={80} />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-4">Processing Payment...</h1>
                    <p className="text-xl text-gray-300">Please wait</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <BackButton />
            </div>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black text-gradient-gold mb-8 text-center"
            >
                Payment
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-semibold text-white">Total Amount:</span>
                    <span className="text-5xl font-black text-gradient-gold">${total.toFixed(2)}</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Credit Card - Apple Pay Style */}
                <motion.button
                    onClick={handleCardClick}
                    className={`glass-card rounded-2xl p-8 relative overflow-hidden transition-all ${
                        paymentMethod === "card" ? "ring-4 ring-accent scale-105" : "hover:scale-102"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                <CreditCard className="text-white" size={32} />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400 mb-1">•••• •••• ••••</div>
                                <div className="text-sm text-gray-300">1234</div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Credit Card</h2>
                        <p className="text-gray-400 text-sm">Tap to pay with card</p>
                    </div>
                    {paymentMethod === "card" && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                        >
                            <CheckCircle className="text-slate-900" size={20} />
                        </motion.div>
                    )}
                </motion.button>

                {/* FaceID Payment - Apple Pay Style */}
                <motion.button
                    onClick={handleFaceIdClick}
                    className={`glass-card rounded-2xl p-8 relative overflow-hidden transition-all ${
                        paymentMethod === "faceid" ? "ring-4 ring-accent scale-105" : "hover:scale-102"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="text-white" size={36} />
                            </div>
                            {user && (
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-white">{user.name}</div>
                                    <div className="text-xs text-gray-400 capitalize">{user.membershipLevel}</div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">FaceID Payment</h2>
                        <p className="text-gray-400 text-sm">Secure biometric payment</p>
                    </div>
                    {paymentMethod === "faceid" && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                        >
                            <CheckCircle className="text-slate-900" size={20} />
                        </motion.div>
                    )}
                </motion.button>
            </div>

            <Button variant="primary" size="xl" onClick={handlePayment} disabled={!paymentMethod || cart.length === 0} fullWidth>
                Confirm Payment
            </Button>

            {/* FaceID Scan Modal */}
            <AnimatePresence>
                {showFaceIdScan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCloseFaceIdScan}
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
                                onClick={handleCloseFaceIdScan}
                                className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Face ID Authentication</h2>

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
                                            <p className="text-center text-white mt-2 text-sm">Scanning... {scanProgress}%</p>
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
                                <Button variant="secondary" size="lg" onClick={handleCloseFaceIdScan} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleStartScan}
                                    disabled={isScanning || !faceDetected}
                                    className="flex-1"
                                >
                                    {isScanning ? (
                                        <>
                                            <Loader2 className="inline mr-2 animate-spin" size={20} />
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <ScanLine className="inline mr-2" size={20} />
                                            {faceDetected ? "Start Scan" : "Waiting for face..."}
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
};

export default Payment;
