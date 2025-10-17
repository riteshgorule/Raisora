import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm, RegisterForm } from './AuthForms';
import { X } from 'lucide-react';

const AuthModal = () => {
  const { modalOpen, modalMode, closeAuthModal, openAuthModal } = useAuth();

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeAuthModal} />
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with close only */}
          <div className="flex items-center justify-end px-4 py-3">
            <button onClick={closeAuthModal} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5" /></button>
          </div>

          {/* Body: forms */}
          {modalMode === 'login' ? <LoginForm onClose={closeAuthModal} /> : <RegisterForm onClose={closeAuthModal} />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;