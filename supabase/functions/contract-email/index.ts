import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractEmailRequest {
  to: string;
  customerName?: string;
  contractNumber: string;
  pdfUrl: string;
  amount?: number | string;
  currency?: string;
  offerTitle?: string;
  paymentStatus?: 'paid' | 'pending' | 'failed';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContractEmailRequest = await req.json();
    const { to, customerName = 'عميلنا العزيز', contractNumber, pdfUrl, amount, currency = 'SAR', offerTitle, paymentStatus = 'paid' } = body;

    if (!to || !contractNumber || !pdfUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const statusBadgeColor = paymentStatus === 'paid' ? '#16a34a' : paymentStatus === 'pending' ? '#f59e0b' : '#dc2626';
    const statusLabel = paymentStatus === 'paid' ? 'مدفوع' : paymentStatus === 'pending' ? 'قيد المعالجة' : 'غير مدفوع';

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>عقد إلكتروني - ${contractNumber}</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; background: #f6f7fb; margin: 0; padding: 24px; }
          .container { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 28px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; }
          .badge { display: inline-block; margin-top: 10px; background: ${statusBadgeColor}; color: #fff; padding: 6px 12px; border-radius: 999px; font-size: 12px; }
          .content { padding: 28px; color: #0f172a; }
          .row { display: flex; flex-wrap: wrap; gap: 12px; margin: 10px 0 18px; }
          .card { flex: 1; min-width: 220px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
          .muted { color: #475569; }
          .btn { display: inline-block; background: #1e3a8a; color: white !important; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; }
          .footer { background: #f8fafc; padding: 18px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; }
          .small { font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>العقد الإلكتروني - ${contractNumber}</h1>
            <div class="badge">حالة الدفع: ${statusLabel}</div>
          </div>
          <div class="content">
            <p>مرحباً ${customerName}،</p>
            <p class="muted">نُرسل إليك نسخة العقد الإلكتروني الخاصة بك. يُمكنك تنزيلها عبر الزر التالي:</p>

            <div style="text-align:center; margin: 24px 0;">
              <a class="btn" href="${pdfUrl}" target="_blank" rel="noopener">تحميل العقد PDF</a>
            </div>

            <div class="row">
              <div class="card">
                <div class="muted small">رقم العقد</div>
                <div style="font-weight:700">${contractNumber}</div>
              </div>
              ${offerTitle ? `<div class="card"><div class="muted small">الخدمة</div><div style="font-weight:700">${offerTitle}</div></div>` : ''}
              ${amount ? `<div class="card"><div class="muted small">القيمة</div><div style="font-weight:700">${amount} ${currency}</div></div>` : ''}
            </div>

            <p class="small">في حال وجود أي استفسار، يُرجى الرد على هذا البريد أو التواصل معنا: info@ash-holding.sa — 0555812567</p>
          </div>
          <div class="footer">
            شركة علي صالح الشهري القابضة • المملكة العربية السعودية
          </div>
        </div>
      </body>
      </html>
    `;

    const emailRes = await resend.emails.send({
      from: 'ASH Holding <info@ash-holding.sa>',
      to: [to],
      bcc: ['info@ash-holding.sa'],
      reply_to: 'info@ash-holding.sa',
      subject: `📄 العقد الإلكتروني الخاص بك - ${contractNumber}`,
      html,
    });

    return new Response(JSON.stringify({ success: true, emailRes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('contract-email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
