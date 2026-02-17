import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/LandingPage';
import Campaigns from './pages/Campaigns';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';



import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      // open login modal and set redirect to attempted path
      openAuthModal('login', location.pathname + location.search + location.hash);
      navigate('/', { replace: true });
    }
  }, [token]);

  if (!token) return null;
  return children;
};

function AppRoutes() {
  const { token } = useAuth();
  const { modalOpen } = useAuth();

  return (
  <>
  <div className={`min-h-screen bg-white flex flex-col ${modalOpen ? 'filter blur-sm' : ''}`}>
  {/* Header shown to everyone (nav triggers auth modal when unauthenticated) */}
  <Header />
      <main className="flex-grow">
        <Routes>

          <Route path="/" element={<Landing />} />

          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/events" element={<Events />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donations"
            element={
              <ProtectedRoute>
                <Donations />
              </ProtectedRoute>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<Navigate to={'/'} replace />} />
        </Routes>
      </main>
  <Footer />
    </div>
    <AuthModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;