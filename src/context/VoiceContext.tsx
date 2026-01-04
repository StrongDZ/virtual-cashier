import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './AppContext';
import { useToast } from '../components/ui/ToastProvider';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import type { VoiceCommand } from '../hooks/useVoiceRecognition';

type InteractionMode = 'touch' | 'voice-touch';

interface VoiceContextType {
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  matchedCommand: VoiceCommand | null;
  availableCommands: VoiceCommand[];
  lastCommand: string | null;
  retryListening: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, cart } = useApp();
  const { showToast } = useToast();
  
  const [interactionMode, setInteractionModeState] = useState<InteractionMode>('voice-touch');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  // Define available voice commands based on current page
  const availableCommands: VoiceCommand[] = useMemo(() => {
    const baseCommands: VoiceCommand[] = [
      {
        command: 'Go Home',
        keywords: ['go home', 'home', 'main page', 'start page', 'back to home'],
        action: () => {
          navigate('/');
          showToast('Navigating to Home', 'info');
          setLastCommand('Go Home');
        },
        description: 'Navigate to home page',
      },
      {
        command: 'Start Checkout',
        keywords: ['checkout', 'start checkout', 'scan', 'scanner', 'scan items'],
        action: () => {
          navigate('/scanner');
          showToast('Opening Scanner', 'info');
          setLastCommand('Start Checkout');
        },
        description: 'Go to item scanner',
      },
      {
        command: 'Browse Catalogue',
        keywords: ['catalogue', 'catalog', 'browse', 'products', 'browse products', 'show products'],
        action: () => {
          navigate('/catalogue');
          showToast('Opening Catalogue', 'info');
          setLastCommand('Browse Catalogue');
        },
        description: 'Browse product catalogue',
      },
      {
        command: 'Return Items',
        keywords: ['return', 'return items', 'refund', 'returns'],
        action: () => {
          navigate('/return');
          showToast('Opening Returns', 'info');
          setLastCommand('Return Items');
        },
        description: 'Go to returns page',
      },
      {
        command: 'Virtual Try On',
        keywords: ['try on', 'virtual try', 'try clothes', 'fitting room'],
        action: () => {
          navigate('/try-on');
          showToast('Opening Virtual Try-On', 'info');
          setLastCommand('Virtual Try On');
        },
        description: 'Go to virtual try-on',
      },
    ];

    // Page-specific commands
    const pageCommands: VoiceCommand[] = [];

    if (location.pathname === '/scanner' || location.pathname.includes('/scanner')) {
      pageCommands.push(
        {
          command: 'Scan Item',
          keywords: ['scan item', 'add item', 'scan product'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-scan-item'));
            setLastCommand('Scan Item');
          },
          description: 'Scan an item',
        },
        {
          command: 'Clear Cart',
          keywords: ['clear cart', 'empty cart', 'remove all', 'clear all'],
          action: () => {
            clearCart();
            showToast('Cart cleared', 'info');
            setLastCommand('Clear Cart');
          },
          description: 'Clear all items from cart',
        },
        {
          command: 'Pay Now',
          keywords: ['pay', 'pay now', 'payment', 'proceed to payment'],
          action: () => {
            if (cart.length > 0) {
              navigate('/payment');
              showToast('Proceeding to payment', 'info');
              setLastCommand('Pay Now');
            } else {
              showToast('Cart is empty', 'error');
            }
          },
          description: 'Proceed to payment',
        }
      );
    }

    if (location.pathname === '/payment' || location.pathname.includes('/payment')) {
      pageCommands.push(
        {
          command: 'Pay with Card',
          keywords: ['card', 'credit card', 'pay with card', 'use card'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-select-card'));
            setLastCommand('Pay with Card');
          },
          description: 'Select card payment',
        },
        {
          command: 'Pay with Face ID',
          keywords: ['face', 'face id', 'faceid', 'biometric', 'face payment'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-select-faceid'));
            setLastCommand('Pay with Face ID');
          },
          description: 'Select Face ID payment',
        },
        {
          command: 'Confirm Payment',
          keywords: ['confirm', 'confirm payment', 'complete', 'finish'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-confirm-payment'));
            setLastCommand('Confirm Payment');
          },
          description: 'Confirm the payment',
        }
      );
    }

    if (location.pathname === '/catalogue' || location.pathname.includes('/catalogue')) {
      pageCommands.push(
        {
          command: 'Show Men\'s',
          keywords: ['men', 'mens', "men's", 'male', 'show men'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-filter', { detail: { gender: 'men' } }));
            setLastCommand('Show Men\'s');
          },
          description: 'Filter men\'s clothing',
        },
        {
          command: 'Show Women\'s',
          keywords: ['women', 'womens', "women's", 'female', 'show women'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-filter', { detail: { gender: 'women' } }));
            setLastCommand('Show Women\'s');
          },
          description: 'Filter women\'s clothing',
        },
        {
          command: 'Show All',
          keywords: ['all', 'show all', 'clear filter', 'reset'],
          action: () => {
            window.dispatchEvent(new CustomEvent('voice-filter', { detail: { gender: 'all' } }));
            setLastCommand('Show All');
          },
          description: 'Show all products',
        }
      );
    }

    return [...baseCommands, ...pageCommands];
  }, [location.pathname, navigate, clearCart, cart.length, showToast]);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    matchedCommand,
    setContinuousMode,
    startListening,
  } = useVoiceRecognition(availableCommands, true);

  // Handle mode changes - enable/disable continuous listening
  const setInteractionMode = useCallback((mode: InteractionMode) => {
    setInteractionModeState(mode);
    
    if (mode === 'voice-touch' && isSupported) {
      setContinuousMode(true);
      // Also try to start immediately
      setTimeout(() => startListening(), 100);
    } else {
      setContinuousMode(false);
    }
  }, [setContinuousMode, isSupported, startListening]);

  // Initialize continuous mode on mount with delay
  useEffect(() => {
    if (interactionMode === 'voice-touch' && isSupported) {
      // Delay to ensure everything is ready
      const timer = setTimeout(() => {
        setContinuousMode(true);
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSupported]); // Only run once on mount when isSupported is determined

  // Clear last command after 3 seconds
  useEffect(() => {
    if (lastCommand) {
      const timer = setTimeout(() => {
        setLastCommand(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastCommand]);

  // Retry listening function
  const retryListening = useCallback(() => {
    if (isSupported && interactionMode === 'voice-touch') {
      setContinuousMode(true);
      startListening();
    }
  }, [isSupported, interactionMode, setContinuousMode, startListening]);

  return (
    <VoiceContext.Provider
      value={{
        interactionMode,
        setInteractionMode,
        isListening,
        isSupported,
        transcript,
        interimTranscript,
        error,
        matchedCommand,
        availableCommands,
        lastCommand,
        retryListening,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
