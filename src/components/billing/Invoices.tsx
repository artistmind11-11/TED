/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  CreditCard,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Invoice, InvoiceStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Invoices: React.FC = () => {
  const { user } = useAuth();
  const { invoices, clients, entries, addInvoice, updateInvoice, updateEntry } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAction = (invoice: Invoice, action: 'pay' | 'send' | 'download') => {
    if (action === 'pay') {
      updateInvoice(invoice.id, { status: 'paid' });
    } else if (action === 'send') {
      updateInvoice(invoice.id, { status: 'sent' });
    } else if (action === 'download') {
      // Mock download
      console.log(`Downloading ${invoice.invoiceNumber}...`);
    }
  };
  
  // Form State
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    discountAmount: '0',
    taxRate: '5'
  });

  const filteredInvoices = user?.role === 'client' 
    ? invoices.filter(inv => inv.clientId === user.clientId)
    : invoices;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client = clients.find(c => c.id === formData.clientId);
    const clientEntries = entries.filter(e => e.clientId === formData.clientId && e.status === 'approved');
    
    const totalHours = clientEntries.reduce((sum, e) => sum + e.hours, 0);
    const subtotal = clientEntries.reduce((sum, e) => sum + (e.hours * e.rate), 0);
    const taxAmount = subtotal * (parseFloat(formData.taxRate) / 100);
    const discountAmount = parseFloat(formData.discountAmount) || 0;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
      clientId: formData.clientId,
      clientName: client?.name || 'Unknown Client',
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      entries: clientEntries.map(e => e.id),
      totalHours,
      totalAmount: subtotal,
      taxAmount,
      discountAmount,
      status: 'draft',
      paymentMethod: 'bank_transfer'
    };

    addInvoice(newInvoice);
    
    // Mark entries as invoiced
    clientEntries.forEach(entry => {
      updateEntry(entry.id, { status: 'invoiced' });
    });

    setIsModalOpen(false);
    setFormData({
      clientId: clients[0]?.id || '',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      discountAmount: '0',
      taxRate: '5'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-text">Billing & Invoices</h1>
          <p className="text-premium-muted text-sm">Manage your billing history and outstanding payments.</p>
        </div>
        {user?.role !== 'client' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="premium-button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create Invoice
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card bg-charcoal text-white">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Outstanding</p>
          <h3 className="text-2xl font-bold mt-1">
            ${invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + (inv.totalAmount + inv.taxAmount - inv.discountAmount), 0).toLocaleString()}
          </h3>
          <p className="text-xs text-white/40 mt-2">
            {invoices.filter(inv => inv.status !== 'paid').length} invoice(s) awaiting payment
          </p>
        </div>
        <div className="premium-card">
          <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Revenue (MTD)</p>
          <h3 className="text-2xl font-bold text-premium-text mt-1">
            ${invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.totalAmount + inv.taxAmount - inv.discountAmount), 0).toLocaleString()}
          </h3>
          <p className="text-xs text-premium-muted mt-2">
            {invoices.filter(inv => inv.status === 'paid').length} invoices processed
          </p>
        </div>
        <div className="premium-card">
          <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Average Collection Time</p>
          <h3 className="text-2xl font-bold text-premium-text mt-1">4.2 Days</h3>
          <p className="text-xs text-premium-muted mt-2">Last 30 days</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-muted/60" size={16} />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="pl-10 pr-4 py-2 premium-input rounded-sm text-sm focus:outline-none focus:border-gold w-full transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 premium-input rounded-sm text-sm font-medium text-premium-muted hover:bg-premium-surface transition-all">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="premium-card p-0 overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-premium-surface transition-colors">
                  <td className="font-bold text-premium-text">{inv.invoiceNumber}</td>
                  <td className="text-premium-muted">{inv.clientName}</td>
                  <td className="text-premium-muted">{inv.date}</td>
                  <td className="text-premium-muted">{inv.dueDate}</td>
                  <td className="font-bold text-premium-text">${(inv.totalAmount + inv.taxAmount - inv.discountAmount).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${inv.status}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAction(inv, 'download')}
                        className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted" 
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      {user?.role !== 'client' && inv.status === 'draft' && (
                        <button 
                          onClick={() => handleAction(inv, 'send')}
                          className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted" 
                          title="Send to Client"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {user?.role === 'client' && inv.status !== 'paid' && (
                        <button 
                          onClick={() => handleAction(inv, 'pay')}
                          className="premium-button-primary py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <CreditCard size={14} />
                          Pay Now
                        </button>
                      )}
                      <button className="p-2 hover:bg-premium-bg rounded-sm text-premium-muted">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
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
                <h2 className="text-xl font-bold text-white">Create New Invoice</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  <p className="text-[10px] text-premium-muted mt-1 italic">
                    Only approved time entries for this client will be included.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Due Date</label>
                    <input 
                      type="date" 
                      required
                      className="premium-input"
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      required
                      className="premium-input"
                      value={formData.taxRate}
                      onChange={e => setFormData({...formData, taxRate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Discount Amount</label>
                  <input 
                    type="number" 
                    required
                    className="premium-input"
                    value={formData.discountAmount}
                    onChange={e => setFormData({...formData, discountAmount: e.target.value})}
                  />
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
                    Generate Invoice
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
