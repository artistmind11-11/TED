/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User as UserIcon, 
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, clients, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const handleToggleStatus = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: clients[0]?.id || '',
    priority: 'medium' as TaskPriority,
    dueDate: new Date().toISOString().split('T')[0],
    estimatedHours: ''
  });

  const filteredTasks = user?.role === 'client'
    ? tasks.filter(t => t.clientId === user.clientId)
    : tasks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      clientId: formData.clientId,
      assignedTo: user?.id || 'u3',
      priority: formData.priority,
      status: 'pending',
      dueDate: formData.dueDate,
      estimatedHours: parseFloat(formData.estimatedHours) || 0,
      actualHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      clientId: clients[0]?.id || '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedHours: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-premium-text">Task Management</h1>
          <p className="text-premium-muted text-sm">Organize, assign, and track progress on executive tasks.</p>
        </div>
        {user?.role !== 'client' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="premium-button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-premium-muted/60" size={16} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-2 premium-input rounded-sm text-sm focus:outline-none focus:border-gold w-full transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 premium-input rounded-sm text-sm font-medium text-premium-muted hover:bg-premium-surface transition-all">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map(task => {
          const isExpanded = expandedTaskId === task.id;
          const progressPercentage = task.estimatedHours > 0 
            ? Math.min((task.actualHours / task.estimatedHours) * 100, 100) 
            : 0;
          const isOverBudget = task.actualHours > task.estimatedHours;
          const hasNoHours = task.actualHours === 0;

          return (
            <div 
              key={task.id} 
              className={`premium-card flex flex-col gap-4 hover:border-gold/30 transition-all group cursor-pointer ${isExpanded ? 'border-gold/50 shadow-lg shadow-gold/5' : ''}`}
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(task);
                    }}
                    className={`mt-1 p-2 rounded-sm transition-colors ${
                      task.status === 'completed' ? 'bg-premium-accent/10 text-premium-accent' : 'bg-premium-surface text-premium-text hover:bg-premium-gold/10 hover:text-premium-gold'
                    }`}
                  >
                    <CheckSquare size={20} />
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-bold text-premium-text transition-all ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-premium-muted mt-1">{task.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 max-w-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-premium-muted/60 uppercase tracking-widest">Completion Status</span>
                        <span className={`text-[9px] font-bold uppercase ${isOverBudget ? 'text-premium-error' : hasNoHours ? 'text-premium-muted/40' : 'text-premium-accent'}`}>
                          {isOverBudget ? 'Over Budget' : hasNoHours ? 'No Progress' : 'On Track'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-premium-surface rounded-none overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          className={`h-full transition-all duration-500 ${
                            isOverBudget ? 'bg-premium-error' : hasNoHours ? 'bg-premium-muted/20' : 'bg-premium-accent'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <span className="text-[10px] font-bold text-premium-text uppercase tracking-widest bg-premium-bg px-2 py-1 rounded">
                        {clients.find(c => c.id === task.clientId)?.name}
                      </span>
                      <span className={`status-badge status-${task.priority}`}>
                        {task.priority} Priority
                      </span>
                      <span className={`status-badge status-${task.status.replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-1">Due Date</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-premium-text">
                      <Calendar size={14} className="text-gold" />
                      {task.dueDate}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest mb-1">Progress</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-premium-text">
                      <Clock size={14} className={`text-premium-gold ${isOverBudget ? 'text-premium-error' : ''}`} />
                      <span className={isOverBudget ? 'text-premium-error font-bold' : ''}>
                        {task.actualHours}/{task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="p-2 hover:bg-premium-error/10 rounded-sm text-premium-muted hover:text-premium-error transition-colors"
                      title="Delete Task"
                    >
                      <AlertCircle size={18} />
                    </button>
                    <button className="p-2 hover:bg-premium-surface rounded-sm text-premium-muted">
                      <MoreVertical size={18} />
                    </button>
                    <div className={`p-2 rounded-sm text-premium-text transition-all ${isExpanded ? 'rotate-90 text-premium-gold' : 'group-hover:text-premium-gold'}`}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-premium-border pt-4 mt-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-premium-muted/60 uppercase tracking-widest">Created On</p>
                        <p className="text-sm text-premium-text font-medium">
                          {new Date(task.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-premium-muted/60 uppercase tracking-widest">Last Updated</p>
                        <p className="text-sm text-premium-text font-medium">
                          {new Date(task.updatedAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-premium-muted/60 uppercase tracking-widest">Assigned Assistant</p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center">
                            <UserIcon size={12} className="text-gold" />
                          </div>
                          <p className="text-sm text-premium-text font-medium">
                            {task.assignedTo === user?.id ? user.name : 'James Wilson'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
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
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Task Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Monthly Financial Review"
                    className="premium-input"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Description</label>
                  <textarea 
                    required
                    placeholder="What needs to be done?"
                    className="premium-input min-h-[80px] resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Priority</label>
                    <select 
                      required
                      className="premium-input"
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
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
                    <label className="text-[10px] font-bold text-premium-muted/60 uppercase tracking-widest">Estimated Hours</label>
                    <input 
                      type="number" 
                      step="0.5"
                      min="0"
                      required
                      placeholder="0.0"
                      className="premium-input"
                      value={formData.estimatedHours}
                      onChange={e => setFormData({...formData, estimatedHours: e.target.value})}
                    />
                  </div>
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
                    Create Task
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
