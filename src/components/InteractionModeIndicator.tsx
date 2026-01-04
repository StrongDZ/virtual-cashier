import { Mic, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVoice } from '../context/VoiceContext';

const InteractionModeIndicator = () => {
  const { interactionMode, setInteractionMode, isListening, isSupported } = useVoice();

  const modes = [
    {
      id: 'voice-touch' as const,
      label: 'Voice+Touch',
      shortLabel: 'Voice',
      icon: Mic,
      disabled: !isSupported,
    },
    {
      id: 'touch' as const,
      label: 'Touch Only',
      shortLabel: 'Touch',
      icon: Hand,
      disabled: false,
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 glass rounded-xl">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = interactionMode === mode.id;
        const isDisabled = mode.disabled;
        const isVoiceListening = mode.id === 'voice-touch' && isListening;
        
        return (
          <motion.button
            key={mode.id}
            onClick={() => {
              if (!isDisabled) {
                setInteractionMode(mode.id);
              }
            }}
            disabled={isDisabled}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed'
                : isActive
                ? 'bg-accent text-slate-900 font-bold shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            title={isDisabled ? 'Voice not supported in this browser' : mode.label}
          >
            {/* Listening animation for voice mode */}
            {isVoiceListening && (
              <motion.div
                className="absolute inset-0 bg-green-400/20 rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            
            <div className="relative z-10">
              <Icon 
                size={18} 
                className={isVoiceListening ? 'text-green-400' : isActive ? 'text-slate-900' : 'text-white'} 
              />
              {isVoiceListening && (
                <motion.div
                  className="absolute -inset-1 bg-green-400/40 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
            
            {/* Full label on larger screens, short on small */}
            <span className="text-sm font-medium hidden sm:inline relative z-10">
              {mode.label}
            </span>
            <span className="text-sm font-medium sm:hidden relative z-10">
              {mode.shortLabel}
            </span>
            
            {/* Listening indicator dot */}
            {isVoiceListening && (
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full relative z-10"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default InteractionModeIndicator;
