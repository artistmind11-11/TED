import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './components/Login';
import { Website } from './website/Website';

// Portal Components
import { Dashboard } from './components/dashboard/Dashboard';
import { TimeTracking } from './components/time-tracking/TimeTracking';
import { Approvals } from './components/approvals/Approvals';
import { Invoices } from './components/billing/Invoices';
import { Clients } from './components/clients/Clients';
import { CRM } from './components/crm/CRM';
import { Tasks } from './components/tasks/Tasks';
import { Reports } from './components/reports/Reports';
import { Settings } from './components/settings/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Website />} />
            <Route path="/login" element={<Login />} />
            
            {/* Portal Routes (Protected) */}
            <Route path="/portal" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/time" element={
              <ProtectedRoute permission="time:track">
                <Layout>
                  <TimeTracking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute permission="tasks:manage">
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/approvals" element={
              <ProtectedRoute permission="approvals:view">
                <Layout>
                  <Approvals />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute permission="billing:view">
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute permission="clients:view">
                <Layout>
                  <Clients />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/crm" element={
              <ProtectedRoute permission="crm:view">
                <Layout>
                  <CRM />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute permission="reports:view">
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to="/portal" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}
