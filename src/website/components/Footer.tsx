import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white relative overflow-hidden">
      {/* Divider */}
      <div className="divider-gold" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo-no-text.png" alt="TED Logo" className="h-24 w-auto" />
              <div className="flex flex-col">
                <span className="font-display text-base tracking-[0.2em] font-normal uppercase">
                  The Executive Desk
                </span>
                <span className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-light">
                  Institutional Support
                </span>
              </div>
            </div>
            <p className="text-white/40 font-light leading-relaxed text-sm max-w-sm">
              Elite administrative and strategic support for the GCC's most demanding executive environments. Dedicated to the principle of institutional excellence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-normal">
                Systems Operational
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-7 space-y-5">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.2em] font-normal">Navigate</h4>
            <ul className="space-y-3">
              {['Services', 'Process', 'Philosophy', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-light text-white/50 hover:text-gold transition-colors duration-300 link-underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.2em] font-normal">Portal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-sm font-light text-white/50 hover:text-gold transition-colors duration-300 flex items-center gap-1.5 group">
                  Secure Login
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li><span className="text-sm font-light text-white/30">Privacy Protocol</span></li>
              <li><span className="text-sm font-light text-white/30">NDA Standards</span></li>
              <li><span className="text-sm font-light text-white/30">Compliance</span></li>
            </ul>
          </div>

          {/* Jurisdictions */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.2em] font-normal">Presence</h4>
            <ul className="space-y-3">
              <li className="text-sm font-light text-white/50">Dubai, UAE</li>
              <li className="text-sm font-light text-white/50">Riyadh, KSA</li>
              <li className="text-sm font-light text-white/50">Abu Dhabi, UAE</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-light">
            © {currentYear} The Executive Desk. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-white/25 font-light">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              AES-256 Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              SOC 2 Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
