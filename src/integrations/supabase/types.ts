export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      automation_usage: {
        Row: {
          automation_type: string
          created_at: string | null
          id: string
          subscription_id: string | null
          usage_count: number | null
          usage_date: string | null
          user_id: string
        }
        Insert: {
          automation_type: string
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          usage_count?: number | null
          usage_date?: string | null
          user_id: string
        }
        Update: {
          automation_type?: string
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          usage_count?: number | null
          usage_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          authorized_person: string | null
          client_address: string | null
          client_approved: boolean | null
          client_approved_at: string | null
          client_email: string
          client_id_number: string | null
          client_name: string
          client_phone: string
          client_type: string
          commercial_register: string | null
          company_approved: boolean | null
          company_approved_at: string | null
          contract_duration: string | null
          contract_number: string
          contract_pdf_url: string | null
          created_at: string
          currency: string
          end_date: string | null
          id: string
          nafath_request_id: string | null
          nafath_verified: boolean | null
          nafath_verified_at: string | null
          payment_terms: string | null
          service_description: string | null
          service_price: number
          service_type: string
          start_date: string | null
          status: string
          tax_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          authorized_person?: string | null
          client_address?: string | null
          client_approved?: boolean | null
          client_approved_at?: string | null
          client_email: string
          client_id_number?: string | null
          client_name: string
          client_phone: string
          client_type: string
          commercial_register?: string | null
          company_approved?: boolean | null
          company_approved_at?: string | null
          contract_duration?: string | null
          contract_number: string
          contract_pdf_url?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          nafath_request_id?: string | null
          nafath_verified?: boolean | null
          nafath_verified_at?: string | null
          payment_terms?: string | null
          service_description?: string | null
          service_price: number
          service_type: string
          start_date?: string | null
          status?: string
          tax_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          authorized_person?: string | null
          client_address?: string | null
          client_approved?: boolean | null
          client_approved_at?: string | null
          client_email?: string
          client_id_number?: string | null
          client_name?: string
          client_phone?: string
          client_type?: string
          commercial_register?: string | null
          company_approved?: boolean | null
          company_approved_at?: string | null
          contract_duration?: string | null
          contract_number?: string
          contract_pdf_url?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          nafath_request_id?: string | null
          nafath_verified?: boolean | null
          nafath_verified_at?: string | null
          payment_terms?: string | null
          service_description?: string | null
          service_price?: number
          service_type?: string
          start_date?: string | null
          status?: string
          tax_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_counters: {
        Row: {
          counter: number
          created_at: string
          updated_at: string
          year: number
        }
        Insert: {
          counter?: number
          created_at?: string
          updated_at?: string
          year: number
        }
        Update: {
          counter?: number
          created_at?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          offer_title: string
          payment_method: string | null
          payment_status: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          offer_title: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          offer_title?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          city: string | null
          cover_letter: string | null
          created_at: string
          cv_file_name: string | null
          cv_file_size: number | null
          education: string | null
          email: string
          experience: string | null
          full_name: string
          id: string
          phone: string
          position: string
          status: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_size?: number | null
          education?: string | null
          email: string
          experience?: string | null
          full_name: string
          id?: string
          phone: string
          position: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_size?: number | null
          education?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          phone?: string
          position?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string
          reference_number: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          reference_number?: string | null
          status: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          reference_number?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          contract_data: Json | null
          contract_id: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          offer_title: string
          paylink_transaction_no: string | null
          payment_method: string | null
          status: string
          stc_pay_reference: string | null
          tamara_order_id: string | null
          tap_charge_id: string | null
          tap_payment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          contract_data?: Json | null
          contract_id?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          offer_title: string
          paylink_transaction_no?: string | null
          payment_method?: string | null
          status?: string
          stc_pay_reference?: string | null
          tamara_order_id?: string | null
          tap_charge_id?: string | null
          tap_payment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          contract_data?: Json | null
          contract_id?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          offer_title?: string
          paylink_transaction_no?: string | null
          payment_method?: string | null
          status?: string
          stc_pay_reference?: string | null
          tamara_order_id?: string | null
          tap_charge_id?: string | null
          tap_payment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          client_id: string | null
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          actual_cost: number | null
          actual_delivery_date: string | null
          admin_notes: string | null
          attachments: Json | null
          client_id: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          priority: string | null
          service_type: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          actual_delivery_date?: string | null
          admin_notes?: string | null
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          service_type: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          actual_delivery_date?: string | null
          admin_notes?: string | null
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          service_type?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_interval: string
          created_at: string | null
          currency: string
          custom_integrations: boolean | null
          description: string | null
          description_ar: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_automations: number | null
          max_workflows: number | null
          name: string
          name_ar: string
          price: number
          priority_support: boolean | null
          updated_at: string | null
        }
        Insert: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          custom_integrations?: boolean | null
          description?: string | null
          description_ar?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_automations?: number | null
          max_workflows?: number | null
          name: string
          name_ar: string
          price: number
          priority_support?: boolean | null
          updated_at?: string | null
        }
        Update: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          custom_integrations?: boolean | null
          description?: string | null
          description_ar?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_automations?: number | null
          max_workflows?: number | null
          name?: string
          name_ar?: string
          price?: number
          priority_support?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paylink_transaction_id: string | null
          payment_status: string | null
          plan_id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paylink_transaction_id?: string | null
          payment_status?: string | null
          plan_id: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paylink_transaction_id?: string | null
          payment_status?: string | null
          plan_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          ticket_number: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          ticket_number: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          ticket_number?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_automation_limit: {
        Args: { p_automation_type: string; p_user_id: string }
        Returns: boolean
      }
      check_contract_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_recent_job_application: {
        Args: { applicant_email: string }
        Returns: boolean
      }
      check_recent_newsletter_subscription: {
        Args: { subscriber_email: string }
        Returns: boolean
      }
      enhanced_rate_limit_check: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      generate_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_contract_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_contracts: {
        Args: { requesting_user_id?: string }
        Returns: {
          client_email: string
          client_name: string
          client_phone: string
          contract_number: string
          created_at: string
          id: string
          masked_data: boolean
          service_price: number
          service_type: string
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mask_email: {
        Args: { email_input: string; user_requesting?: string }
        Returns: string
      }
      mask_id_number: {
        Args: { id_input: string; user_requesting?: string }
        Returns: string
      }
      mask_phone: {
        Args: { phone_input: string; user_requesting?: string }
        Returns: string
      }
      record_automation_usage: {
        Args: { p_automation_type: string; p_count?: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
