/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  TimeEntry, 
  Task, 
  ClientProfile, 
  CRMClient, 
  Invoice, 
  Meeting,
  User
} from '../types';
import { 
  MOCK_ENTRIES, 
  MOCK_TASKS, 
  MOCK_CLIENTS, 
  MOCK_CRM_CLIENTS,
  MOCK_INVOICES
} from '../data/mockData';

interface DataContextType {
  entries: TimeEntry[];
  tasks: Task[];
  clients: ClientProfile[];
  crmClients: CRMClient[];
  invoices: Invoice[];
  addEntry: (entry: TimeEntry) => void;
  updateEntry: (entryId: string, updates: Partial<TimeEntry>) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addClient: (client: ClientProfile) => void;
  addCRMClient: (client: CRMClient) => void;
  updateCRMClient: (clientId: string, updates: Partial<CRMClient>) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void;
  deleteTask: (taskId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TimeEntry[]>(MOCK_ENTRIES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [crmClients, setCrmClients] = useState<CRMClient[]>(MOCK_CRM_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const addEntry = (entry: TimeEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (entryId: string, updates: Partial<TimeEntry>) => {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  };

  const addClient = (client: ClientProfile) => {
    setClients(prev => [client, ...prev]);
  };

  const addCRMClient = (client: CRMClient) => {
    setCrmClients(prev => [client, ...prev]);
  };

  const updateCRMClient = (clientId: string, updates: Partial<CRMClient>) => {
    setCrmClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...updates } : inv));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <DataContext.Provider value={{ 
      entries, 
      tasks, 
      clients, 
      crmClients,
      invoices,
      addEntry,
      updateEntry,
      addTask,
      updateTask,
      deleteTask,
      addClient,
      addCRMClient,
      updateCRMClient,
      addInvoice,
      updateInvoice
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
