/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Shield,
  Star,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ClientProfile, ServicePlan } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Clients: React.FC = () => {
  const { user } = useAuth();
  const { clients, addClient, crmClients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    servicePlan: 'professional' as ServicePlan,
    hourlyRate: '',
    retainerHours: '',
    billingAddress: '',
    currency: 'USD'
  });

  const activeLeads = crmClients.filter(lead => lead.status === 'active');

  const handlePullFromCRM = (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId);
    if (lead) {
      setFormData({
        ...formData,
        name: lead.name,
        contactPerson: lead.contactPerson,
        email: lead.email,
        hourlyRate: lead.monthlyValue ? (lead.monthlyValue / 20).toString() : '', // Rough estimate if monthly value exists
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: ClientProfile = {
      id: `c_${Date.now()}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      servicePlan: formData.servicePlan,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      retainerHours: parseFloat(formData.retainerHours) || 0,
      billingAddress: formData.billingAddress,
      currency: formData.currency,
      assignedAssistantIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addClient(newClient);
    setIsModalOpen(false);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      servicePlan: 'professional',
      hourlyRate: '',
      retainerHours: '',
      billingAddress: '',
      currency: 'USD'
    });
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=Executive Support Inquiry`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-text">Client Management</h1>
          <p className="text-premium-muted text-sm">Manage client profiles, service plans, and assigned assistants.</p>
        </div>
        {user?.role !== 'client' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="premium-button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Client
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map(client => (
          <div key={client.id} className="premium-card hover:border-gold/30 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-charcoal rounded-none flex items-center justify-center text-white font-bold text-xl">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-premium-text group-hover:text-gold transition-colors">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-white bg-premium-gold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                      {client.servicePlan}
                    </span>
                    <span className="text-xs text-premium-muted">{client.contactPerson}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSendEmail(client.email)}
                  className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted"
                  title="Send Email"
                >
                  <Mail size={18} />
                </button>
                <button className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-premium-surface rounded-none">
                <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Hourly Rate</p>
                <p className="text-lg font-bold text-premium-text">${client.hourlyRate}/{client.currency}</p>
              </div>
              <div className="p-3 bg-premium-surface rounded-none">
                <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Monthly Retainer</p>
                <p className="text-lg font-bold text-premium-text">{client.retainerHours} Hours</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-premium-muted">
                <Mail size={16} className="text-gold" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-premium-muted">
                <MapPin size={16} className="text-gold" />
                <span className="truncate">{client.billingAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-premium-muted">
                <Shield size={16} className="text-gold" />
                <span>Assigned: {client.assignedAssistantIds.length} Assistant(s)</span>
              </div>
            </div>

            <div className="pt-6 border-t border-premium-border flex items-center justify-between">
              <div className="flex -space-x-2">
                {client.assignedAssistantIds.map((id, idx) => (
                  <div key={id} className="w-8 h-8 rounded-none border-2 border-white bg-charcoal flex items-center justify-center text-[10px] font-bold text-white" title={`Assistant ${id}`}>
                    A{idx + 1}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setSelectedClient(client);
                  setIsProfileModalOpen(true);
                }}
                className="text-sm font-bold text-premium-text flex items-center gap-1 hover:text-gold transition-colors"
              >
                View Full Profile
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-premium-card rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-premium-gold rounded-sm flex items-center justify-center text-white font-bold text-xl">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedClient.name}</h2>
                    <p className="text-sm text-white/60">Client Profile</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-2">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-premium-text">
                        <Star size={16} className="text-gold" />
                        <span className="font-medium">{selectedClient.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-3 text-premium-text">
                        <Mail size={16} className="text-gold" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-premium-text">
                        <MapPin size={16} className="text-gold" />
                        <span className="text-sm">{selectedClient.billingAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-2">Service Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-premium-surface rounded-lg">
                        <span className="text-sm text-premium-muted">Plan</span>
                        <span className="text-sm font-bold text-premium-text uppercase">{selectedClient.servicePlan}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-premium-surface rounded-lg">
                        <span className="text-sm text-premium-muted">Rate</span>
                        <span className="text-sm font-bold text-premium-text">${selectedClient.hourlyRate}/{selectedClient.currency}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-premium-surface rounded-lg">
                        <span className="text-sm text-premium-muted">Retainer</span>
                        <span className="text-sm font-bold text-premium-text">{selectedClient.retainerHours} Hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-2">Assigned Team</h4>
                    <div className="space-y-2">
                      {selectedClient.assignedAssistantIds.length > 0 ? (
                        selectedClient.assignedAssistantIds.map(id => (
                          <div key={id} className="flex items-center gap-3 p-2 border border-premium-border rounded-sm">
                            <div className="w-8 h-8 bg-charcoal rounded-none flex items-center justify-center text-[10px] font-bold text-white">
                              A
                            </div>
                            <span className="text-sm font-medium text-premium-text">Assistant {id}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-premium-muted italic">No assistants assigned yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => handleSendEmail(selectedClient.email)}
                      className="w-full premium-button-primary flex items-center justify-center gap-2"
                    >
                      <Mail size={18} />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
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
                <h2 className="text-xl font-bold text-white">Add New Client</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {activeLeads.length > 0 && (
                  <div className="p-4 bg-premium-gold/5 border border-premium-gold/20 rounded-sm space-y-2">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Pull from Active CRM Lead</label>
                    <select 
                      className="premium-input bg-premium-card"
                      onChange={(e) => handlePullFromCRM(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a lead to pre-fill data...</option>
                      {activeLeads.map(lead => (
                        <option key={lead.id} value={lead.id}>{lead.name} ({lead.contactPerson})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Company Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Acme Corp"
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
                      placeholder="e.g., John Doe"
                      className="premium-input"
                      value={formData.contactPerson}
                      onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="client@example.com"
                    className="premium-input"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Service Plan</label>
                    <select 
                      required
                      className="premium-input"
                      value={formData.servicePlan}
                      onChange={e => setFormData({...formData, servicePlan: e.target.value as ServicePlan})}
                    >
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Currency</label>
                    <select 
                      required
                      className="premium-input"
                      value={formData.currency}
                      onChange={e => setFormData({...formData, currency: e.target.value})}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Hourly Rate</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      className="premium-input"
                      value={formData.hourlyRate}
                      onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Retainer Hours</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0"
                      className="premium-input"
                      value={formData.retainerHours}
                      onChange={e => setFormData({...formData, retainerHours: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Billing Address</label>
                  <textarea 
                    required
                    placeholder="Full address for invoicing..."
                    className="premium-input min-h-[80px] resize-none"
                    value={formData.billingAddress}
                    onChange={e => setFormData({...formData, billingAddress: e.target.value})}
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
                    Add Client
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
