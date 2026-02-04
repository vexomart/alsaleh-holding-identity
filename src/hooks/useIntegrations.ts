/**
 * useIntegrations Hook
 * Real-time integration management with Supabase
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export interface Integration {
  id: string;
  tenant_id: string | null;
  integration_type: string;
  provider: string;
  name_ar: string;
  name_en: string;
  api_key: string | null;
  api_secret: string | null;
  webhook_url: string | null;
  settings: Record<string, any>;
  is_active: boolean;
  is_connected: boolean;
  last_sync_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  event_type: string;
  status: string;
  message: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

interface UseIntegrationsReturn {
  integrations: Integration[] | undefined;
  isLoading: boolean;
  error: Error | null;
  saveIntegration: (data: Partial<Integration>) => Promise<void>;
  testConnection: (integrationId: string) => Promise<boolean>;
  toggleActive: (integrationId: string, active: boolean) => Promise<void>;
  deleteIntegration: (integrationId: string) => Promise<void>;
  getLogs: (integrationId: string) => Promise<IntegrationLog[]>;
  isSaving: boolean;
}

export function useIntegrations(): UseIntegrationsReturn {
  const { user } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all integrations
  const { data: integrations, isLoading, error } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .order("integration_type", { ascending: true });

      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!user,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("integrations_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "integrations",
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["integrations"] });
          
          if (payload.eventType === "UPDATE") {
            const integration = payload.new as Integration;
            toast({
              title: language === "ar" ? "تم تحديث التكامل" : "Integration Updated",
              description: language === "ar" ? integration.name_ar : integration.name_en,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, language]);

  // Save or update integration
  const saveIntegration = useCallback(async (data: Partial<Integration>) => {
    setIsSaving(true);
    try {
      if (data.id) {
        // Update existing
        const { error } = await supabase
          .from("integrations")
          .update({
            api_key: data.api_key,
            api_secret: data.api_secret,
            webhook_url: data.webhook_url,
            settings: data.settings,
            is_active: data.is_active,
            is_connected: data.is_connected,
            name_ar: data.name_ar,
            name_en: data.name_en,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("integrations")
          .insert([{
            integration_type: data.integration_type!,
            provider: data.provider!,
            name_ar: data.name_ar!,
            name_en: data.name_en!,
            api_key: data.api_key,
            api_secret: data.api_secret,
            webhook_url: data.webhook_url,
            settings: data.settings,
          }]);

        if (error) throw error;
      }

      toast({
        title: language === "ar" ? "تم الحفظ بنجاح" : "Saved Successfully",
        description: language === "ar" 
          ? "تم حفظ إعدادات التكامل"
          : "Integration settings saved",
      });
    } catch (err: any) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [user, language]);

  // Test connection
  const testConnection = useCallback(async (integrationId: string): Promise<boolean> => {
    try {
      const integration = integrations?.find(i => i.id === integrationId);
      if (!integration) throw new Error("Integration not found");

      // Call edge function based on provider
      const { data, error } = await supabase.functions.invoke(
        `${integration.provider.replace(/_/g, '-')}-status`,
        { body: { integrationId } }
      );

      if (error) throw error;

      const connected = data?.connected || false;

      // Update connection status
      await supabase
        .from("integrations")
        .update({
          is_connected: connected,
          last_sync_at: new Date().toISOString(),
          last_error: connected ? null : data?.error || "Connection failed",
        })
        .eq("id", integrationId);

      // Log the event
      await supabase.from("integration_logs").insert({
        integration_id: integrationId,
        event_type: "connection_test",
        status: connected ? "success" : "failed",
        message: connected ? "Connection successful" : data?.error,
        metadata: data || {},
      });

      return connected;
    } catch (err: any) {
      console.error("Test connection error:", err);
      return false;
    }
  }, [integrations]);

  // Toggle active status
  const toggleActive = useCallback(async (integrationId: string, active: boolean) => {
    const { error } = await supabase
      .from("integrations")
      .update({ is_active: active, updated_at: new Date().toISOString() })
      .eq("id", integrationId);

    if (error) throw error;

    toast({
      title: active 
        ? (language === "ar" ? "تم التفعيل" : "Activated")
        : (language === "ar" ? "تم الإيقاف" : "Deactivated"),
    });
  }, [language]);

  // Delete integration
  const deleteIntegration = useCallback(async (integrationId: string) => {
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", integrationId);

    if (error) throw error;

    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف التكامل بنجاح" : "Integration deleted successfully",
    });
  }, [language]);

  // Get logs for an integration
  const getLogs = useCallback(async (integrationId: string): Promise<IntegrationLog[]> => {
    const { data, error } = await supabase
      .from("integration_logs")
      .select("*")
      .eq("integration_id", integrationId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as IntegrationLog[];
  }, []);

  return {
    integrations,
    isLoading,
    error: error as Error | null,
    saveIntegration,
    testConnection,
    toggleActive,
    deleteIntegration,
    getLogs,
    isSaving,
  };
}
