export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
