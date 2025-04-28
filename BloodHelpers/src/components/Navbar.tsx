import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blood">THE BOTTOM FRAGS</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-blood transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/profile" className="text-foreground hover:text-blood transition-colors">
              {t('nav.profile')}
            </Link>
            <Link to="/leaderboard" className="text-foreground hover:text-blood transition-colors">
              {t('nav.leaderboard')}
            </Link>
            <Link to="/signin" className="text-foreground hover:text-blood transition-colors">
              {t('nav.signin')}
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white">
              {t('nav.donate')}
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-foreground hover:text-blood"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} py-4`}>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-blood transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/profile" 
              className="text-foreground hover:text-blood transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.profile')}
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-foreground hover:text-blood transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.leaderboard')}
            </Link>
            <Link 
              to="/signin" 
              className="text-foreground hover:text-blood transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.signin')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 