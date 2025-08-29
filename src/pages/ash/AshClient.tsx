import React from 'react';
import { AshLayout } from '@/components/ash/AshLayout';
import { AshClientDashboard } from '@/components/ash/AshClientDashboard';

export default function AshClient() {
  return (
    <AshLayout>
      <AshClientDashboard />
    </AshLayout>
  );
}