/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User as UserIcon, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TimeEntry, EntryStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Approvals: React.FC = () => {
  const { user } = useAuth();
  const { entries, updateEntry } = useData();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingEntries = entries.filter(e => 
    (e.status === 'submitted' || e.status === 'disputed' || e.status === 'revision_requested') &&
    (user?.role === 'admin' || user?.role === 'manager' || (user?.role === 'client' && e.clientId === user.clientId))
  );

  const handleAction = (id: string, newStatus: EntryStatus, reason?: string) => {
    updateEntry(id, { 
      status: newStatus, 
      disputeReason: reason,
      updatedAt: new Date().toISOString() 
    });
    setIsRejectModalOpen(false);
    setSelectedEntry(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-premium-text">Approvals & Review</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingEntries.length === 0 ? (
          <div className="premium-card text-center py-12">
            <CheckCircle2 size={48} className="mx-auto text-green-200 mb-4" />
            <p className="text-premium-muted">No items pending approval or review at this time.</p>
          </div>
        ) : (
          pendingEntries.map(entry => (
            <div key={entry.id} className="premium-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-premium-text uppercase tracking-widest bg-premium-bg px-2 py-1 rounded">
                    {entry.clientName}
                  </span>
                  <span className={`status-badge status-${entry.status}`}>
                    {entry.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
                <h4 className="text-lg font-semibold text-premium-text">{entry.task}</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-premium-muted">
                  <span className="flex items-center gap-1"><Clock size={14} /> {entry.hours} hours</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> Total: ${entry.hours * entry.rate}</span>
                  <span className="flex items-center gap-1"><UserIcon size={14} /> Logged by: {entry.assistantName}</span>
                </div>
                {entry.disputeReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-[10px] font-bold text-red-800 uppercase mb-1">Dispute/Revision Reason:</p>
                    <p className="text-sm text-red-700 italic">"{entry.disputeReason}"</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                {user?.role === 'client' ? (
                  <button 
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsRejectModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-all"
                  >
                    <AlertCircle size={18} />
                    Dispute
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsRejectModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-all"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                )}
                <button 
                  onClick={() => handleAction(entry.id, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject/Revision Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-premium-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-charcoal p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {user?.role === 'client' ? 'Dispute Entry' : 'Request Revision'}
                </h2>
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">
                    Reason for {user?.role === 'client' ? 'Dispute' : 'Rejection'}
                  </label>
                  <textarea 
                    required
                    placeholder={user?.role === 'client' ? "Explain why you are disputing this entry..." : "Explain why this entry needs revision..."}
                    className="premium-input min-h-[120px] resize-none"
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsRejectModalOpen(false)}
                    className="flex-1 premium-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedEntry) {
                        const newStatus = user?.role === 'client' ? 'disputed' : 'revision_requested';
                        handleAction(selectedEntry.id, newStatus, rejectionReason);
                      }
                    }}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 premium-button-primary bg-red-600 hover:bg-red-700 shadow-red-600/20 disabled:opacity-50"
                  >
                    Confirm {user?.role === 'client' ? 'Dispute' : 'Rejection'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
