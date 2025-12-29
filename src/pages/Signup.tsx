import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Camera, X, ScanLine, Loader2, CheckCircle, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useToast } from "../components/ui/ToastProvider";
import Button from "../components/ui/Button";
import BackButton from "../components/ui/BackButton";

const Signup = () => {
    const navigate = useNavigate();
    const { registerUser } = useApp();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showFaceScan, setShowFaceScan] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const [faceIdEnrolled, setFaceIdEnrolled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

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
            setShowFaceScan(false);
            setIsScanning(false);
            setScanProgress(0);
            setFaceDetected(false);
            setFaceIdEnrolled(true);
            showToast("Face ID enrolled successfully!", "success");
        }, 500);
    };

    const handleCloseFaceScan = () => {
        stopCamera();
        setShowFaceScan(false);
        setIsScanning(false);
        setScanProgress(0);
        setFaceDetected(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            membershipLevel: "silver" as const,
            faceIdEnrolled: faceIdEnrolled,
        };
        registerUser(newUser);
        showToast(`Welcome, ${formData.name}!`, "success");
        navigate("/");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <BackButton />
            </div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <UserPlus className="mx-auto mb-4 text-accent" size={64} />
                </motion.div>
                <h1 className="text-5xl font-black text-gradient-gold mb-2">Join Our Loyalty Program</h1>
                <p className="text-xl text-gray-300">Get exclusive discounts and rewards</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="glass-card rounded-3xl p-8 space-y-6"
            >
                {/* Name Input */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3 flex items-center gap-2">
                        <Mail size={20} />
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                        placeholder="your.email@example.com"
                    />
                </div>

                {/* Phone Input */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3 flex items-center gap-2">
                        <UserPlus size={20} />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                        placeholder="+84 123 456 789"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3 flex items-center gap-2">
                        <Lock size={20} />
                        Password
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                        placeholder="Enter your password (min 6 characters)"
                    />
                </div>

                {/* Confirm Password Input */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3 flex items-center gap-2">
                        <Lock size={20} />
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                        placeholder="Confirm your password"
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
                    )}
                </div>

                {/* Face Scan Enrollment */}
                <div>
                    <label className="block text-white text-xl font-semibold mb-3">Face ID Enrollment</label>
                    <motion.button
                        type="button"
                        onClick={() => setShowFaceScan(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full glass rounded-2xl p-8 border-2 text-center transition-all ${
                            faceIdEnrolled ? "border-green-400 bg-green-400/10" : "border-dashed border-accent/50 hover:border-accent"
                        }`}
                    >
                        {faceIdEnrolled ? (
                            <div>
                                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                                <p className="text-white text-lg mb-2 font-semibold">Face ID Enrolled</p>
                                <p className="text-gray-400 text-sm">Click to re-enroll</p>
                            </div>
                        ) : (
                            <div>
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Camera className="mx-auto mb-4 text-accent" size={48} />
                                </motion.div>
                                <p className="text-white text-lg mb-2 font-semibold">Face Scan Enrollment</p>
                                <p className="text-gray-400 text-sm">Click to enroll Face ID</p>
                            </div>
                        )}
                    </motion.button>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="primary" size="xl" fullWidth>
                    Register
                </Button>
            </motion.form>

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

                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Face ID Enrollment</h2>

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
                                            <p className="text-center text-white mt-2 text-sm">Enrolling... {scanProgress}%</p>
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
                                    onClick={handleStartScan}
                                    disabled={isScanning || !faceDetected}
                                    className="flex-1"
                                >
                                    {isScanning ? (
                                        <>
                                            <Loader2 className="inline mr-2 animate-spin" size={20} />
                                            Enrolling...
                                        </>
                                    ) : (
                                        <>
                                            <ScanLine className="inline mr-2" size={20} />
                                            {faceDetected ? "Start Enrollment" : "Waiting for face..."}
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

export default Signup;
