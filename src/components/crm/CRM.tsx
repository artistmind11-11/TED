/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Mail, 
  MessageSquare, 
  Calendar,
  Tag,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CRMClient, CRMStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const CRM: React.FC = () => {
  const { user } = useAuth();
  const { crmClients, addCRMClient, updateCRMClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactRole: '',
    email: '',
    status: 'lead' as CRMStatus,
    monthlyValue: '',
    notes: ''
  });

  const [interactionData, setInteractionData] = useState({
    type: 'note' as 'call' | 'meeting' | 'note' | 'email' | 'video',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: CRMClient = {
      id: `crm_${Date.now()}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      contactRole: formData.contactRole,
      email: formData.email,
      status: formData.status,
      monthlyValue: parseFloat(formData.monthlyValue) || 0,
      interactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCRMClient(newLead);
    setIsModalOpen(false);
    setFormData({
      name: '',
      contactPerson: '',
      contactRole: '',
      email: '',
      status: 'lead',
      monthlyValue: '',
      notes: ''
    });
  };

  const handleInteractionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const newInteraction = {
      id: `i_${Date.now()}`,
      type: interactionData.type,
      date: new Date().toISOString().split('T')[0],
      content: interactionData.content
    };

    updateCRMClient(selectedClient.id, {
      interactions: [newInteraction, ...selectedClient.interactions]
    });

    setIsInteractionModalOpen(false);
    setInteractionData({ type: 'note', content: '' });
  };

  const handleSendEmail = (client: CRMClient) => {
    window.location.href = `mailto:${client.email}?subject=Executive Support Update`;
    
    // Log the email interaction automatically
    const newInteraction = {
      id: `i_${Date.now()}`,
      type: 'email' as const,
      date: new Date().toISOString().split('T')[0],
      content: 'Sent outbound email to client.'
    };

    updateCRMClient(client.id, {
      interactions: [newInteraction, ...client.interactions]
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-text">CRM Pipeline</h1>
          <p className="text-premium-muted text-sm">Track leads, manage active relationships, and monitor pipeline value.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="premium-button-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card">
          <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Total Pipeline Value</p>
          <h3 className="text-2xl font-bold text-premium-text mt-1">
            ${crmClients.reduce((sum, c) => sum + c.monthlyValue, 0).toLocaleString()}
          </h3>
          <p className="text-xs text-premium-accent mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            +12% from last month
          </p>
        </div>
        <div className="premium-card">
          <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Active Leads</p>
          <h3 className="text-2xl font-bold text-premium-text mt-1">
            {crmClients.filter(c => c.status === 'lead').length}
          </h3>
          <p className="text-xs text-premium-muted mt-2">Pipeline growing</p>
        </div>
        <div className="premium-card">
          <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-premium-text mt-1">24%</h3>
          <p className="text-xs text-premium-muted mt-2">Last 90 days</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-muted/60" size={16} />
            <input 
              type="text" 
              placeholder="Search leads and clients..." 
              className="pl-10 pr-4 py-2 premium-input rounded-sm text-sm focus:outline-none focus:border-gold w-full transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="premium-input py-1.5 text-sm w-32">
              <option>All Status</option>
              <option>Active</option>
              <option>Lead</option>
              <option>Paused</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 premium-input rounded-sm text-sm font-medium text-premium-muted hover:bg-premium-surface transition-all">
              <Filter size={16} />
              More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {crmClients.map(client => (
            <div key={client.id} className="premium-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition-all group">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-premium-bg rounded-sm flex items-center justify-center text-premium-text font-bold group-hover:bg-premium-gold group-hover:text-white transition-all">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-premium-text">{client.name}</h4>
                  <p className="text-xs text-premium-muted">{client.contactPerson} • {client.contactRole}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 flex-[2]">
                <div className="min-w-[120px]">
                  <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-1">Status</p>
                  <span className={`status-badge status-${client.status}`}>
                    {client.status}
                  </span>
                </div>
                <div className="min-w-[120px]">
                  <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-1">Monthly Value</p>
                  <p className="text-sm font-bold text-premium-text">${client.monthlyValue.toLocaleString()}</p>
                </div>
                <div className="min-w-[150px]">
                  <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-1">Last Interaction</p>
                  <p className="text-sm text-premium-muted truncate max-w-[150px]">
                    {client.interactions[0]?.content || 'No interactions yet'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleSendEmail(client)}
                  className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted" 
                  title="Send Email"
                >
                  <Mail size={18} />
                </button>
                <button 
                  onClick={() => {
                    setSelectedClient(client);
                    setIsInteractionModalOpen(true);
                  }}
                  className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted" 
                  title="Log Interaction"
                >
                  <MessageSquare size={18} />
                </button>
                <button className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted">
                  <MoreVertical size={18} />
                </button>
                <div className="w-px h-8 bg-premium-border mx-2"></div>
                <button className="p-2 hover:bg-premium-bg rounded-sm text-premium-text group-hover:text-gold transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-premium-card rounded-sm shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Add New Lead</h2>
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
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Company Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Future Partners"
                      className="premium-input"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Contact Person</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Sarah Jenkins"
                      className="premium-input"
                      value={formData.contactPerson}
                      onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Contact Role</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., CEO"
                      className="premium-input"
                      value={formData.contactRole}
                      onChange={e => setFormData({...formData, contactRole: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="sarah@future.com"
                      className="premium-input"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Status</label>
                    <select 
                      required
                      className="premium-input"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as CRMStatus})}
                    >
                      <option value="lead">Lead</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Monthly Value</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      className="premium-input"
                      value={formData.monthlyValue}
                      onChange={e => setFormData({...formData, monthlyValue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Notes (Optional)</label>
                  <textarea 
                    placeholder="Initial thoughts or context..."
                    className="premium-input min-h-[80px] resize-none"
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
                    Add Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interaction Modal */}
      <AnimatePresence>
        {isInteractionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-premium-card rounded-sm shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Log Interaction</h2>
                <button 
                  onClick={() => setIsInteractionModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleInteractionSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Interaction Type</label>
                  <select 
                    required
                    className="premium-input"
                    value={interactionData.type}
                    onChange={e => setInteractionData({...interactionData, type: e.target.value as any})}
                  >
                    <option value="note">Note</option>
                    <option value="call">Phone Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="video">Video Call</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Content</label>
                  <textarea 
                    required
                    placeholder="What was discussed?"
                    className="premium-input min-h-[120px] resize-none"
                    value={interactionData.content}
                    onChange={e => setInteractionData({...interactionData, content: e.target.value})}
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsInteractionModalOpen(false)}
                    className="flex-1 premium-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 premium-button-primary"
                  >
                    Log Interaction
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
