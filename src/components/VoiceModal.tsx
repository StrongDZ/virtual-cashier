import { Mic, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface VoiceModalProps {
  onClose: () => void;
}

const VoiceModal = ({ onClose }: VoiceModalProps) => {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsListening(false);
      setTranscript('Show me men\'s clothing');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
        className="glass-card rounded-3xl p-12 max-w-md w-full border-2 border-accent text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-accent touch-target rounded-lg hover:bg-white/10 p-2"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={32} />
        </motion.button>

        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="relative inline-block"
                >
                  <Mic className="text-accent" size={80} />
                  <motion.div
                    className="absolute inset-0 bg-accent/30 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Listening...</h2>
              <p className="text-xl text-gray-300">Speak your command</p>
            </motion.div>
          ) : (
            <motion.div
              key="received"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Mic className="mx-auto mb-6 text-accent" size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4">Command Received</h2>
              <p className="text-lg text-gray-300 mb-6">"{transcript}"</p>
              <p className="text-sm text-gray-400 mb-4">
                (Voice command functionality placeholder)
              </p>
              <Button variant="primary" size="lg" onClick={onClose} fullWidth>
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VoiceModal;
