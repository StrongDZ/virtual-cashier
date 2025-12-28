import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/ToastProvider';
import Layout from './components/Layout';
import VoiceButton from './components/VoiceButton';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Scanner from './pages/Scanner';
import Catalogue from './pages/Catalogue';
import TryOn from './pages/TryOn';
import Payment from './pages/Payment';
import Return from './pages/Return';
import Help from './pages/Help';

const AppContent = () => {
  const location = useLocation();
  const showVoiceButton = location.pathname === '/scanner' || location.pathname === '/catalogue';

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/try-on" element={<TryOn />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/return" element={<Return />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showVoiceButton && <VoiceButton />}
    </Layout>
  );
};

function App() {
  return (
    <Router basename="/virtual-cashier"> {/* Thay bằng tên repo thực tế của bạn trên GitHub */}
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </Router>
  );
}

export default App;
