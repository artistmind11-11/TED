/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'manager' | 'assistant' | 'client';

export type Permission = 
  | 'time:track' 
  | 'time:approve' 
  | 'time:view_all'
  | 'billing:manage' 
  | 'billing:view'
  | 'clients:manage' 
  | 'clients:view'
  | 'tasks:manage' 
  | 'tasks:assign'
  | 'reports:view'
  | 'settings:manage'
  | 'approvals:view'
  | 'crm:manage'
  | 'crm:view';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string;
  permissions: Permission[];
}

export type EntryStatus = 'submitted' | 'approved' | 'disputed' | 'invoiced' | 'paid' | 'revision_requested' | 'removal_requested';

export interface TimeEntry {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  assistantId: string;
  assistantName: string;
  task: string;
  hours: number;
  rate: number;
  status: EntryStatus;
  isBillable: boolean;
  notes?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  clientId: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  updatedAt: string;
}

export type ServicePlan = 'basic' | 'professional' | 'enterprise';

export interface ClientProfile {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  billingAddress: string;
  hourlyRate: number;
  currency: string;
  servicePlan: ServicePlan;
  retainerHours: number;
  assignedAssistantIds: string[];
  communicationPreferences?: {
    channel: 'email' | 'slack' | 'whatsapp';
    frequency: 'daily' | 'weekly' | 'as-needed';
  };
  createdAt?: string;
  updatedAt?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  entries: string[];
  totalHours: number;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  status: InvoiceStatus;
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'stripe';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  clientId?: string;
}

export interface Interaction {
  id: string;
  type: 'call' | 'meeting' | 'note' | 'email' | 'video';
  date: string;
  content: string;
}

export type CRMStatus = 'active' | 'lead' | 'paused' | 'lost';

export interface CRMClient {
  id: string;
  name: string;
  contactPerson: string;
  contactRole: string;
  status: CRMStatus;
  monthlyValue: number;
  email: string;
  tags?: string[];
  interactions: Interaction[];
  onboardingSteps?: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export type MeetingType = 'call' | 'video' | 'onboarding' | 'project_review';

export interface Meeting {
  id: string;
  dateTime: string;
  title: string;
  type: MeetingType;
  attendees: string[];
  notes?: string;
  discussionPoints?: string[];
  reminderMinutes?: number;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  clientId?: string;
}
