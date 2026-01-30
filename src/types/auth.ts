/**
 * Auth Types - Phase 0.5
 */

export type AppRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'staff' 
  | 'support' 
  | 'finance' 
  | 'content_editor' 
  | 'customer';

export interface UserSession {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tenant_id: string | null;
  roles: AppRole[];
  permissions: string[];
}

export interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

export interface AuthError {
  code: string;
  message: string;
}
