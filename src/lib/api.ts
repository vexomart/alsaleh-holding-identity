/**
 * API Client - Phase 0.5
 * Typed wrapper for API calls with standard error handling
 */

import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, ApiError, ApiErrorCode } from '@/types/api';

/**
 * Create standard API error
 */
export const createApiError = (
  code: ApiErrorCode,
  message: string,
  details?: Record<string, string[]>
): ApiError => ({
  code,
  message,
  details,
});

/**
 * Handle Supabase error and convert to API error
 */
export const handleSupabaseError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message;
    
    if (msg.includes('JWT')) {
      return createApiError('SESSION_EXPIRED', 'جلستك انتهت، يرجى تسجيل الدخول مرة أخرى');
    }
    if (msg.includes('permission') || msg.includes('RLS')) {
      return createApiError('FORBIDDEN', 'ليس لديك صلاحية للقيام بهذا الإجراء');
    }
    if (msg.includes('not found')) {
      return createApiError('NOT_FOUND', 'العنصر المطلوب غير موجود');
    }
    
    return createApiError('INTERNAL_ERROR', msg);
  }
  
  return createApiError('INTERNAL_ERROR', 'حدث خطأ غير متوقع');
};

/**
 * Create successful API response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error API response
 */
export function errorResponse<T = never>(error: ApiError): ApiResponse<T> {
  return {
    success: false,
    error,
  };
}

/**
 * Call Supabase edge function with typed response
 */
export async function callEdgeFunction<T>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      return errorResponse<T>(handleSupabaseError(error));
    }

    return successResponse<T>(data as T);
  } catch (error) {
    return errorResponse<T>(handleSupabaseError(error));
  }
}

/**
 * Generic query wrapper with error handling
 */
export async function queryWrapper<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      return errorResponse<T>(handleSupabaseError(error));
    }

    if (data === null) {
      return errorResponse<T>(createApiError('NOT_FOUND', 'لم يتم العثور على البيانات'));
    }

    return successResponse<T>(data);
  } catch (error) {
    return errorResponse<T>(handleSupabaseError(error));
  }
}

/**
 * Generic mutation wrapper with error handling
 */
export async function mutationWrapper<T>(
  mutationFn: () => Promise<{ data: T | null; error: unknown }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await mutationFn();

    if (error) {
      return errorResponse<T>(handleSupabaseError(error));
    }

    return successResponse<T>(data as T);
  } catch (error) {
    return errorResponse<T>(handleSupabaseError(error));
  }
}
