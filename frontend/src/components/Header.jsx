import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Events', href: '/events' },
  { name: 'Dashboard', href: '/dashboard', protected: true },
  { name: 'Donations', href: '/donations', protected: true },
  ];

  const { logout, token, openAuthModal, user } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null);

  // close profile dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isProfileOpen) return;
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
    };
  }, [isProfileOpen]);

  const profileOptions = [
    { name: 'Settings', href: '/settings' }
  ];

  const handleSignOut = () => {
    // clear auth and redirect to login
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleRequireAuth = (mode = 'login', redirect = null) => {
    // open modal with login/register and optional redirect
    openAuthModal(mode, redirect);
  };

  const isActive = (href) => location.pathname === href;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-[#02c39a]" />
            <span className="text-2xl font-bold text-gray-900">Raisora</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              // protected pages should open the auth modal when unauthenticated
              item.protected ? (
                token ? (
                  <Link key={item.name} to={item.href} className={`relative group px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ${isActive(item.href) ? 'text-[#02c39a]' : 'hover:text-[#02c39a]'}`}>
                    {item.name}
                    <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#02c39a] transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                ) : (
                  <button key={item.name} onClick={() => handleRequireAuth('login', item.href)} className="relative group px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#02c39a]">
                    {item.name}
                  </button>
                )
              ) : (
                // public pages are always navigable
                <Link key={item.name} to={item.href} className={`relative group px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ${isActive(item.href) ? 'text-[#02c39a]' : 'hover:text-[#02c39a]'}`}>
                  {item.name}
                  <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#02c39a] transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              )
            ))}
          </nav>

          {/* Right section (Desktop: Donate + Profile, Mobile: Profile + Menu) */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown (both desktop & mobile) */}
            <div ref={profileRef} className="relative flex items-center space-x-3">
              {token && (
                <span className="text-sm font-medium text-gray-700">{(user && user.username) || 'User'}</span>
              )}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none"
              >
                <img
                  src="/icon.png"
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-[#02c39a] cursor-pointer"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {profileOptions.map((option) => (
                    <Link
                      key={option.name}
                      to={option.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f3bd]/30 hover:text-[#02c39a]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {option.name}
                    </Link>
                  ))}

                  {!token ? (
                    <button
                      type="button"
                      onClick={() => { setIsProfileOpen(false); handleRequireAuth('login'); }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f3bd]/30 hover:text-[#02c39a]"
                    >
                      Sign in
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f3bd]/30 hover:text-[#02c39a]"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button (hidden on desktop) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#02c39a] transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                item.protected ? (
                  token ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-[#02c39a] bg-[#f0f3bd]/20'
                          : 'text-gray-700 hover:text-[#02c39a] hover:bg-[#f0f3bd]/20'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => { setIsMenuOpen(false); handleRequireAuth('login', item.href); }}
                      className={`text-left px-3 py-2 text-base font-medium transition-colors duration-200 text-gray-700 hover:text-[#02c39a] hover:bg-[#f0f3bd]/20`}
                    >
                      {item.name}
                    </button>
                  )
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-[#02c39a] bg-[#f0f3bd]/20'
                        : 'text-gray-700 hover:text-[#02c39a] hover:bg-[#f0f3bd]/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;