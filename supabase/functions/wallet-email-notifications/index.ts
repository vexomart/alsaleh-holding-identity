import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';

import { WalletDepositEmail } from './_templates/wallet-deposit.tsx';
import { WalletWithdrawalEmail } from './_templates/wallet-withdrawal.tsx';
import { BalanceAlertEmail } from './_templates/balance-alert.tsx';
import { TransactionSummaryEmail } from './_templates/transaction-summary.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WalletEmailRequest {
  type: 'deposit' | 'withdrawal' | 'balance_alert' | 'transaction_summary';
  customerName: string;
  customerEmail: string;
  amount?: number;
  currency: string;
  newBalance: number;
  transactionId?: string;
  walletNumber: string;
  alertThreshold?: number;
  topUpUrl?: string;
  period?: string;
  transactions?: Array<{
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    description: string;
  }>;
  totalDeposits?: number;
  totalWithdrawals?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: WalletEmailRequest = await req.json();
    const {
      type,
      customerName,
      customerEmail,
      amount,
      currency,
      newBalance,
      transactionId,
      walletNumber,
      alertThreshold,
      topUpUrl,
      period,
      transactions,
      totalDeposits,
      totalWithdrawals
    } = requestData;

    console.log(`📧 Processing ${type} email for ${customerName} (${customerEmail})`);

    // Validate required fields
    if (!customerName || !customerEmail || !currency || newBalance === undefined || !walletNumber) {
      throw new Error('Missing required fields: customerName, customerEmail, currency, newBalance, walletNumber');
    }

    if (!customerEmail.includes('@')) {
      throw new Error('Invalid email address format');
    }

    let emailSubject = '';
    let emailHtml = '';
    const currentDate = new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Riyadh'
    }).format(new Date());

    // Generate appropriate email based on type
    switch (type) {
      case 'deposit':
        if (!amount || !transactionId) {
          throw new Error('Amount and transaction ID required for deposit email');
        }
        
        emailSubject = `✅ تم إيداع ${amount.toLocaleString('ar-SA')} ${currency} في محفظتك الرقمية`;
        emailHtml = await renderAsync(
          React.createElement(WalletDepositEmail, {
            customerName,
            amount,
            currency,
            newBalance,
            transactionId,
            date: currentDate,
            walletNumber,
          })
        );
        break;

      case 'withdrawal':
        if (!amount || !transactionId) {
          throw new Error('Amount and transaction ID required for withdrawal email');
        }
        
        emailSubject = `⚠️ تم سحب ${amount.toLocaleString('ar-SA')} ${currency} من محفظتك الرقمية`;
        emailHtml = await renderAsync(
          React.createElement(WalletWithdrawalEmail, {
            customerName,
            amount,
            currency,
            newBalance,
            transactionId,
            date: currentDate,
            walletNumber,
          })
        );
        break;

      case 'balance_alert':
        if (!alertThreshold || !topUpUrl) {
          throw new Error('Alert threshold and top-up URL required for balance alert email');
        }
        
        emailSubject = `🚨 تنبيه: رصيد محفظتك منخفض - ${newBalance.toLocaleString('ar-SA')} ${currency}`;
        emailHtml = await renderAsync(
          React.createElement(BalanceAlertEmail, {
            customerName,
            currentBalance: newBalance,
            currency,
            walletNumber,
            alertThreshold,
            topUpUrl,
          })
        );
        break;

      case 'transaction_summary':
        if (!period || !transactions || totalDeposits === undefined || totalWithdrawals === undefined) {
          throw new Error('Period, transactions, totalDeposits, and totalWithdrawals required for summary email');
        }
        
        emailSubject = `📊 ملخص معاملات محفظتك الرقمية - ${period}`;
        emailHtml = await renderAsync(
          React.createElement(TransactionSummaryEmail, {
            customerName,
            walletNumber,
            currentBalance: newBalance,
            currency,
            period,
            transactions,
            totalDeposits,
            totalWithdrawals,
          })
        );
        break;

      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    // Determine sender name based on email type
    const senderName = type === 'balance_alert' 
      ? "تنبيهات المحفظة - علي الشهري القابضة" 
      : type === 'transaction_summary'
      ? "التقارير المالية - علي الشهري القابضة"
      : "المحفظة الرقمية - علي الشهري القابضة";

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: `${senderName} <wallet@alialshehriholding.com>`,
      to: [customerEmail],
      subject: emailSubject,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': transactionId || `${type}-${Date.now()}`,
        'X-Priority': type === 'balance_alert' ? '1' : type === 'withdrawal' ? '2' : '3',
        'X-Wallet-Number': walletNumber,
        'X-Email-Type': type,
      },
    });

    console.log(`✅ Email sent successfully to ${customerEmail}:`, emailResponse.data);

    // Log the email sending for audit purposes
    const logData = {
      timestamp: new Date().toISOString(),
      type,
      recipient: customerEmail,
      customerName,
      amount: amount || 0,
      newBalance,
      transactionId,
      walletNumber,
      emailId: emailResponse.data?.id,
      success: true,
      priority: type === 'balance_alert' ? 'high' : type === 'withdrawal' ? 'medium' : 'normal'
    };

    console.log(`📊 Email audit log:`, logData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        type,
        recipient: customerEmail,
        walletNumber,
        timestamp: new Date().toISOString(),
        message: `${type} email sent successfully to ${customerName}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("❌ Error in wallet-email-notifications function:", error);
    
    // Enhanced error logging
    const errorLog = {
      timestamp: new Date().toISOString(),
      functionName: 'wallet-email-notifications',
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      success: false,
      severity: 'error'
    };
    console.error(`📊 Error audit log:`, errorLog);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        details: "تحقق من سجلات الدالة للحصول على مزيد من المعلومات"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);