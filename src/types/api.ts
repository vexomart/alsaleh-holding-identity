/**
 * API Types - Phase 0.5
 * Standard API response/error formats
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string[]>;
}

export type ApiErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN' 
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  | 'RATE_LIMITED';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface KPIResponse {
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  orders: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
  revenue: {
    total: number;
    this_month: number;
    currency: string;
  };
  services: {
    total: number;
    active: number;
  };
}

export interface CustomerKPIResponse {
  orders: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
  spent: {
    total: number;
    currency: string;
  };
}
