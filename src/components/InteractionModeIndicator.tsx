import { Mic, Hand, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../context/VoiceContext';

const InteractionModeIndicator = () => {
  const { interactionMode, setInteractionMode, isListening, isSupported } = useVoice();
  const [showDropdown, setShowDropdown] = useState(false);

  const modes = [
    {
      id: 'voice-touch' as const,
      label: 'Voice + Touch',
      icon: Mic,
      description: 'AI continuously listens',
      color: 'from-purple-500 to-purple-600',
      disabled: !isSupported,
    },
    {
      id: 'touch' as const,
      label: 'Touch Only',
      icon: Hand,
      description: 'Use touch controls',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  const currentMode = modes.find(m => m.id === interactionMode) || modes[0];
  const CurrentIcon = currentMode.icon;

  return (
    <div className="relative">
      {/* Mode Button */}
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl glass border transition-all ${
          isListening ? 'border-green-400 bg-green-500/20' : 'border-white/10 hover:border-white/30'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <CurrentIcon size={20} className={isListening ? 'text-green-400' : 'text-white'} />
          {isListening && (
            <motion.div
              className="absolute -inset-1 bg-green-400/30 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>
        <span className="text-sm font-medium text-white hidden sm:inline">
          {currentMode.label}
        </span>
        {isListening && (
          <span className="text-xs text-green-400 hidden md:inline">● Listening</span>
        )}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 glass-card rounded-xl border border-white/10 p-2 z-50"
            >
              <p className="text-xs text-gray-400 px-3 py-2 border-b border-white/10 mb-2">
                Interaction Mode
              </p>
              
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = interactionMode === mode.id;
                const isDisabled = mode.disabled;
                
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => {
                      if (!isDisabled) {
                        setInteractionMode(mode.id);
                        setShowDropdown(false);
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isActive
                        ? 'bg-accent/20 border border-accent/50'
                        : 'hover:bg-white/10'
                    }`}
                    whileHover={!isDisabled ? { x: 4 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${isActive ? 'text-accent' : 'text-white'}`}>
                        {mode.label}
                      </p>
                      <p className="text-xs text-gray-400">{mode.description}</p>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-accent rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}

              {!isSupported && (
                <p className="text-xs text-orange-400 px-3 py-2 mt-2 border-t border-white/10">
                  ⚠️ Voice not supported in this browser
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionModeIndicator;
