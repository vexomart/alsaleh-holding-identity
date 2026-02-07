/**
 * SMS Notifications Hook
 * Unified SMS notification system for all events (orders, contracts, finance, payments)
 */

import { supabase } from "@/integrations/supabase/client";

// Message types matching the edge function
type SmsMessageType =
  // Welcome & Registration
  | "welcome" | "registration_complete" | "otp_sent"
  // Orders
  | "order_created" | "order_confirmed" | "order_processing" | "order_completed" | "order_cancelled"
  // Contracts
  | "contract_created" | "contract_approved" | "contract_rejected" | "contract_pending_signature"
  | "contract_signed" | "contract_active" | "contract_expired"
  // Finance - Eligibility
  | "finance_eligibility_checking" | "finance_eligibility_approved" | "finance_eligibility_rejected"
  | "finance_documents_required" | "finance_scoring_started" | "finance_scoring_complete"
  // Finance - Application
  | "finance_submitted" | "finance_under_review" | "finance_approved" | "finance_rejected"
  | "finance_offer_ready" | "finance_offer_created" | "finance_offer_selected" | "finance_offer_expired"
  // Finance - Contract
  | "finance_contract_ready" | "finance_contract_signed" | "finance_disbursed"
  // Finance - Payments
  | "finance_payment_due" | "finance_payment_reminder" | "finance_payment_received" | "finance_payment_overdue"
  // Payments
  | "payment_success" | "payment_failed" | "wallet_topup" | "wallet_withdrawal"
  // General
  | "order_status" | "account_update" | "custom";

interface SmsResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function useSmsNotifications() {
  /**
   * Send SMS notification
   */
  const sendSms = async (
    phone: string,
    messageType: SmsMessageType,
    templateData?: Record<string, string>,
    customMessage?: string
  ): Promise<SmsResult> => {
    try {
      if (!phone) {
        console.warn("SMS notification skipped: no phone number");
        return { success: false, error: "No phone number provided" };
      }

      const { data, error } = await supabase.functions.invoke("sms-send-notification", {
        body: {
          phone,
          message_type: messageType,
          template_data: templateData,
          custom_message: customMessage,
        },
      });

      if (error) {
        console.error("SMS notification error:", error);
        return { success: false, error: error.message };
      }

      return data as SmsResult;
    } catch (err: any) {
      console.error("SMS notification failed:", err);
      return { success: false, error: err.message };
    }
  };

  // ===== Order Notifications =====

  const notifyWelcome = async (phone: string, name: string) => {
    return sendSms(phone, "welcome", { name });
  };

  const notifyRegistrationComplete = async (phone: string, name: string) => {
    return sendSms(phone, "registration_complete", { name });
  };

  const notifyOrderCreated = async (phone: string, orderNumber: string) => {
    return sendSms(phone, "order_created", { order_number: orderNumber });
  };

  const notifyOrderConfirmed = async (phone: string, orderNumber: string, amount: number) => {
    return sendSms(phone, "order_confirmed", {
      order_number: orderNumber,
      amount: amount.toLocaleString("ar-SA"),
    });
  };

  const notifyOrderProcessing = async (phone: string, orderNumber: string) => {
    return sendSms(phone, "order_processing", { order_number: orderNumber });
  };

  const notifyOrderCompleted = async (phone: string, orderNumber: string) => {
    return sendSms(phone, "order_completed", { order_number: orderNumber });
  };

  const notifyOrderCancelled = async (phone: string, orderNumber: string) => {
    return sendSms(phone, "order_cancelled", { order_number: orderNumber });
  };

  const notifyOrderStatus = async (phone: string, orderNumber: string, status: string) => {
    return sendSms(phone, "order_status", {
      order_number: orderNumber,
      status: status,
    });
  };

  // ===== Contract Notifications =====

  const notifyContractCreated = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_created", { contract_number: contractNumber });
  };

  const notifyContractApproved = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_approved", { contract_number: contractNumber });
  };

  const notifyContractRejected = async (phone: string, contractNumber: string, reason: string) => {
    return sendSms(phone, "contract_rejected", {
      contract_number: contractNumber,
      reason: reason,
    });
  };

  const notifyContractPendingSignature = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_pending_signature", { contract_number: contractNumber });
  };

  const notifyContractSigned = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_signed", { contract_number: contractNumber });
  };

  const notifyContractActive = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_active", { contract_number: contractNumber });
  };

  const notifyContractExpired = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "contract_expired", { contract_number: contractNumber });
  };

  // ===== Finance - Eligibility Notifications =====

  const notifyFinanceEligibilityChecking = async (phone: string, name: string) => {
    return sendSms(phone, "finance_eligibility_checking", { name });
  };

  const notifyFinanceEligibilityApproved = async (
    phone: string,
    name: string,
    creditLimit: number
  ) => {
    return sendSms(phone, "finance_eligibility_approved", {
      name,
      credit_limit: creditLimit.toLocaleString("ar-SA"),
    });
  };

  const notifyFinanceEligibilityRejected = async (
    phone: string,
    name: string,
    reason: string
  ) => {
    return sendSms(phone, "finance_eligibility_rejected", { name, reason });
  };

  const notifyFinanceDocumentsRequired = async (
    phone: string,
    applicationNumber: string,
    documents: string
  ) => {
    return sendSms(phone, "finance_documents_required", {
      application_number: applicationNumber,
      documents,
    });
  };

  const notifyFinanceScoringStarted = async (phone: string, applicationNumber: string) => {
    return sendSms(phone, "finance_scoring_started", { application_number: applicationNumber });
  };

  const notifyFinanceScoringComplete = async (
    phone: string,
    applicationNumber: string,
    riskLevel: string
  ) => {
    return sendSms(phone, "finance_scoring_complete", {
      application_number: applicationNumber,
      risk_level: riskLevel,
    });
  };

  // ===== Finance - Application Notifications =====

  const notifyFinanceSubmitted = async (phone: string, applicationNumber: string, amount: number) => {
    return sendSms(phone, "finance_submitted", {
      application_number: applicationNumber,
      amount: amount.toLocaleString("ar-SA"),
    });
  };

  const notifyFinanceUnderReview = async (phone: string, applicationNumber: string) => {
    return sendSms(phone, "finance_under_review", { application_number: applicationNumber });
  };

  const notifyFinanceApproved = async (
    phone: string,
    applicationNumber: string,
    amount: number,
    monthlyPayment: number
  ) => {
    return sendSms(phone, "finance_approved", {
      application_number: applicationNumber,
      amount: amount.toLocaleString("ar-SA"),
      monthly: monthlyPayment.toLocaleString("ar-SA"),
    });
  };

  const notifyFinanceRejected = async (phone: string, applicationNumber: string, reason?: string) => {
    return sendSms(phone, "finance_rejected", {
      application_number: applicationNumber,
      reason: reason || "لم يتم استيفاء الشروط",
    });
  };

  const notifyFinanceOfferReady = async (phone: string, applicationNumber: string, offersCount: number) => {
    return sendSms(phone, "finance_offer_ready", {
      application_number: applicationNumber,
      offers_count: offersCount.toString(),
    });
  };

  const notifyFinanceOfferSelected = async (
    phone: string,
    applicationNumber: string,
    amount: number,
    monthlyPayment: number,
    tenor: number
  ) => {
    return sendSms(phone, "finance_offer_selected", {
      application_number: applicationNumber,
      amount: amount.toLocaleString("ar-SA"),
      monthly: monthlyPayment.toLocaleString("ar-SA"),
      tenor: tenor.toString(),
    });
  };

  const notifyFinanceOfferExpired = async (phone: string, applicationNumber: string) => {
    return sendSms(phone, "finance_offer_expired", { application_number: applicationNumber });
  };

  const notifyFinanceOfferCreated = async (
    phone: string,
    applicationNumber: string,
    amount: number,
    tenor: number,
    monthlyPayment: number,
    apr: number,
    totalPayable: number,
    fees: number,
    expiresAt: string
  ) => {
    return sendSms(phone, "finance_offer_created", {
      application_number: applicationNumber,
      amount: amount.toLocaleString("ar-SA"),
      tenor: tenor.toString(),
      monthly: monthlyPayment.toLocaleString("ar-SA"),
      apr: apr.toString(),
      total: totalPayable.toLocaleString("ar-SA"),
      fees: fees.toLocaleString("ar-SA"),
      expires_at: expiresAt,
    });
  };

  // ===== Finance - Contract Notifications =====

  const notifyFinanceContractReady = async (
    phone: string,
    contractNumber: string,
    amount: number
  ) => {
    return sendSms(phone, "finance_contract_ready", {
      contract_number: contractNumber,
      amount: amount.toLocaleString("ar-SA"),
    });
  };

  const notifyFinanceContractSigned = async (phone: string, contractNumber: string) => {
    return sendSms(phone, "finance_contract_signed", { contract_number: contractNumber });
  };

  const notifyFinanceDisbursed = async (
    phone: string,
    amount: number,
    contractNumber: string
  ) => {
    return sendSms(phone, "finance_disbursed", {
      amount: amount.toLocaleString("ar-SA"),
      contract_number: contractNumber,
    });
  };

  // ===== Finance - Payment Notifications =====

  const notifyFinancePaymentDue = async (
    phone: string,
    installmentNo: number,
    amount: number,
    dueDate: string,
    contractNumber: string
  ) => {
    return sendSms(phone, "finance_payment_due", {
      installment: installmentNo.toString(),
      amount: amount.toLocaleString("ar-SA"),
      due_date: dueDate,
      contract_number: contractNumber,
    });
  };

  const notifyFinancePaymentReminder = async (
    phone: string,
    installmentNo: number,
    amount: number
  ) => {
    return sendSms(phone, "finance_payment_reminder", {
      installment: installmentNo.toString(),
      amount: amount.toLocaleString("ar-SA"),
    });
  };

  const notifyFinancePaymentReceived = async (
    phone: string,
    installmentNo: number,
    amount: number,
    remainingInstallments: number
  ) => {
    return sendSms(phone, "finance_payment_received", {
      installment: installmentNo.toString(),
      amount: amount.toLocaleString("ar-SA"),
      remaining: remainingInstallments.toString(),
    });
  };

  const notifyFinancePaymentOverdue = async (
    phone: string,
    installmentNo: number,
    amount: number
  ) => {
    return sendSms(phone, "finance_payment_overdue", {
      installment: installmentNo.toString(),
      amount: amount.toLocaleString("ar-SA"),
    });
  };

  // ===== Payment Notifications =====

  const notifyPaymentSuccess = async (
    phone: string,
    amount: number,
    transactionId: string
  ) => {
    return sendSms(phone, "payment_success", {
      amount: amount.toLocaleString("ar-SA"),
      transaction_id: transactionId,
    });
  };

  const notifyPaymentFailed = async (phone: string) => {
    return sendSms(phone, "payment_failed", {});
  };

  const notifyWalletTopup = async (phone: string, amount: number, newBalance: number) => {
    return sendSms(phone, "wallet_topup", {
      amount: amount.toLocaleString("ar-SA"),
      balance: newBalance.toLocaleString("ar-SA"),
    });
  };

  const notifyWalletWithdrawal = async (phone: string, amount: number, remainingBalance: number) => {
    return sendSms(phone, "wallet_withdrawal", {
      amount: amount.toLocaleString("ar-SA"),
      balance: remainingBalance.toLocaleString("ar-SA"),
    });
  };

  // ===== General Notifications =====

  const notifyAccountUpdate = async (phone: string) => {
    return sendSms(phone, "account_update", {});
  };

  const sendCustomSms = async (phone: string, message: string) => {
    return sendSms(phone, "custom", undefined, message);
  };

  return {
    // Core function
    sendSms,

    // Welcome & Registration
    notifyWelcome,
    notifyRegistrationComplete,

    // Orders
    notifyOrderCreated,
    notifyOrderConfirmed,
    notifyOrderProcessing,
    notifyOrderCompleted,
    notifyOrderCancelled,
    notifyOrderStatus,

    // Contracts
    notifyContractCreated,
    notifyContractApproved,
    notifyContractRejected,
    notifyContractPendingSignature,
    notifyContractSigned,
    notifyContractActive,
    notifyContractExpired,

    // Finance - Eligibility
    notifyFinanceEligibilityChecking,
    notifyFinanceEligibilityApproved,
    notifyFinanceEligibilityRejected,
    notifyFinanceDocumentsRequired,
    notifyFinanceScoringStarted,
    notifyFinanceScoringComplete,

    // Finance - Application
    notifyFinanceSubmitted,
    notifyFinanceUnderReview,
    notifyFinanceApproved,
    notifyFinanceRejected,
    notifyFinanceOfferReady,
    notifyFinanceOfferSelected,
    notifyFinanceOfferExpired,
    notifyFinanceOfferCreated,

    // Finance - Contract
    notifyFinanceContractReady,
    notifyFinanceContractSigned,
    notifyFinanceDisbursed,

    // Finance - Payment
    notifyFinancePaymentDue,
    notifyFinancePaymentReminder,
    notifyFinancePaymentReceived,
    notifyFinancePaymentOverdue,

    // Payments
    notifyPaymentSuccess,
    notifyPaymentFailed,
    notifyWalletTopup,
    notifyWalletWithdrawal,

    // General
    notifyAccountUpdate,
    sendCustomSms,
  };
}
