import React from 'react';
import { X, Lock, User, ArrowRight } from 'lucide-react';

const AuthReminder = ({ open, onClose, onSignIn, message = 'Please sign in to continue.' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="relative px-6 py-4 bg-gradient-to-r from-[#02c39a]/5 to-[#028a7a]/5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#02c39a] to-[#028a7a] rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Authentication Required</h3>
                <p className="text-sm text-gray-500">Secure access needed</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
            >
              <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-700 text-base leading-relaxed">{message}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
              >
                Maybe Later
              </button>
              <button 
                onClick={onSignIn}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#02c39a] to-[#028a7a] text-white font-medium hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#02c39a] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                🔒 Your data is secure and protected with us
              </p>
            </div>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#02c39a]/20 to-[#028a7a]/20 -z-10 blur-xl scale-105 opacity-50"></div>
      </div>
    </div>
  );
};

export default AuthReminder;
