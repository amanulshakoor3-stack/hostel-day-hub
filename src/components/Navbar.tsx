import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, MessageSquarePlus, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-festival-purple-950/95 backdrop-blur-md shadow-lg shadow-festival-purple-950/20 py-3 border-b border-festival-purple-800/40'
          : 'bg-festival-purple-950/80 backdrop-blur-sm py-4 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Hostel Day Hub Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-festival-orange-500 to-festival-purple-600 flex items-center justify-center shadow-md shadow-festival-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                Hostel Day <span className="text-festival-orange-400">Hub</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-festival-purple-100/70">
                Annual Celebration
              </span>
            </div>
          </button>

          {/* Desktop Navigation - EXACTLY 3 links as required */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('hero')}
              className="px-4 py-2 text-sm font-semibold text-festival-purple-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('share-suggestion')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-festival-orange-300 hover:text-festival-orange-200 rounded-lg hover:bg-festival-orange-500/10 transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Share Suggestion
            </button>
            <button
              onClick={() => handleNavClick('view-suggestions')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-festival-blue-600 hover:bg-festival-blue-500 rounded-lg shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              View Suggestions
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-festival-purple-950/98 border-b border-festival-purple-800 px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => handleNavClick('hero')}
            className="w-full text-left px-4 py-3 text-base font-semibold text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('share-suggestion')}
            className="w-full text-left px-4 py-3 text-base font-semibold text-festival-orange-300 rounded-xl hover:bg-festival-orange-500/10 flex items-center gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Share Suggestion
          </button>
          <button
            onClick={() => handleNavClick('view-suggestions')}
            className="w-full text-left px-4 py-3 text-base font-semibold text-white bg-festival-blue-600 rounded-xl hover:bg-festival-blue-500 flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            View Suggestions
          </button>
        </div>
      )}
    </header>
  );
};
