/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckSquare,
  AlertCircle,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Plus,
  Download,
  Activity,
  ArrowUpRight,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TimeEntry } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

/* ─── Animated Number ─── */
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{typeof value === 'number' && value % 1 !== 0 ? display.toFixed(1) : Math.round(display)}{suffix}
    </span>
  );
}

/* ─── Stat Card ─── */
const StatCard = ({ label, value, subValue, icon: Icon, trend, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    className="stat-card group"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">{label}</span>
      <div className="w-8 h-8 rounded-[3px] bg-premium-gold-soft flex items-center justify-center group-hover:bg-premium-gold transition-colors duration-500">
        <Icon size={14} className="text-premium-gold group-hover:text-white transition-colors duration-500" />
      </div>
    </div>
    <div>
      <h3 className="text-2xl md:text-3xl font-display font-normal text-premium-text tracking-tight">{value}</h3>
      <div className="flex items-center gap-2 mt-1.5">
        {trend && (
          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${trend > 0 ? 'text-premium-accent' : 'text-premium-error'}`}>
            <ArrowUpRight size={10} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </span>
        )}
        <p className="text-[10px] text-premium-muted uppercase tracking-wider font-normal">{subValue}</p>
      </div>
    </div>
    {/* Mini sparkline decoration */}
    <div className="absolute bottom-0 right-0 w-24 h-12 opacity-[0.04] pointer-events-none">
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points="0,35 15,28 30,32 45,20 60,24 75,12 90,18 100,8"
          className="text-premium-gold"
        />
      </svg>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { entries, clients, addEntry } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientId: clients[0]?.id || '',
    task: '',
    hours: '',
    isBillable: true,
    notes: ''
  });

  const stats = useMemo(() => {
    const relevantEntries = user?.role === 'client'
      ? entries.filter(e => e.clientId === user.clientId)
      : entries;

    const totalHours = relevantEntries.reduce((sum, e) => sum + e.hours, 0);
    const approvedHours = relevantEntries.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.hours, 0);
    const pendingHours = relevantEntries.filter(e => e.status === 'submitted').reduce((sum, e) => sum + e.hours, 0);
    const amountOutstanding = relevantEntries.filter(e => e.status === 'invoiced').reduce((sum, e) => sum + (e.hours * e.rate), 0);
    const efficiency = totalHours > 0 ? Math.round((approvedHours / totalHours) * 100) : 0;

    return { totalHours, approvedHours, pendingHours, amountOutstanding, efficiency };
  }, [user, entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId);
    const newEntry: TimeEntry = {
      id: `e_${Date.now()}`,
      date: formData.date,
      clientId: formData.clientId,
      clientName: client?.name || 'Unknown Client',
      assistantId: user?.id || 'u3',
      assistantName: user?.name || 'James Wilson',
      task: formData.task,
      hours: parseFloat(formData.hours),
      rate: client?.hourlyRate || 0,
      status: 'submitted',
      isBillable: formData.isBillable,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addEntry(newEntry);
    setIsModalOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      clientId: clients[0]?.id || '',
      task: '',
      hours: '',
      isBillable: true,
      notes: ''
    });
  };

  const recentEntries = user?.role === 'client'
    ? entries.filter(e => e.clientId === user.clientId).slice(0, 5)
    : entries.slice(0, 5);

  const getStatusClasses = (status: string) => {
    const map: Record<string, string> = {
      submitted: 'status-submitted',
      approved: 'status-approved',
      disputed: 'status-disputed',
      invoiced: 'status-invoiced',
      paid: 'status-paid',
    };
    return `status-badge ${map[status] || 'status-invoiced'}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-normal text-premium-text tracking-tight">
            Welcome, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-premium-muted text-sm mt-1 font-light">
            Strategic oversight & coordination portal
          </p>
        </div>
        <div className="flex gap-3">
          <button className="premium-button-secondary flex items-center gap-2 text-[10px] px-5 py-2.5">
            <Download size={13} />
            Export
          </button>
          {user?.role !== 'client' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="premium-button-primary flex items-center gap-2 text-[10px] px-5 py-2.5"
            >
              <Plus size={13} />
              Log Counsel
            </button>
          )}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          label="Billable Counsel"
          value={<><AnimatedNumber value={stats.totalHours} suffix="h" /></>}
          subValue="Monthly Total"
          icon={Clock}
          trend={12}
          index={0}
        />
        <StatCard
          label="Validated Hours"
          value={<><AnimatedNumber value={stats.approvedHours} suffix="h" /></>}
          subValue={`${stats.efficiency}% Efficiency`}
          icon={CheckSquare}
          trend={8}
          index={1}
        />
        <StatCard
          label="Pending Review"
          value={<><AnimatedNumber value={stats.pendingHours} suffix="h" /></>}
          subValue="Awaiting Action"
          icon={AlertCircle}
          index={2}
        />
        <StatCard
          label="Outstanding"
          value={<><AnimatedNumber value={stats.amountOutstanding} prefix="$" /></>}
          subValue="Unpaid Invoices"
          icon={DollarSign}
          trend={-3}
          index={3}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-normal text-premium-text tracking-tight">Recent Activity</h3>
            <button
              onClick={() => navigate('/time')}
              className="text-[10px] font-normal text-premium-gold uppercase tracking-[0.12em] hover:underline flex items-center gap-1 group"
            >
              View All
              <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="premium-card p-0 overflow-hidden">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <td className="text-premium-muted text-xs">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="font-normal text-premium-text text-sm">{entry.task}</td>
                    <td className="text-premium-muted text-sm">{entry.hours}h</td>
                    <td>
                      <span className={getStatusClasses(entry.status)}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {entry.status.replace('_', ' ')}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-5"
        >
          {/* System Health */}
          <div className="premium-card">
            <h3 className="text-base font-display font-normal text-premium-text tracking-tight mb-5">System Health</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--premium-border)"
                    strokeWidth="2.5"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--premium-accent)"
                    strokeWidth="2.5"
                    strokeDasharray="100, 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 2 }}
                    transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={14} className="text-premium-accent" />
                </div>
              </div>
              <div>
                <p className="text-xs font-display font-normal text-premium-text uppercase tracking-wider">Operational</p>
                <p className="text-[10px] text-premium-muted mt-0.5">Verified 5m ago</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {user?.role !== 'client' && (
            <div className="premium-card">
              <h3 className="text-base font-display font-normal text-premium-text tracking-tight mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'CRM Pipeline', to: '/crm', icon: TrendingUp },
                  { label: 'Generate Invoice', to: '/invoices', icon: DollarSign },
                  { label: 'View Reports', to: '/reports', icon: Activity },
                ].map(({ label, to, icon: ActionIcon }) => (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className="w-full text-left px-4 py-3 rounded-[3px] border border-premium-border hover:border-premium-gold/30 hover:bg-premium-gold-glow transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <ActionIcon size={13} className="text-premium-muted group-hover:text-premium-gold transition-colors" />
                      <span className="text-[11px] font-normal text-premium-text uppercase tracking-wider">{label}</span>
                    </div>
                    <ChevronRight size={12} className="text-premium-border group-hover:text-premium-gold group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Log Time Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-premium-card rounded-sm w-full max-w-lg overflow-hidden border border-premium-border"
              style={{ boxShadow: 'var(--shadow-float)' }}
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <h2 className="text-base font-display font-normal text-white tracking-[0.12em] uppercase">Log Counsel</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/30 hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">Date</label>
                    <input
                      type="date"
                      required
                      className="premium-input"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">Client</label>
                    <select
                      required
                      className="premium-input"
                      value={formData.clientId}
                      onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                    >
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">Task Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Strategic coordination details..."
                    className="premium-input"
                    value={formData.task}
                    onChange={e => setFormData({ ...formData, task: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">Hours</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      required
                      placeholder="0.00"
                      className="premium-input"
                      value={formData.hours}
                      onChange={e => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.isBillable}
                          onChange={e => setFormData({ ...formData, isBillable: e.target.checked })}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors border ${formData.isBillable ? 'bg-premium-gold border-premium-gold' : 'bg-premium-surface border-premium-border'}`} />
                        <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-premium-card transition-transform shadow-sm ${formData.isBillable ? 'translate-x-5' : ''}`} />
                      </div>
                      <span className="text-[11px] font-normal text-premium-text uppercase tracking-wider">Billable</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-normal text-premium-muted uppercase tracking-[0.12em]">Notes</label>
                  <textarea
                    placeholder="Additional context..."
                    className="premium-input min-h-[80px] resize-none"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 premium-button-secondary py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 premium-button-primary py-3"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
