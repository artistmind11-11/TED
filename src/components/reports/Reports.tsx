/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ReportCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="premium-card">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-premium-surface rounded-sm text-premium-gold">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-premium-accent' : 'text-premium-error'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-bold text-premium-text mt-1">{value}</h3>
  </div>
);

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const { entries, clients, invoices } = useData();

  const stats = React.useMemo(() => {
    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.totalAmount + inv.taxAmount - inv.discountAmount), 0);
    const pendingRevenue = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + (inv.totalAmount + inv.taxAmount - inv.discountAmount), 0);
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const activeClientsCount = clients.length;

    // Revenue by client
    const revenueByClient = clients.map(client => {
      const clientRevenue = invoices
        .filter(inv => inv.clientId === client.id && inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.totalAmount + inv.taxAmount - inv.discountAmount), 0);
      return { name: client.name, value: clientRevenue };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    return { totalRevenue, pendingRevenue, totalHours, activeClientsCount, revenueByClient };
  }, [entries, clients, invoices]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-text">Reports & Analytics</h1>
          <p className="text-premium-muted text-sm">Analyze performance, revenue, and utilization across your portal.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 premium-input rounded-sm text-sm font-medium text-premium-muted hover:bg-premium-surface transition-all">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="premium-button-primary flex items-center gap-2">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="+12.5%" isPositive={true} icon={TrendingUp} />
        <ReportCard title="Total Hours" value={`${stats.totalHours.toFixed(1)}h`} change="+2.3%" isPositive={true} icon={BarChart3} />
        <ReportCard title="Active Clients" value={stats.activeClientsCount} change="0%" isPositive={true} icon={PieChart} />
        <ReportCard title="Pending Invoices" value={`$${stats.pendingRevenue.toLocaleString()}`} change="-5.2%" isPositive={false} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card">
          <h3 className="text-lg font-bold text-premium-text mb-6">Revenue by Client (Paid)</h3>
          <div className="space-y-4">
            {stats.revenueByClient.map((item, idx) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-premium-text">{item.name}</span>
                  <span className="font-bold text-premium-text">${item.value.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-premium-surface rounded-none overflow-hidden">
                  <div 
                    className={`h-full ${idx === 0 ? 'bg-premium-gold' : idx === 1 ? 'bg-charcoal' : 'bg-premium-muted'}`} 
                    style={{ width: `${stats.totalRevenue > 0 ? (item.value / stats.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {stats.revenueByClient.length === 0 && (
              <p className="text-sm text-premium-muted italic text-center py-4">No revenue data available yet.</p>
            )}
          </div>
        </div>

        <div className="premium-card">
          <h3 className="text-lg font-bold text-premium-text mb-6">Time Analysis by Category</h3>
          <div className="space-y-4">
            {[
              { name: 'Strategic Planning', hours: 45, color: 'bg-premium-gold' },
              { name: 'Calendar Management', hours: 32, color: 'bg-charcoal' },
              { name: 'Travel Coordination', hours: 28, color: 'bg-premium-muted' },
              { name: 'Administrative', hours: 15, color: 'bg-premium-border' },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-none ${item.color}`}></div>
                <span className="flex-1 text-sm text-premium-muted">{item.name}</span>
                <span className="text-sm font-bold text-premium-text">{item.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
