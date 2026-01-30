/**
 * Users Types - Phase 0.5
 */

import type { AppRole } from './auth';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  preferred_language: string;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserWithRoles extends User {
  roles: UserRole[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  tenant_id: string | null;
  granted_at: string;
  granted_by: string | null;
  expires_at: string | null;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  full_name_ar?: string;
  phone?: string;
  role: AppRole;
  tenant_id?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  full_name_ar?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  preferred_language?: string;
}

export interface UserFilters {
  search?: string;
  role?: AppRole;
  is_active?: boolean;
  tenant_id?: string;
}

export interface UserListResponse {
  users: UserWithRoles[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
