/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientProfile, TimeEntry, Task, CRMClient, Meeting, Invoice } from '../types';

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'c1',
    name: 'Zayed Investment Group',
    contactPerson: 'Khalid Bin Zayed',
    email: 'khalid@zayed-invest.com',
    billingAddress: 'Level 42, Emirates Towers, Dubai, UAE',
    hourlyRate: 250,
    currency: 'USD',
    servicePlan: 'enterprise',
    retainerHours: 40,
    assignedAssistantIds: ['u3'],
    communicationPreferences: { channel: 'email', frequency: 'daily' }
  },
  {
    id: 'c2',
    name: 'Al-Farsi Group',
    contactPerson: 'Fatima Al-Farsi',
    email: 'fatima@farsi-group.com',
    billingAddress: 'Diplomatic Area, Manama, Bahrain',
    hourlyRate: 200,
    currency: 'USD',
    servicePlan: 'professional',
    retainerHours: 20,
    assignedAssistantIds: ['u3'],
    communicationPreferences: { channel: 'slack', frequency: 'as-needed' }
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2026-001',
    clientId: 'c1',
    clientName: 'Zayed Investment Group',
    date: '2026-03-31',
    dueDate: '2026-04-15',
    entries: ['e4'],
    totalHours: 5.0,
    totalAmount: 1250.00,
    taxAmount: 62.50,
    discountAmount: 0,
    status: 'sent',
    paymentMethod: 'bank_transfer'
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2026-002',
    clientId: 'c2',
    clientName: 'Al-Farsi Group',
    date: '2026-03-31',
    dueDate: '2026-04-10',
    entries: ['e3'],
    totalHours: 2.5,
    totalAmount: 500.00,
    taxAmount: 25.00,
    discountAmount: 50.00,
    status: 'paid',
    paymentMethod: 'credit_card'
  }
];

export const MOCK_ENTRIES: TimeEntry[] = [
  {
    id: 'e1',
    date: '2026-04-01',
    clientId: 'c1',
    clientName: 'Zayed Investment Group',
    assistantId: 'u3',
    assistantName: 'James Wilson',
    task: 'Executive Calendar Management & Travel Planning',
    hours: 4.5,
    rate: 250,
    status: 'approved',
    isBillable: true,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-02T09:00:00Z',
  },
  {
    id: 'e2',
    date: '2026-04-02',
    clientId: 'c1',
    clientName: 'Zayed Investment Group',
    assistantId: 'u3',
    assistantName: 'James Wilson',
    task: 'Board Meeting Preparation & Minutes',
    hours: 3.0,
    rate: 250,
    status: 'submitted',
    isBillable: true,
    createdAt: '2026-04-02T16:00:00Z',
    updatedAt: '2026-04-02T16:00:00Z',
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Q2 Travel Arrangements',
    description: 'Book flights and hotels for London trip',
    clientId: 'c1',
    assignedTo: 'u3',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-04-15',
    estimatedHours: 5,
    actualHours: 2,
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-11T14:00:00Z'
  },
  {
    id: 't2',
    title: 'Monthly Expense Report',
    description: 'Compile and categorize all March receipts',
    clientId: 'c2',
    assignedTo: 'u3',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-04-10',
    estimatedHours: 3,
    actualHours: 0,
    createdAt: '2026-04-08T11:00:00Z',
    updatedAt: '2026-04-08T11:00:00Z'
  }
];

export const MOCK_CRM_CLIENTS: CRMClient[] = [
  {
    id: 'crm1',
    name: 'Global Tech Solutions',
    contactPerson: 'Sarah Jenkins',
    contactRole: 'CEO',
    status: 'active',
    monthlyValue: 12000,
    email: 'sarah.j@globaltech.com',
    tags: ['industry: tech', 'priority: high'],
    interactions: [
      { id: 'i1', type: 'call', date: '2026-04-08', content: 'Quarterly strategy alignment call.' },
      { id: 'i2', type: 'email', date: '2026-04-05', content: 'Sent proposal for new project scope.' }
    ]
  },
  {
    id: 'crm2',
    name: 'Eco-Friendly Foods',
    contactPerson: 'Mark Thompson',
    contactRole: 'Operations Manager',
    status: 'lead',
    monthlyValue: 4500,
    email: 'mark@ecofoods.com',
    tags: ['industry: food', 'priority: medium'],
    interactions: [
      { id: 'i3', type: 'meeting', date: '2026-04-10', content: 'Initial discovery meeting.' }
    ],
    onboardingSteps: [
      { id: 's1', label: 'Contract Signed', completed: true },
      { id: 's2', label: 'Onboarding Call Scheduled', completed: true },
      { id: 's3', label: 'First Invoice Sent', completed: false }
    ]
  }
];

