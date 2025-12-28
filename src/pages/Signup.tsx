import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/ToastProvider';
import Button from '../components/ui/Button';

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      membershipLevel: 'silver' as const,
      faceIdEnrolled: false,
    };
    setUser(newUser);
    showToast(`Welcome, ${formData.name}!`, 'success');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <UserPlus className="mx-auto mb-4 text-accent" size={64} />
        </motion.div>
        <h1 className="text-5xl font-black text-gradient-gold mb-2">
          Join Our Loyalty Program
        </h1>
        <p className="text-xl text-gray-300">
          Get exclusive discounts and rewards
        </p>
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
          <label className="block text-white text-xl font-semibold mb-3">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            placeholder="Enter your name"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-white text-xl font-semibold mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className="w-full px-6 py-4 text-xl rounded-xl glass text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            placeholder="+84 123 456 789"
          />
        </div>

        {/* Face Scan Enrollment Placeholder */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-8 border-2 border-dashed border-accent/50 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Camera className="mx-auto mb-4 text-accent" size={48} />
          </motion.div>
          <p className="text-white text-lg mb-2 font-semibold">Face Scan Enrollment</p>
          <p className="text-gray-400 text-sm">
            (Placeholder for FaceID enrollment)
          </p>
        </motion.div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth
        >
          Register
        </Button>
      </motion.form>
    </div>
  );
};

export default Signup;
