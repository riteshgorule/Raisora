import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-[#02c39a]" />
              <span className="text-2xl font-bold">Raisora</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering communities through awareness, action, and positive change. Together, we can make a difference.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-[#02c39a] cursor-pointer transition-colors duration-200" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-[#02c39a] cursor-pointer transition-colors duration-200" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-[#02c39a] cursor-pointer transition-colors duration-200" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-[#02c39a] cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/campaigns" className="text-gray-400 hover:text-[#02c39a] transition-colors duration-200">Active Campaigns</a></li>
              <li><a href="/events" className="text-gray-400 hover:text-[#02c39a] transition-colors duration-200">Upcoming Events</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-[#02c39a] transition-colors duration-200">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-[#02c39a] transition-colors duration-200">Get Involved</a></li>
            </ul>
          </div>

          {/* Causes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Causes</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Education</span></li>
              <li><span className="text-gray-400">Environment</span></li>
              <li><span className="text-gray-400">Healthcare</span></li>
              <li><span className="text-gray-400">Human Rights</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#02c39a]" />
                <span className="text-gray-400">info@raisora.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#02c39a]" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#02c39a]" />
                <span className="text-gray-400">123 Hope Street, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Raisora. All rights reserved. Made with ❤️ for positive change.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;