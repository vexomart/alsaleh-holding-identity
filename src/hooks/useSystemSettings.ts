/**
 * System Settings Hook
 * Manages fetching and saving system settings from database
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type SettingsCategory = 
  | "general" 
  | "appearance" 
  | "email" 
  | "security" 
  | "localization" 
  | "notifications";

export interface GeneralSettings {
  companyName: string;
  companyNameAr: string;
  tagline: string;
  taglineAr: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  website: string;
  vatNumber: string;
  crNumber: string;
  maintenanceMode: boolean;
}

export interface AppearanceSettings {
  colorScheme: string;
  fontSize: number;
  fontFamily: string;
  enableAnimations: boolean;
  compactMode: boolean;
  highContrast: boolean;
}

export interface EmailSettings {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  smtpProvider: string;
  enableEmailNotifications: boolean;
  enableOrderEmails: boolean;
  enableMarketingEmails: boolean;
  bccAdmin: boolean;
  bccEmail: string;
}

export interface SecuritySettings {
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiry: string;
  sessionTimeout: string;
  maxSessions: string;
  enable2FA: boolean;
  enforce2FAForAdmin: boolean;
  maxLoginAttempts: string;
  lockoutDuration: string;
  enableCaptcha: boolean;
  enableAuditLog: boolean;
  auditRetentionDays: string;
}

export interface LocalizationSettings {
  defaultLanguage: string;
  allowLanguageSwitching: boolean;
  timezone: string;
  currency: string;
  dateFormat: string;
  calendarType: string;
  use24HourFormat: boolean;
  showHijriDate: boolean;
}

export interface NotificationSettings {
  emailNewOrder: boolean;
  emailOrderStatus: boolean;
  emailNewUser: boolean;
  emailSystemAlerts: boolean;
  pushEnabled: boolean;
  pushNewOrder: boolean;
  pushUrgentOnly: boolean;
  inAppEnabled: boolean;
  inAppSound: boolean;
  inAppDesktop: boolean;
  digestEnabled: boolean;
  digestFrequency: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

type SettingsMap = {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  email: EmailSettings;
  security: SecuritySettings;
  localization: LocalizationSettings;
  notifications: NotificationSettings;
};

interface SystemSettingsRecord {
  id: string;
  tenant_id: string | null;
  category: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export function useSystemSettings<T extends SettingsCategory>(category: T) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch settings for a category
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["system-settings", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings" as never)
        .select("*")
        .eq("category", category)
        .is("tenant_id", null)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
        throw error;
      }

      return (data as SystemSettingsRecord)?.settings as unknown as SettingsMap[T];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: SettingsMap[T]) => {
      const { data: existing, error: fetchError } = await supabase
        .from("system_settings" as never)
        .select("id")
        .eq("category", category)
        .is("tenant_id", null)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("system_settings" as never)
          .update({
            settings: newSettings as never,
            updated_by: user?.id,
          } as never)
          .eq("id", (existing as { id: string }).id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("system_settings" as never)
          .insert({
            category,
            tenant_id: null,
            settings: newSettings as never,
            updated_by: user?.id,
          } as never);

        if (error) throw error;
      }

      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings", category] });
    },
  });

  const saveSettings = useCallback(
    async (newSettings: SettingsMap[T], options?: { showToast?: boolean; successMessage?: string; errorMessage?: string }) => {
      const { showToast = true, successMessage, errorMessage } = options || {};
      
      try {
        await saveMutation.mutateAsync(newSettings);
        if (showToast) {
          toast.success(successMessage || "تم حفظ الإعدادات بنجاح");
        }
        return true;
      } catch (err) {
        console.error("Error saving settings:", err);
        if (showToast) {
          toast.error(errorMessage || "حدث خطأ أثناء حفظ الإعدادات");
        }
        return false;
      }
    },
    [saveMutation]
  );

  return {
    settings: data,
    isLoading,
    error,
    isSaving: saveMutation.isPending,
    saveSettings,
    refetch,
  };
}

// Hook to get all settings at once
export function useAllSystemSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["system-settings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings" as never)
        .select("*")
        .is("tenant_id", null);

      if (error) throw error;

      const settingsMap: Partial<Record<SettingsCategory, unknown>> = {};
      (data as SystemSettingsRecord[])?.forEach((record) => {
        settingsMap[record.category as SettingsCategory] = record.settings;
      });

      return settingsMap;
    },
  });

  return {
    settings: data,
    isLoading,
    error,
  };
}
