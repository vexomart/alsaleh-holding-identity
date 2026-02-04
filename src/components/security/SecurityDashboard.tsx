/**
 * Security Dashboard - Main Security Hub
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DigitalIdCard } from './DigitalIdCard';
import { TrustedDevicesManager } from './TrustedDevicesManager';
import { AccountActivityLog } from './AccountActivityLog';
import { TwoFactorSettings } from './TwoFactorSettings';
import { 
  CreditCard, 
  Smartphone, 
  Activity, 
  Shield,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'id', label: 'الهوية الرقمية', icon: CreditCard },
  { id: 'devices', label: 'الأجهزة', icon: Smartphone },
  { id: '2fa', label: 'التحقق بخطوتين', icon: Shield },
  { id: 'activity', label: 'سجل النشاط', icon: Activity }
];

interface SecurityDashboardProps {
  defaultTab?: string;
}

export const SecurityDashboard = ({ defaultTab = 'id' }: SecurityDashboardProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">مركز الأمان</h1>
          <p className="text-muted-foreground">
            إدارة إعدادات الأمان والخصوصية
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 data-[state=active]:bg-background",
                  "transition-all duration-200"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="id" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DigitalIdCard />
          </motion.div>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TrustedDevicesManager />
          </motion.div>
        </TabsContent>

        <TabsContent value="2fa" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TwoFactorSettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AccountActivityLog />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
