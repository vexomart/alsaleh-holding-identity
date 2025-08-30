import React from 'react';
import { AshLayout, AshProvider } from '@/components/ash/AshLayout';
import { AshClientDashboard } from '@/components/ash/AshClientDashboard';

export default function AshClient() {
  return (
    <AshProvider>
      <AshLayout>
        <AshClientDashboard />
      </AshLayout>
    </AshProvider>
  );
}