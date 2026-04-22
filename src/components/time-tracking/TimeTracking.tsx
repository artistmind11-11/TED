/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Play, 
  Square, 
  Plus, 
  Filter, 
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TimeEntry, EntryStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

const StatCard = ({ label, value, subValue, icon: Icon }: any) => (
  <div className="premium-card flex flex-col gap-2 border-l-4 border-l-gold">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-premium-surface rounded-lg">
        <Icon size={18} className="text-gold" />
      </div>
      <span className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">{label}</span>
    </div>
    <div className="mt-2">
      <h3 className="text-2xl font-bold text-premium-text">{value}</h3>
      <p className="text-xs text-premium-muted">{subValue}</p>
    </div>
  </div>
);

export const TimeTracking: React.FC = () => {
  const { user } = useAuth();
  const { entries, tasks, clients, addEntry } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
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
      
    const runningTasks = tasks.filter(t => t.status === 'in-progress').length;
    const finishedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalHours = relevantEntries.reduce((sum, e) => sum + e.hours, 0);
    return { runningTasks, finishedTasks, totalHours };
  }, [entries, tasks, user]);

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

  const displayEntries = user?.role === 'client'
    ? entries.filter(e => e.clientId === user.clientId)
    : entries;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-premium-text">Time Tracking</h1>
      </div>

      {/* Stats Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Running Tasks" 
          value={stats.runningTasks} 
          subValue="Active in pipeline" 
          icon={Play} 
        />
        <StatCard 
          label="Finished Tasks" 
          value={stats.finishedTasks} 
          subValue="Completed this period" 
          icon={CheckCircle2} 
        />
        <StatCard 
          label="Total Hours" 
          value={`${stats.totalHours.toFixed(1)}h`} 
          subValue="Billable time logged" 
          icon={Clock} 
        />
      </div>

      {/* Entries Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-muted/60" size={16} />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="pl-10 pr-4 py-2 premium-input rounded-lg text-sm focus:outline-none focus:border-gold w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 premium-input rounded-lg text-sm font-medium text-premium-muted hover:bg-premium-surface transition-all">
              <Filter size={16} />
              Filters
            </button>
          </div>
          {user?.role !== 'client' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="premium-button-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Manual Entry
            </button>
          )}
        </div>

        <div className="premium-card p-0 overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Task Description</th>
                <th>Hours</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-premium-surface transition-colors">
                  <td className="text-premium-muted">{entry.date}</td>
                  <td className="font-bold text-premium-text">{entry.clientName}</td>
                  <td className="max-w-md">
                    <p className="font-medium text-premium-text">{entry.task}</p>
                    {entry.notes && <p className="text-xs text-premium-muted mt-1 italic">"{entry.notes}"</p>}
                    {entry.disputeReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-100">
                        <p className="text-[9px] font-bold text-red-800 uppercase tracking-widest">Revision Requested:</p>
                        <p className="text-xs text-red-700 italic">"{entry.disputeReason}"</p>
                      </div>
                    )}
                  </td>
                  <td className="font-mono font-bold text-premium-text">{entry.hours.toFixed(2)}h</td>
                  <td>
                    <span className={`status-badge status-${entry.status}`}>
                      {entry.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="p-2 hover:bg-premium-bg rounded-lg text-premium-muted transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-premium-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manual Time Entry</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      required
                      className="premium-input"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Client</label>
                    <select 
                      required
                      className="premium-input"
                      value={formData.clientId}
                      onChange={e => setFormData({...formData, clientId: e.target.value})}
                    >
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Task Description</label>
                  <input 
                    type="text" 
                    required
                    placeholder="What did you work on?"
                    className="premium-input"
                    value={formData.task}
                    onChange={e => setFormData({...formData, task: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Hours</label>
                    <input 
                      type="number" 
                      step="0.25"
                      min="0.25"
                      required
                      placeholder="0.00"
                      className="premium-input"
                      value={formData.hours}
                      onChange={e => setFormData({...formData, hours: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={formData.isBillable}
                          onChange={e => setFormData({...formData, isBillable: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${formData.isBillable ? 'bg-gold' : 'bg-slate/20'}`}></div>
                        <div className={`absolute left-1 top-1 w-3 h-3 bg-premium-card rounded-full transition-transform ${formData.isBillable ? 'translate-x-5' : ''}`}></div>
                      </div>
                      <span className="text-sm font-bold text-premium-text uppercase tracking-widest">Billable</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Notes (Optional)</label>
                  <textarea 
                    placeholder="Additional details..."
                    className="premium-input min-h-[100px] resize-none"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 premium-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 premium-button-primary"
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
