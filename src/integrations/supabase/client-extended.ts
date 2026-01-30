/**
 * Extended Supabase client with type-safe wrappers for tables not yet in the schema.
 * This provides a centralized way to handle queries to tables that may not be reflected
 * in the auto-generated types yet.
 */

import { supabase } from './client';

// Type definitions for tables not yet in the generated schema
export interface PaymentTransaction {
  id: string;
  user_id?: string;
  amount: number;
  status: string;
  transaction_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tenant {
  id: string;
  code: string;
  name: string;
  domain: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  database_url?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

export interface EmailOutbox {
  id: string;
  to_email: string;
  subject: string;
  body?: string;
  status: 'pending' | 'sent' | 'failed' | 'queued' | 'cancelled';
  retries: number;
  idempotency_key?: string;
  template_key?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailJob {
  id: string;
  job_type: string;
  payload?: Record<string, unknown>;
  status: string;
  created_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features?: string[];
  created_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  status: string;
  order: number;
  created_at?: string;
}

export interface ProjectTimeline {
  id: string;
  project_id: string;
  event: string;
  date: string;
  created_at?: string;
}

export interface ProjectNotification {
  id: string;
  project_id: string;
  recipient_email: string;
  notification_type: string;
  title: string;
  message?: string;
  is_read: boolean;
  sent_via_email: boolean;
  created_at: string;
}

export interface ProductOrder {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total: number;
  status: string;
  created_at?: string;
}

export interface UnauthorizedAccessLog {
  id: string;
  user_id?: string;
  ip_address?: string;
  attempted_action?: string;
  created_at?: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  created_at?: string;
}

// Helper function to create typed queries
export const typedQuery = <T>(tableName: string) => {
  return supabase.from(tableName as never) as unknown as ReturnType<typeof supabase.from> & {
    select: (columns?: string) => Promise<{ data: T[] | null; error: Error | null }>;
  };
};

// Typed table accessors
export const tables = {
  paymentTransactions: () => supabase.from('payment_transactions' as never),
  profiles: () => supabase.from('profiles' as never),
  tenants: () => supabase.from('tenants' as never),
  userRoles: () => supabase.from('user_roles' as never),
  emailOutbox: () => supabase.from('email_outbox' as never),
  emailJobs: () => supabase.from('email_jobs' as never),
  subscriptions: () => supabase.from('subscriptions' as never),
  subscriptionPlans: () => supabase.from('subscription_plans' as never),
  projects: () => supabase.from('projects' as never),
  projectPhases: () => supabase.from('project_phases' as never),
  projectTimeline: () => supabase.from('project_timeline' as never),
  projectNotifications: () => supabase.from('project_notifications' as never),
  productOrders: () => supabase.from('product_orders' as never),
  unauthorizedAccessLogs: () => supabase.from('unauthorized_access_logs' as never),
  walletTransactions: () => supabase.from('wallet_transactions' as never),
};

// RPC function caller with type bypass
export const rpc = <T = unknown>(functionName: string, params?: Record<string, unknown>) => {
  return supabase.rpc(functionName as never, params as never) as unknown as Promise<{ data: T; error: Error | null }>;
};

export { supabase };
