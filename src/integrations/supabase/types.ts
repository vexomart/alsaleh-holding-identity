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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: unknown
          location: string | null
          metadata: Json | null
          risk_level: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown
          location?: string | null
          metadata?: Json | null
          risk_level?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown
          location?: string | null
          metadata?: Json | null
          risk_level?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_activity_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transfer_requests: {
        Row: {
          account_holder_name: string | null
          amount: number
          bank_name: string
          created_at: string | null
          currency: string | null
          iban: string
          id: string
          processed_at: string | null
          receipt_media_url: string | null
          reference_code: string | null
          rejection_reason: string | null
          reviewer_notes: string | null
          reviewer_user_id: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          amount: number
          bank_name: string
          created_at?: string | null
          currency?: string | null
          iban: string
          id?: string
          processed_at?: string | null
          receipt_media_url?: string | null
          reference_code?: string | null
          rejection_reason?: string | null
          reviewer_notes?: string | null
          reviewer_user_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          amount?: number
          bank_name?: string
          created_at?: string | null
          currency?: string | null
          iban?: string
          id?: string
          processed_at?: string | null
          receipt_media_url?: string | null
          reference_code?: string | null
          rejection_reason?: string | null
          reviewer_notes?: string | null
          reviewer_user_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transfer_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transfer_requests_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "customer_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_files: {
        Row: {
          contract_id: string
          created_at: string | null
          generated_at: string | null
          id: string
          pdf_hash_sha256: string
          pdf_url: string
          tenant_id: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_hash_sha256: string
          pdf_url: string
          tenant_id?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_hash_sha256?: string
          pdf_url?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_files_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_files_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_signatures: {
        Row: {
          contract_id: string
          created_at: string | null
          id: string
          ip_address: unknown
          signature_data_json: Json | null
          signature_method: Database["public"]["Enums"]["signature_method"]
          signer_name: string
          signer_national_id: string | null
          signer_phone: string | null
          signer_user_id: string
          user_agent: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          signature_data_json?: Json | null
          signature_method?: Database["public"]["Enums"]["signature_method"]
          signer_name: string
          signer_national_id?: string | null
          signer_phone?: string | null
          signer_user_id: string
          user_agent?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          signature_data_json?: Json | null
          signature_method?: Database["public"]["Enums"]["signature_method"]
          signer_name?: string
          signer_national_id?: string | null
          signer_phone?: string | null
          signer_user_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          body_ar: string
          body_en: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          service_id: string | null
          tenant_id: string | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          version: number
        }
        Insert: {
          body_ar: string
          body_en?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          service_id?: string | null
          tenant_id?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          body_ar?: string
          body_en?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          service_id?: string | null
          tenant_id?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_templates_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          admin_approval_notes: string | null
          admin_approved_at: string | null
          admin_approved_by: string | null
          admin_rejection_reason: string | null
          contract_number: string
          created_at: string | null
          customer_pre_approval: boolean | null
          customer_user_id: string
          id: string
          locale: string | null
          order_id: string | null
          pre_approval_ip: unknown
          pre_approval_metadata: Json | null
          pre_approval_timestamp: string | null
          pricing_json: Json | null
          scope_summary: string | null
          scope_summary_ar: string | null
          service_id: string | null
          signed_at: string | null
          signed_by_user_id: string | null
          status: Database["public"]["Enums"]["contract_status"]
          template_id: string | null
          tenant_id: string | null
          terms_snapshot_json: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_approval_notes?: string | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_rejection_reason?: string | null
          contract_number: string
          created_at?: string | null
          customer_pre_approval?: boolean | null
          customer_user_id: string
          id?: string
          locale?: string | null
          order_id?: string | null
          pre_approval_ip?: unknown
          pre_approval_metadata?: Json | null
          pre_approval_timestamp?: string | null
          pricing_json?: Json | null
          scope_summary?: string | null
          scope_summary_ar?: string | null
          service_id?: string | null
          signed_at?: string | null
          signed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          template_id?: string | null
          tenant_id?: string | null
          terms_snapshot_json?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_approval_notes?: string | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_rejection_reason?: string | null
          contract_number?: string
          created_at?: string | null
          customer_pre_approval?: boolean | null
          customer_user_id?: string
          id?: string
          locale?: string | null
          order_id?: string | null
          pre_approval_ip?: unknown
          pre_approval_metadata?: Json | null
          pre_approval_timestamp?: string | null
          pricing_json?: Json | null
          scope_summary?: string | null
          scope_summary_ar?: string | null
          service_id?: string | null
          signed_at?: string | null
          signed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          template_id?: string | null
          tenant_id?: string | null
          terms_snapshot_json?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          customer_user_id: string
          id: string
          ledger_account_id: string | null
          metadata: Json | null
          reserved_balance: number | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
          wallet_number: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          customer_user_id: string
          id?: string
          ledger_account_id?: string | null
          metadata?: Json | null
          reserved_balance?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          wallet_number: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          customer_user_id?: string
          id?: string
          ledger_account_id?: string | null
          metadata?: Json | null
          reserved_balance?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          wallet_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_wallets_ledger_account_id_fkey"
            columns: ["ledger_account_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_wallets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      device_verification_codes: {
        Row: {
          code: string
          created_at: string | null
          device_fingerprint: string
          expires_at: string
          id: string
          used: boolean | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          device_fingerprint: string
          expires_at: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          device_fingerprint?: string
          expires_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          address_ar: string | null
          city: string | null
          commercial_name_ar: string | null
          cr_number: string | null
          created_at: string | null
          email: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          legal_name_ar: string
          metadata: Json | null
          national_id: string | null
          owner_user_id: string
          phone: string | null
          status: Database["public"]["Enums"]["entity_status"]
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_ar?: string | null
          city?: string | null
          commercial_name_ar?: string | null
          cr_number?: string | null
          created_at?: string | null
          email?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          legal_name_ar: string
          metadata?: Json | null
          national_id?: string | null
          owner_user_id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_ar?: string | null
          city?: string | null
          commercial_name_ar?: string | null
          cr_number?: string | null
          created_at?: string | null
          email?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          legal_name_ar?: string
          metadata?: Json | null
          national_id?: string | null
          owner_user_id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["entity_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_members: {
        Row: {
          can_sign: boolean | null
          created_at: string | null
          entity_id: string
          id: string
          role: Database["public"]["Enums"]["entity_member_role"]
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_sign?: boolean | null
          created_at?: string | null
          entity_id: string
          id?: string
          role?: Database["public"]["Enums"]["entity_member_role"]
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_sign?: boolean | null
          created_at?: string | null
          entity_id?: string
          id?: string
          role?: Database["public"]["Enums"]["entity_member_role"]
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_members_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_applications: {
        Row: {
          amount_sar: number
          application_number: string
          created_at: string | null
          decided_at: string | null
          decision_reason_ar: string | null
          down_payment_sar: number | null
          entity_id: string
          id: string
          order_id: string | null
          purpose_ar: string | null
          score_snapshot: Json | null
          service_id: string | null
          status: Database["public"]["Enums"]["finance_application_status"]
          submitted_at: string | null
          tenant_id: string | null
          tenor_months: number
          updated_at: string | null
        }
        Insert: {
          amount_sar: number
          application_number: string
          created_at?: string | null
          decided_at?: string | null
          decision_reason_ar?: string | null
          down_payment_sar?: number | null
          entity_id: string
          id?: string
          order_id?: string | null
          purpose_ar?: string | null
          score_snapshot?: Json | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["finance_application_status"]
          submitted_at?: string | null
          tenant_id?: string | null
          tenor_months?: number
          updated_at?: string | null
        }
        Update: {
          amount_sar?: number
          application_number?: string
          created_at?: string | null
          decided_at?: string | null
          decision_reason_ar?: string | null
          down_payment_sar?: number | null
          entity_id?: string
          id?: string
          order_id?: string | null
          purpose_ar?: string | null
          score_snapshot?: Json | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["finance_application_status"]
          submitted_at?: string | null
          tenant_id?: string | null
          tenor_months?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_applications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_applications_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_contracts: {
        Row: {
          admin_approved_at: string | null
          admin_approved_by: string | null
          application_id: string
          contract_number: string
          created_at: string | null
          id: string
          offer_id: string
          pdf_meta: Json | null
          pdf_url: string | null
          signed_at: string | null
          signed_by_user_id: string | null
          status: Database["public"]["Enums"]["finance_contract_status"]
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          application_id: string
          contract_number: string
          created_at?: string | null
          id?: string
          offer_id: string
          pdf_meta?: Json | null
          pdf_url?: string | null
          signed_at?: string | null
          signed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["finance_contract_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          application_id?: string
          contract_number?: string
          created_at?: string | null
          id?: string
          offer_id?: string
          pdf_meta?: Json | null
          pdf_url?: string | null
          signed_at?: string | null
          signed_by_user_id?: string | null
          status?: Database["public"]["Enums"]["finance_contract_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_contracts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "finance_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_contracts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "finance_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_documents: {
        Row: {
          created_at: string | null
          doc_type: Database["public"]["Enums"]["finance_doc_type"]
          entity_id: string
          file_name: string | null
          file_url: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["finance_doc_status"]
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: Database["public"]["Enums"]["finance_doc_type"]
          entity_id: string
          file_name?: string | null
          file_url: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["finance_doc_status"]
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: Database["public"]["Enums"]["finance_doc_type"]
          entity_id?: string
          file_name?: string | null
          file_url?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["finance_doc_status"]
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_offers: {
        Row: {
          application_id: string
          apr_percent: number
          created_at: string | null
          expires_at: string | null
          fees_sar: number | null
          id: string
          monthly_payment_sar: number
          offer_name_ar: string | null
          offer_name_en: string | null
          offer_status: Database["public"]["Enums"]["finance_offer_status"]
          tenant_id: string | null
          total_payable_sar: number
        }
        Insert: {
          application_id: string
          apr_percent?: number
          created_at?: string | null
          expires_at?: string | null
          fees_sar?: number | null
          id?: string
          monthly_payment_sar: number
          offer_name_ar?: string | null
          offer_name_en?: string | null
          offer_status?: Database["public"]["Enums"]["finance_offer_status"]
          tenant_id?: string | null
          total_payable_sar: number
        }
        Update: {
          application_id?: string
          apr_percent?: number
          created_at?: string | null
          expires_at?: string | null
          fees_sar?: number | null
          id?: string
          monthly_payment_sar?: number
          offer_name_ar?: string | null
          offer_name_en?: string | null
          offer_status?: Database["public"]["Enums"]["finance_offer_status"]
          tenant_id?: string | null
          total_payable_sar?: number
        }
        Relationships: [
          {
            foreignKeyName: "finance_offers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "finance_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_offers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_payments: {
        Row: {
          amount_sar: number
          contract_id: string
          created_at: string | null
          due_date: string
          id: string
          installment_no: number
          method: Database["public"]["Enums"]["finance_payment_method"] | null
          paid_at: string | null
          reference: string | null
          status: Database["public"]["Enums"]["finance_payment_status"]
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_sar: number
          contract_id: string
          created_at?: string | null
          due_date: string
          id?: string
          installment_no: number
          method?: Database["public"]["Enums"]["finance_payment_method"] | null
          paid_at?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["finance_payment_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_sar?: number
          contract_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          installment_no?: number
          method?: Database["public"]["Enums"]["finance_payment_method"] | null
          paid_at?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["finance_payment_status"]
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "finance_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_profiles: {
        Row: {
          available_limit_sar: number | null
          created_at: string | null
          credit_limit_sar: number | null
          entity_id: string
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_score: number | null
          last_score_at: string | null
          notes_admin: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          available_limit_sar?: number | null
          created_at?: string | null
          credit_limit_sar?: number | null
          entity_id: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_score?: number | null
          last_score_at?: string | null
          notes_admin?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available_limit_sar?: number | null
          created_at?: string | null
          credit_limit_sar?: number | null
          entity_id?: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_score?: number | null
          last_score_at?: string | null
          notes_admin?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_user_id: string
          description: string | null
          description_ar: string | null
          id: string
          idempotency_key: string | null
          journal_entry_id: string | null
          metadata: Json | null
          processed_at: string | null
          provider: string | null
          provider_reference: string | null
          provider_response: Json | null
          related_invoice_id: string | null
          related_order_id: string | null
          search_vector: unknown
          status:
            | Database["public"]["Enums"]["financial_transaction_status"]
            | null
          tenant_id: string | null
          transaction_type: Database["public"]["Enums"]["financial_transaction_type"]
          updated_at: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_user_id: string
          description?: string | null
          description_ar?: string | null
          id?: string
          idempotency_key?: string | null
          journal_entry_id?: string | null
          metadata?: Json | null
          processed_at?: string | null
          provider?: string | null
          provider_reference?: string | null
          provider_response?: Json | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          search_vector?: unknown
          status?:
            | Database["public"]["Enums"]["financial_transaction_status"]
            | null
          tenant_id?: string | null
          transaction_type: Database["public"]["Enums"]["financial_transaction_type"]
          updated_at?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_user_id?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          idempotency_key?: string | null
          journal_entry_id?: string | null
          metadata?: Json | null
          processed_at?: string | null
          provider?: string | null
          provider_reference?: string | null
          provider_response?: Json | null
          related_invoice_id?: string | null
          related_order_id?: string | null
          search_vector?: unknown
          status?:
            | Database["public"]["Enums"]["financial_transaction_status"]
            | null
          tenant_id?: string | null
          transaction_type?: Database["public"]["Enums"]["financial_transaction_type"]
          updated_at?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_related_invoice_id_fkey"
            columns: ["related_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "customer_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          integration_id: string
          message: string | null
          metadata: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          integration_id: string
          message?: string | null
          metadata?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          integration_id?: string
          message?: string | null
          metadata?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key: string | null
          api_secret: string | null
          created_at: string
          created_by: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          is_connected: boolean | null
          last_error: string | null
          last_sync_at: string | null
          name_ar: string
          name_en: string
          provider: string
          settings: Json | null
          tenant_id: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          is_connected?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          name_ar: string
          name_en: string
          provider: string
          settings?: Json | null
          tenant_id?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          name_ar?: string
          name_en?: string
          provider?: string
          settings?: Json | null
          tenant_id?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          customer_id: string
          due_date: string | null
          id: string
          invoice_number: string
          metadata: Json | null
          notes: string | null
          order_id: string
          paid_at: string | null
          payment_url: string | null
          pdf_url: string | null
          provider: string | null
          provider_invoice_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tenant_id: string | null
          total: number
          updated_at: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id: string
          due_date?: string | null
          id?: string
          invoice_number: string
          metadata?: Json | null
          notes?: string | null
          order_id: string
          paid_at?: string | null
          payment_url?: string | null
          pdf_url?: string | null
          provider?: string | null
          provider_invoice_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tenant_id?: string | null
          total?: number
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string
          paid_at?: string | null
          payment_url?: string | null
          pdf_url?: string | null
          provider?: string | null
          provider_invoice_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tenant_id?: string | null
          total?: number
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_number: string | null
          city: string | null
          cover_letter: string | null
          created_at: string | null
          cv_file_name: string | null
          cv_url: string | null
          education: string | null
          email: string
          experience: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          notes: string | null
          phone: string
          portfolio_url: string | null
          position: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          application_number?: string | null
          city?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_file_name?: string | null
          cv_url?: string | null
          education?: string | null
          email: string
          experience?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          phone: string
          portfolio_url?: string | null
          position: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          application_number?: string | null
          city?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_file_name?: string | null
          cv_url?: string | null
          education?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string
          portfolio_url?: string | null
          position?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          description_ar: string | null
          entry_number: string
          id: string
          is_posted: boolean | null
          posted_at: string | null
          reference_id: string | null
          reference_type: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          entry_number: string
          id?: string
          is_posted?: boolean | null
          posted_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          entry_number?: string
          id?: string
          is_posted?: boolean | null
          posted_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_lines: {
        Row: {
          account_id: string
          created_at: string | null
          credit: number | null
          currency: string | null
          debit: number | null
          description: string | null
          entry_id: string
          id: string
          metadata: Json | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          credit?: number | null
          currency?: string | null
          debit?: number | null
          description?: string | null
          entry_id: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          credit?: number | null
          currency?: string | null
          debit?: number | null
          description?: string | null
          entry_id?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_accounts: {
        Row: {
          account_type: Database["public"]["Enums"]["ledger_account_type"]
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name_ar: string
          name_en: string
          parent_id: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_type: Database["public"]["Enums"]["ledger_account_type"]
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name_ar: string
          name_en: string
          parent_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["ledger_account_type"]
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          alt_text_ar: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          tenant_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          alt_text_ar?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          alt_text_ar?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          items: Json | null
          location: string
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          location: string
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          location?: string
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      nafath_identities: {
        Row: {
          created_at: string
          id: string
          nafath_sub: string
          national_id: string
          raw_claims_json: Json | null
          tenant_id: string | null
          user_id: string | null
          verified_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nafath_sub: string
          national_id: string
          raw_claims_json?: Json | null
          tenant_id?: string | null
          user_id?: string | null
          verified_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nafath_sub?: string
          national_id?: string
          raw_claims_json?: Json | null
          tenant_id?: string | null
          user_id?: string | null
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nafath_identities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      nafath_states: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          state_token: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          state_token: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          state_token?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body_ar: string | null
          body_en: string | null
          created_at: string | null
          id: string
          idempotency_key: string | null
          is_read: boolean | null
          link: string | null
          message: string | null
          message_ar: string | null
          metadata: Json | null
          read_at: string | null
          role_target:
            | Database["public"]["Enums"]["notification_role_target"]
            | null
          scheduled_for: string | null
          severity: Database["public"]["Enums"]["notification_severity"] | null
          source_id: string | null
          source_type: string | null
          tenant_id: string | null
          title: string
          title_ar: string | null
          title_en: string | null
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          body_ar?: string | null
          body_en?: string | null
          created_at?: string | null
          id?: string
          idempotency_key?: string | null
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          message_ar?: string | null
          metadata?: Json | null
          read_at?: string | null
          role_target?:
            | Database["public"]["Enums"]["notification_role_target"]
            | null
          scheduled_for?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"] | null
          source_id?: string | null
          source_type?: string | null
          tenant_id?: string | null
          title: string
          title_ar?: string | null
          title_en?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          body_ar?: string | null
          body_en?: string | null
          created_at?: string | null
          id?: string
          idempotency_key?: string | null
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          message_ar?: string | null
          metadata?: Json | null
          read_at?: string | null
          role_target?:
            | Database["public"]["Enums"]["notification_role_target"]
            | null
          scheduled_for?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"] | null
          source_id?: string | null
          source_type?: string | null
          tenant_id?: string | null
          title?: string
          title_ar?: string | null
          title_en?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          order_id: string
          performed_by: string | null
          previous_value: Json | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          order_id: string
          performed_by?: string | null
          previous_value?: Json | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          order_id?: string
          performed_by?: string | null
          previous_value?: Json | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          contract_id: string | null
          contract_pre_approved: boolean | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          notes: Json | null
          order_number: string
          priority: number | null
          requires_contract: boolean | null
          service_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          tenant_id: string | null
          title: string
          title_ar: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          contract_id?: string | null
          contract_pre_approved?: boolean | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: Json | null
          order_number: string
          priority?: number | null
          requires_contract?: boolean | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tenant_id?: string | null
          title: string
          title_ar?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          contract_id?: string | null
          contract_pre_approved?: boolean | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: Json | null
          order_number?: string
          priority?: number | null
          requires_contract?: boolean | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tenant_id?: string | null
          title?: string
          title_ar?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          page_id: string
          section_type: string
          sort_order: number | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          page_id: string
          section_type: string
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          page_id?: string
          section_type?: string
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          tenant_id: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          tenant_id?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          tenant_id?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          is_enabled: boolean | null
          label_ar: string
          label_en: string
          metadata: Json | null
          tenant_id: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          label_ar: string
          label_en: string
          metadata?: Json | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          label_ar?: string
          label_en?: string
          metadata?: Json | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
          name_ar: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
          name_ar?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
          name_ar?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          customer_uid: string | null
          email: string
          full_name: string | null
          full_name_ar: string | null
          id: string
          is_active: boolean | null
          is_kyc_verified: boolean | null
          kyc_provider: string | null
          kyc_verified_at: string | null
          last_login_at: string | null
          metadata: Json | null
          national_id: string | null
          phone: string | null
          preferred_language: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          customer_uid?: string | null
          email: string
          full_name?: string | null
          full_name_ar?: string | null
          id: string
          is_active?: boolean | null
          is_kyc_verified?: boolean | null
          kyc_provider?: string | null
          kyc_verified_at?: string | null
          last_login_at?: string | null
          metadata?: Json | null
          national_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          customer_uid?: string | null
          email?: string
          full_name?: string | null
          full_name_ar?: string | null
          id?: string
          is_active?: boolean | null
          is_kyc_verified?: boolean | null
          kyc_provider?: string | null
          kyc_verified_at?: string | null
          last_login_at?: string | null
          metadata?: Json | null
          national_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_events: {
        Row: {
          actor: string
          actor_user_id: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_status: string
          old_status: string | null
          referral_id: string
          tenant_id: string | null
        }
        Insert: {
          actor?: string
          actor_user_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_status: string
          old_status?: string | null
          referral_id: string
          tenant_id?: string | null
        }
        Update: {
          actor?: string
          actor_user_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_status?: string
          old_status?: string | null
          referral_id?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payout_status: string
          referral_id: string
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_status?: string
          referral_id: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_status?: string
          referral_id?: string
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_settings: {
        Row: {
          cooldown_hours: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_referrals_per_ip: number | null
          max_referrals_per_user: number | null
          min_conversion_status: string | null
          reward_amount_per_referral: number | null
          reward_currency: string | null
          tenant_id: string | null
          terms_ar: string | null
          terms_en: string | null
          updated_at: string | null
        }
        Insert: {
          cooldown_hours?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_referrals_per_ip?: number | null
          max_referrals_per_user?: number | null
          min_conversion_status?: string | null
          reward_amount_per_referral?: number | null
          reward_currency?: string | null
          tenant_id?: string | null
          terms_ar?: string | null
          terms_en?: string | null
          updated_at?: string | null
        }
        Update: {
          cooldown_hours?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_referrals_per_ip?: number | null
          max_referrals_per_user?: number | null
          min_conversion_status?: string | null
          reward_amount_per_referral?: number | null
          reward_currency?: string | null
          tenant_id?: string | null
          terms_ar?: string | null
          terms_en?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          fraud_flags: Json | null
          id: string
          ip_address: unknown
          metadata: Json | null
          referral_code: string
          referral_link: string
          referred_email: string | null
          referred_name: string | null
          referred_phone: string | null
          referred_user_id: string | null
          referrer_user_id: string
          reward_amount: number | null
          reward_currency: string | null
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          fraud_flags?: Json | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          referral_code: string
          referral_link: string
          referred_email?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referred_user_id?: string | null
          referrer_user_id: string
          reward_amount?: number | null
          reward_currency?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          fraud_flags?: Json | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          referral_code?: string
          referral_link?: string
          referred_email?: string | null
          referred_name?: string | null
          referred_phone?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_amount?: number | null
          reward_currency?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
        }
        Insert: {
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
        }
        Update: {
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          default_contract_template_id: string | null
          description: string | null
          description_ar: string | null
          icon: string | null
          id: string
          image_url: string | null
          include_vat: boolean | null
          is_active: boolean | null
          is_visible_to_customers: boolean | null
          metadata: Json | null
          name: string
          name_ar: string | null
          price: number | null
          short_description: string | null
          short_description_ar: string | null
          sort_order: number | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          default_contract_template_id?: string | null
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          include_vat?: boolean | null
          is_active?: boolean | null
          is_visible_to_customers?: boolean | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          price?: number | null
          short_description?: string | null
          short_description_ar?: string | null
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          default_contract_template_id?: string | null
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          include_vat?: boolean | null
          is_active?: boolean | null
          is_visible_to_customers?: boolean | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          price?: number | null
          short_description?: string | null
          short_description_ar?: string | null
          sort_order?: number | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_default_contract_template_id_fkey"
            columns: ["default_contract_template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_content: string | null
          message_type: string
          phone: string
          provider: string
          provider_response: Json | null
          retry_count: number
          sent_at: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_content?: string | null
          message_type: string
          phone: string
          provider?: string
          provider_response?: Json | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_content?: string | null
          message_type?: string
          phone?: string
          provider?: string
          provider_response?: Json | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_otp_codes: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          max_attempts: number
          otp_hash: string
          phone: string
          purpose: string
          tenant_id: string | null
          updated_at: string
          user_agent: string | null
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown
          max_attempts?: number
          otp_hash: string
          phone: string
          purpose?: string
          tenant_id?: string | null
          updated_at?: string
          user_agent?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          max_attempts?: number
          otp_hash?: string
          phone?: string
          purpose?: string
          tenant_id?: string | null
          updated_at?: string
          user_agent?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_otp_codes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          settings: Json
          tenant_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          settings?: Json
          tenant_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          settings?: Json
          tenant_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          name_ar: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          name_ar?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          name_ar?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          messages: Json | null
          priority: string | null
          status: string | null
          subject: string
          subject_ar: string | null
          tenant_id: string | null
          ticket_number: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          messages?: Json | null
          priority?: string | null
          status?: string | null
          subject: string
          subject_ar?: string | null
          tenant_id?: string | null
          ticket_number: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          messages?: Json | null
          priority?: string | null
          status?: string | null
          subject?: string
          subject_ar?: string | null
          tenant_id?: string | null
          ticket_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_status: string | null
          performed_by: string | null
          previous_status: string | null
          provider_payload: Json | null
          transaction_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_status?: string | null
          performed_by?: string | null
          previous_status?: string | null
          provider_payload?: Json | null
          transaction_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_status?: string | null
          performed_by?: string | null
          previous_status?: string | null
          provider_payload?: Json | null
          transaction_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_devices: {
        Row: {
          browser: string | null
          created_at: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: unknown
          is_current: boolean | null
          is_trusted: boolean | null
          last_used_at: string | null
          location: string | null
          os: string | null
          tenant_id: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_current?: boolean | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location?: string | null
          os?: string | null
          tenant_id?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_current?: boolean | null
          is_trusted?: boolean | null
          last_used_at?: string | null
          location?: string | null
          os?: string | null
          tenant_id?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trusted_devices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_verified_at: string | null
          method: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          method?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          method?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_contract: {
        Args: {
          p_admin_id: string
          p_contract_id: string
          p_modified_pricing?: Json
          p_notes?: string
        }
        Returns: boolean
      }
      admin_reject_contract: {
        Args: { p_admin_id: string; p_contract_id: string; p_reason: string }
        Returns: boolean
      }
      approve_finance_contract_with_wallet_credit: {
        Args: { p_admin_id: string; p_contract_id: string; p_notes?: string }
        Returns: Json
      }
      cleanup_expired_nafath_states: { Args: never; Returns: undefined }
      cleanup_expired_otps: { Args: never; Returns: undefined }
      create_pre_approved_contract: {
        Args: {
          p_customer_id: string
          p_ip_address?: unknown
          p_order_id?: string
          p_service_id: string
          p_tenant_id?: string
          p_user_agent?: string
        }
        Returns: string
      }
      create_proactive_notification: {
        Args: {
          p_body_ar?: string
          p_body_en?: string
          p_idempotency_key?: string
          p_link?: string
          p_role_target: Database["public"]["Enums"]["notification_role_target"]
          p_scheduled_for?: string
          p_severity: Database["public"]["Enums"]["notification_severity"]
          p_source_id?: string
          p_source_type?: string
          p_tenant_id: string
          p_title_ar: string
          p_title_en: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_user_id: string
        }
        Returns: string
      }
      generate_bank_transfer_reference: { Args: never; Returns: string }
      generate_contract_number: {
        Args: { p_tenant_id?: string }
        Returns: string
      }
      generate_device_verification_code: {
        Args: { p_device_fingerprint: string; p_user_id: string }
        Returns: string
      }
      generate_finance_application_number: {
        Args: { p_tenant_id?: string }
        Returns: string
      }
      generate_finance_contract_number: {
        Args: { p_tenant_id?: string }
        Returns: string
      }
      generate_finance_installments: {
        Args: {
          p_amount_sar: number
          p_contract_id: string
          p_start_date?: string
          p_tenor_months: number
        }
        Returns: undefined
      }
      generate_invoice_number: {
        Args: { p_tenant_id?: string }
        Returns: string
      }
      generate_journal_entry_number: {
        Args: { p_tenant_id?: string }
        Returns: string
      }
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      get_customer_wallet: { Args: { p_customer_id: string }; Returns: string }
      get_delayed_orders: {
        Args: { p_hours_threshold?: number }
        Returns: {
          customer_id: string
          hours_since_update: number
          last_updated: string
          order_id: string
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          tenant_id: string
        }[]
      }
      get_entity_finance_summary: {
        Args: { p_entity_id: string }
        Returns: Json
      }
      get_expiring_contracts: {
        Args: { p_days_threshold?: number }
        Returns: {
          contract_id: string
          contract_number: string
          created_at: string
          customer_user_id: string
          status: Database["public"]["Enums"]["contract_status"]
          tenant_id: string
        }[]
      }
      get_invoices_needing_reminders: {
        Args: never
        Returns: {
          customer_id: string
          due_date: string
          hours_until_due: number
          invoice_id: string
          invoice_number: string
          tenant_id: string
          total: number
        }[]
      }
      get_next_service_sort_order: {
        Args: { p_tenant_id?: string }
        Returns: number
      }
      get_services_by_category: {
        Args: { p_include_inactive?: boolean; p_tenant_id?: string }
        Returns: {
          category: string
          services: Json
        }[]
      }
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      get_wallet_balance: { Args: { p_wallet_id: string }; Returns: number }
      get_wallets_with_low_balance: {
        Args: { p_threshold?: number }
        Returns: {
          balance: number
          currency: string
          customer_user_id: string
          tenant_id: string
          wallet_id: string
        }[]
      }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id?: string
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _tenant_id?: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      log_finance_audit: {
        Args: {
          p_action: string
          p_actor_user_id: string
          p_entity_id: string
          p_entity_type: string
          p_metadata?: Json
          p_tenant_id?: string
        }
        Returns: string
      }
      log_transaction_event: {
        Args: {
          p_event_type: string
          p_metadata?: Json
          p_new_status?: string
          p_performed_by?: string
          p_previous_status?: string
          p_provider_payload?: Json
          p_transaction_id: string
        }
        Returns: string
      }
      pay_invoice_from_wallet: {
        Args: { p_customer_id: string; p_invoice_id: string }
        Returns: Json
      }
      process_bank_transfer_approval: {
        Args: { p_notes?: string; p_reviewer_id: string; p_transfer_id: string }
        Returns: Json
      }
      service_requires_contract: {
        Args: { p_service_id: string }
        Returns: boolean
      }
      update_referral_status: {
        Args: {
          p_actor?: string
          p_actor_user_id?: string
          p_metadata?: Json
          p_new_status: string
          p_referral_id: string
        }
        Returns: {
          created_at: string | null
          device_fingerprint: string | null
          fraud_flags: Json | null
          id: string
          ip_address: unknown
          metadata: Json | null
          referral_code: string
          referral_link: string
          referred_email: string | null
          referred_name: string | null
          referred_phone: string | null
          referred_user_id: string | null
          referrer_user_id: string
          reward_amount: number | null
          reward_currency: string | null
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "referrals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_services_sort_order: {
        Args: { p_service_orders: Json }
        Returns: boolean
      }
      validate_transaction_status_transition: {
        Args: {
          p_current_status: string
          p_new_status: string
          p_transaction_type: string
        }
        Returns: boolean
      }
      verify_device_code: {
        Args: {
          p_code: string
          p_device_fingerprint: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "staff"
        | "customer"
        | "support"
        | "finance"
        | "content_editor"
      audit_action:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "export"
      contract_status:
        | "draft"
        | "pre_approved_by_customer"
        | "pending_admin_approval"
        | "pending_signature"
        | "signed"
        | "cancelled"
      entity_member_role:
        | "owner"
        | "admin"
        | "finance_manager"
        | "signer"
        | "viewer"
      entity_status: "active" | "suspended"
      entity_type: "individual" | "company" | "institution"
      finance_application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "needs_info"
      finance_contract_status:
        | "generated"
        | "signed_by_customer"
        | "approved_by_admin"
        | "active"
        | "closed"
        | "canceled"
      finance_doc_status: "uploaded" | "approved" | "rejected"
      finance_doc_type:
        | "individual_id"
        | "salary_proof"
        | "bank_statement"
        | "company_cr"
        | "institution_license"
        | "authorization_letter"
        | "board_resolution"
        | "iban_certificate"
        | "other"
      finance_offer_status: "active" | "selected" | "expired"
      finance_payment_method: "mada" | "visa" | "bank_transfer" | "wallet"
      finance_payment_status: "scheduled" | "paid" | "overdue" | "failed"
      financial_transaction_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "refunded"
        | "cancelled"
      financial_transaction_type:
        | "invoice_payment"
        | "refund"
        | "topup"
        | "withdrawal"
        | "adjustment"
        | "transfer"
        | "fee"
      invoice_status: "draft" | "issued" | "paid" | "cancelled" | "overdue"
      kyc_status: "not_started" | "pending" | "verified" | "rejected"
      ledger_account_type:
        | "asset"
        | "liability"
        | "revenue"
        | "expense"
        | "equity"
      notification_role_target: "admin" | "customer" | "all"
      notification_severity: "info" | "warning" | "critical"
      notification_type:
        | "info"
        | "warning"
        | "success"
        | "error"
        | "system"
        | "invoice_due"
        | "payment_failed"
        | "low_wallet_balance"
        | "order_status_changed"
        | "order_delayed"
        | "contract_pending_signature"
        | "contract_signed"
        | "contract_expired"
        | "admin_message"
      order_status:
        | "pending"
        | "processing"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "refunded"
      risk_level: "low" | "medium" | "high"
      signature_method: "checkbox" | "drawn" | "nafath_verified"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "super_admin",
        "admin",
        "manager",
        "staff",
        "customer",
        "support",
        "finance",
        "content_editor",
      ],
      audit_action: [
        "create",
        "read",
        "update",
        "delete",
        "login",
        "logout",
        "export",
      ],
      contract_status: [
        "draft",
        "pre_approved_by_customer",
        "pending_admin_approval",
        "pending_signature",
        "signed",
        "cancelled",
      ],
      entity_member_role: [
        "owner",
        "admin",
        "finance_manager",
        "signer",
        "viewer",
      ],
      entity_status: ["active", "suspended"],
      entity_type: ["individual", "company", "institution"],
      finance_application_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "needs_info",
      ],
      finance_contract_status: [
        "generated",
        "signed_by_customer",
        "approved_by_admin",
        "active",
        "closed",
        "canceled",
      ],
      finance_doc_status: ["uploaded", "approved", "rejected"],
      finance_doc_type: [
        "individual_id",
        "salary_proof",
        "bank_statement",
        "company_cr",
        "institution_license",
        "authorization_letter",
        "board_resolution",
        "iban_certificate",
        "other",
      ],
      finance_offer_status: ["active", "selected", "expired"],
      finance_payment_method: ["mada", "visa", "bank_transfer", "wallet"],
      finance_payment_status: ["scheduled", "paid", "overdue", "failed"],
      financial_transaction_status: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "refunded",
        "cancelled",
      ],
      financial_transaction_type: [
        "invoice_payment",
        "refund",
        "topup",
        "withdrawal",
        "adjustment",
        "transfer",
        "fee",
      ],
      invoice_status: ["draft", "issued", "paid", "cancelled", "overdue"],
      kyc_status: ["not_started", "pending", "verified", "rejected"],
      ledger_account_type: [
        "asset",
        "liability",
        "revenue",
        "expense",
        "equity",
      ],
      notification_role_target: ["admin", "customer", "all"],
      notification_severity: ["info", "warning", "critical"],
      notification_type: [
        "info",
        "warning",
        "success",
        "error",
        "system",
        "invoice_due",
        "payment_failed",
        "low_wallet_balance",
        "order_status_changed",
        "order_delayed",
        "contract_pending_signature",
        "contract_signed",
        "contract_expired",
        "admin_message",
      ],
      order_status: [
        "pending",
        "processing",
        "in_progress",
        "completed",
        "cancelled",
        "refunded",
      ],
      risk_level: ["low", "medium", "high"],
      signature_method: ["checkbox", "drawn", "nafath_verified"],
    },
  },
} as const
