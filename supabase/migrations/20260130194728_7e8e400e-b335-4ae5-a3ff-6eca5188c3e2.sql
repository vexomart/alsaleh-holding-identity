-- =====================================================
-- PHASE 0.5A: ADD MISSING ROLES TO ENUM
-- =====================================================

-- Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_editor';