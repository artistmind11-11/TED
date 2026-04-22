import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  BarChart3,
  Moon,
  Sun,
  Search,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  active,
  onClick
}: {
  icon: any;
  label: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-[3px] transition-all duration-300 group relative ${
      active
        ? 'bg-gold/10 text-gold'
        : 'text-white/40 hover:text-white/80 hover:bg-white/5'
    }`}
  >
    {active && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gold rounded-r-full"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
    <Icon size={15} className={active ? 'text-gold' : 'group-hover:text-white/60'} />
    <span className="text-[11px] font-normal uppercase tracking-[0.12em]">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/portal', permission: null },
    { label: 'Time Tracking', icon: Clock, to: '/time', permission: 'time:track' },
    { label: 'Tasks', icon: CheckSquare, to: '/tasks', permission: 'tasks:manage' },
    { label: 'Approvals', icon: CheckSquare, to: '/approvals', permission: 'approvals:view' },
    { label: 'Invoices', icon: FileText, to: '/invoices', permission: 'billing:view' },
    { label: 'Clients', icon: Users, to: '/clients', permission: 'clients:view' },
    { label: 'CRM', icon: TrendingUp, to: '/crm', permission: 'crm:view' },
    { label: 'Reports', icon: BarChart3, to: '/reports', permission: 'reports:view' },
    { label: 'Settings', icon: Settings, to: '/settings', permission: null },
  ];

  const filteredNavItems = navItems.filter(item => !item.permission || hasPermission(item.permission as any));
  const currentPage = navItems.find(item => item.to === location.pathname)?.label || 'Portal';

  return (
    <div className="min-h-screen bg-premium-bg flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 264 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-charcoal overflow-hidden flex flex-col shrink-0 relative z-20"
      >
        {/* Sidebar Header */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-hover rounded-[3px] flex items-center justify-center shrink-0 shadow-lg shadow-gold/10">
              <span className="text-lg font-serif italic text-white">T</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="font-display text-sm tracking-[0.15em] text-white uppercase font-normal leading-tight">
                The Executive
              </span>
              <span className="text-[8px] text-gold/50 uppercase tracking-[0.25em]">Desk Portal</span>
            </div>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-3 p-3.5 bg-white/[0.04] border border-white/[0.06] rounded-[3px]">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-display font-normal border border-gold/20">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[11px] text-white/80 font-normal uppercase tracking-wider leading-tight">{user?.name}</span>
              <span className="text-[9px] text-white/25 uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {filteredNavItems.map(item => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3.5 px-5 py-3 text-white/30 hover:text-white/60 rounded-[3px] hover:bg-white/5 transition-all duration-300"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            <span className="text-[11px] uppercase tracking-[0.12em] font-normal">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-5 py-3 text-white/30 hover:text-gold rounded-[3px] hover:bg-white/5 transition-all duration-300 group"
          >
            <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[11px] uppercase tracking-[0.12em] font-normal">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 bg-premium-card border-b border-premium-border flex items-center justify-between px-6 md:px-8 shrink-0"
          style={{ boxShadow: 'var(--shadow-ambient)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-[3px] hover:bg-premium-surface text-premium-muted hover:text-premium-text transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="h-4 w-[1px] bg-premium-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-premium-muted">
              <span className="text-[10px] uppercase tracking-[0.1em] font-normal text-premium-muted/50">Portal</span>
              <ChevronRight size={10} className="text-premium-muted/30" />
              <span className="text-[11px] uppercase tracking-[0.1em] font-normal">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-premium-surface rounded-[3px] border border-premium-border-subtle">
              <Search size={13} className="text-premium-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-xs font-light outline-none w-32 text-premium-text placeholder:text-premium-muted/50"
              />
            </div>
            {/* Notifications */}
            <button className="relative p-2 rounded-[3px] hover:bg-premium-surface text-premium-muted hover:text-premium-text transition-colors">
              <Bell size={16} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold rounded-full" />
            </button>
            {/* Security badge */}
            <div className="hidden lg:flex items-center gap-2 text-[9px] text-premium-muted/40 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              Session Secured
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
