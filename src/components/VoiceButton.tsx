import { Mic } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceModal from './VoiceModal';

const VoiceButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 left-8 bg-gradient-to-r from-accent to-accent-dark text-slate-900 rounded-full p-6 shadow-2xl z-50 touch-target"
        aria-label="Voice Command"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Mic size={32} />
      </motion.button>

      <AnimatePresence>
        {showModal && <VoiceModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
};

export default VoiceButton;
