/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SettingSection = ({ title, description, children }: any) => (
  <div className="premium-card space-y-6">
    <div>
      <h3 className="text-lg font-bold text-premium-text tracking-tight">{title}</h3>
      <p className="text-sm text-premium-muted mt-1">{description}</p>
    </div>
    <div className="space-y-4 pt-4 border-t border-premium-border">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, action }: any) => (
  <div className="flex items-center justify-between gap-4 group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-premium-bg rounded-lg text-premium-muted group-hover:text-gold transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-premium-text">{label}</p>
        <p className="text-xs text-premium-muted">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-charcoal text-white rounded-2xl">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-premium-text">Settings</h1>
          <p className="text-premium-muted text-sm">Manage your account preferences and security settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <SettingSection 
          title="Profile Information" 
          description="Update your personal details and how others see you on the platform."
        >
          <SettingItem 
            icon={User} 
            label="Full Name" 
            description={user?.name} 
            action={<button className="text-xs font-bold text-premium-text hover:underline">Edit</button>}
          />
          <SettingItem 
            icon={Mail} 
            label="Email Address" 
            description={user?.email} 
            action={<button className="text-xs font-bold text-premium-text hover:underline">Change</button>}
          />
          <SettingItem 
            icon={Globe} 
            label="Timezone" 
            description="Dubai, UAE (GMT+4)" 
            action={<button className="text-xs font-bold text-premium-text hover:underline">Update</button>}
          />
        </SettingSection>

        <SettingSection 
          title="Security & Privacy" 
          description="Control your account security and data privacy settings."
        >
          <SettingItem 
            icon={Lock} 
            label="Password" 
            description="Last changed 3 months ago" 
            action={<button className="premium-button-secondary py-1.5 px-4 text-xs">Update Password</button>}
          />
          <SettingItem 
            icon={Smartphone} 
            label="Two-Factor Authentication" 
            description="Add an extra layer of security to your account" 
            action={<div className="w-12 h-6 bg-premium-border rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-premium-card rounded-full shadow-sm"></div></div>}
          />
        </SettingSection>

        <SettingSection 
          title="Notifications" 
          description="Choose what notifications you want to receive and where."
        >
          <SettingItem 
            icon={Bell} 
            label="Email Notifications" 
            description="Weekly summaries and approval alerts" 
            action={<div className="w-12 h-6 bg-gold rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-premium-card rounded-full shadow-sm"></div></div>}
          />
        </SettingSection>

        {user?.role === 'admin' && (
          <SettingSection 
            title="System Configuration" 
            description="Manage global system settings and defaults (Admin only)."
          >
            <SettingItem 
              icon={CreditCard} 
              label="Billing Defaults" 
              description="Default tax rates and payment terms" 
              action={<button className="text-xs font-bold text-premium-text hover:underline">Configure</button>}
            />
            <SettingItem 
              icon={Shield} 
              label="Role Permissions" 
              description="Manage granular permissions for each role" 
              action={<button className="text-xs font-bold text-premium-text hover:underline">Manage</button>}
            />
          </SettingSection>
        )}
      </div>

      <div className="pt-8 border-t border-premium-border text-center">
        <p className="text-[10px] text-premium-muted/60 uppercase tracking-widest">Elite Executive Support Portal • Version 2.0.0</p>
      </div>
    </div>
  );
};
