import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Services', 'Process', 'Philosophy', 'Contact'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 premium-glass ${
        isScrolled ? 'py-1' : 'py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img
            src="/logo-no-text.png"
            alt="TED Logo"
            className="h-24 md:h-28 w-auto brightness-100 transition-all duration-500"
          />
          <div className="flex flex-col">
            <span className="font-display text-base tracking-[0.25em] font-normal uppercase leading-tight">
              The Executive Desk
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-premium-muted font-light">
              Institutional Support
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="link-underline text-[11px] uppercase tracking-[0.12em] font-normal text-premium-muted hover:text-premium-text transition-colors duration-300"
            >
              {item}
            </a>
          ))}

          <div className="flex items-center gap-5 pl-8 border-l border-premium-border">
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-premium-gold-glow transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <Sun
                size={16}
                className={`absolute transition-all duration-400 ${
                  isDark ? 'opacity-100 rotate-0 scale-100 text-premium-gold' : 'opacity-0 rotate-90 scale-50'
                }`}
              />
              <Moon
                size={16}
                className={`absolute transition-all duration-400 ${
                  isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-premium-text'
                }`}
              />
            </button>

            <Link
              to="/login"
              className="premium-button-primary flex items-center gap-2 group text-[10px] px-6 py-2.5"
            >
              Portal Access
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-premium-gold-glow transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="text-premium-gold" /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 premium-glass border-t border-premium-border py-8 px-6">
          <div className="flex flex-col gap-5">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-base font-display font-light uppercase tracking-[0.15em] text-premium-text hover:text-premium-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 border-t border-premium-border">
              <Link
                to="/login"
                className="premium-button-primary text-center block"
                onClick={() => setIsOpen(false)}
              >
                Portal Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
