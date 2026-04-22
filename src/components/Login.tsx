import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, ChevronRight, Lock, ArrowLeft, Sun, Moon, User, Clock, Briefcase } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleMockLogin = async (mockEmail: string) => {
    setIsLoading(true);
    try {
      await login(mockEmail, 'password123');
      navigate('/portal');
    } catch (error) {
      alert('Error during mock login');
    } finally {
      setIsLoading(false);
    }
  };

  const mockPersonas = [
    { label: 'PRINCIPAL', email: 'admin@eliteexec.com', icon: User },
    { label: 'COUNSEL', email: 'manager@eliteexec.com', icon: User },
    { label: 'ASSOCIATE', email: 'assistant@eliteexec.com', icon: Clock },
    { label: 'CLIENT', email: 'client@acme.com', icon: Briefcase },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/portal');
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-bg flex flex-col md:flex-row relative overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <img src="/hero_desk.png" className="w-full h-full object-cover opacity-30 dark:opacity-15 grayscale" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-r from-premium-bg/80 via-premium-bg/60 to-premium-bg/40 dark:from-premium-bg/95 dark:via-premium-bg/85 dark:to-premium-bg/70 transition-colors duration-500" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:px-12">
        <Link to="/" className="flex items-center gap-2 text-premium-text/60 dark:text-premium-muted hover:text-premium-text transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-normal">Back to Website</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-premium-muted/50 hover:text-premium-gold transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-1/2 p-16 lg:p-24 flex-col justify-between relative z-10">
        <div className="flex items-center gap-4">
          <img src="/logo-no-text.png" alt="Logo" className="h-32 w-auto" />
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-[0.2em] font-light uppercase text-premium-text">The Executive Desk</span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-premium-gold font-light opacity-60">Institutional Support</span>
          </div>
        </div>

        <div className="space-y-8 max-w-md">
          <h1 className="text-5xl lg:text-6xl font-display font-light text-premium-text leading-tight tracking-tight">
            Secure{' '}
            <span className="font-serif italic text-premium-gold font-normal">Access</span>
          </h1>
          <p className="text-premium-text/70 dark:text-premium-muted font-light text-base leading-relaxed">
            Welcome to the secure portal. Verify your credentials to initiate an encrypted session with institutional-grade protection.
          </p>
        </div>

        <div className="text-[10px] uppercase tracking-[0.3em] text-premium-text/50 dark:text-premium-muted/60 font-light">
          © {new Date().getFullYear()} TED · AES-256 Encrypted
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 lg:p-24 relative z-10 min-h-screen md:min-h-0">
        <div className="w-full max-w-md space-y-10 animate-fade-up">
          {/* Mobile Branding */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <img src="/logo-no-text.png" alt="Logo" className="h-24 w-auto" />
            <span className="font-display text-base tracking-[0.2em] font-light uppercase text-premium-text">TED Portal</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-premium-gold">
              <Lock size={14} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-normal">Encrypted Entry</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-light text-premium-text uppercase tracking-widest">
              Sign In
            </h2>
          </div>

          {/* Quick Mock Login Personas */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-premium-text/20 dark:border-premium-border/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-premium-bg text-[9px] uppercase tracking-[0.25em] text-premium-text dark:text-premium-muted font-medium dark:font-normal">Select Perspective</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mockPersonas.map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.label}
                    onClick={() => handleMockLogin(persona.email)}
                    disabled={isLoading}
                    type="button"
                    className="flex flex-col items-center justify-center p-5 bg-premium-card/60 dark:bg-premium-card/40 border border-premium-text/15 dark:border-premium-border/50 rounded-sm hover:border-premium-gold/40 hover:bg-premium-card transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon size={20} strokeWidth={1.5} className="mb-3 text-premium-text/60 dark:text-premium-muted group-hover:text-premium-gold transition-colors" />
                    <span className="text-[10px] font-display tracking-[0.2em] text-premium-text font-medium dark:font-normal group-hover:text-premium-gold transition-colors uppercase">{persona.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-premium-text/20 dark:border-premium-border/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-premium-bg text-[9px] uppercase tracking-[0.25em] text-premium-text dark:text-premium-muted font-medium dark:font-normal">Or Manual Entry</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-premium-text dark:text-premium-muted font-medium dark:font-normal">Principal Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-premium-text/25 dark:border-b dark:border-premium-border py-3 text-premium-text focus:border-premium-gold outline-none transition-all duration-300 font-light"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-premium-text dark:text-premium-muted font-medium dark:font-normal">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-premium-text/25 dark:border-b dark:border-premium-border py-3 text-premium-text focus:border-premium-gold outline-none transition-all duration-300 font-light"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="premium-button-primary w-full py-4 flex items-center justify-center gap-3 group mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-premium-gold/30 border-t-premium-gold rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  Verify Credentials
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-premium-text/15 dark:border-premium-border/50">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.12em] text-premium-text/50 dark:text-premium-muted/60 font-normal">
              <span className="flex items-center gap-1.5"><Shield size={10} className="text-premium-gold/40" /> 2FA Mandatory</span>
              <span className="flex items-center gap-1.5"><Lock size={10} className="text-premium-gold/40" /> AES-256</span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-premium-gold/30" />
                IP Logged
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
