import React from 'react';
import { AshLayout } from '@/components/ash/AshLayout';
import { AshAdminDashboard } from '@/components/ash/AshAdminDashboard';

export default function AshAdmin() {
  return (
    <AshLayout>
      <AshAdminDashboard />
    </AshLayout>
  );
}