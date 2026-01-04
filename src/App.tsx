import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/ui/ToastProvider";
import { VoiceProvider } from "./context/VoiceContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import Scanner from "./pages/Scanner";
import Payment from "./pages/Payment";
import Return from "./pages/Return";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import TryOn from "./pages/TryOn";
import Account from "./pages/Account";

// Base path for GitHub Pages deployment
const basename = import.meta.env.BASE_URL;

function App() {
    return (
        <AppProvider>
            <ToastProvider>
                <BrowserRouter basename={basename}>
                    <VoiceProvider>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/catalogue" element={<Catalogue />} />
                                <Route path="/scanner" element={<Scanner />} />
                                <Route path="/payment" element={<Payment />} />
                                <Route path="/return" element={<Return />} />
                                <Route path="/help" element={<Help />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/try-on" element={<TryOn />} />
                                <Route path="/account" element={<Account />} />
                            </Routes>
                        </Layout>
                    </VoiceProvider>
                </BrowserRouter>
            </ToastProvider>
        </AppProvider>
    );
}

export default App;
