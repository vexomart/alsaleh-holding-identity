import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Receipt, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [loading, setLoading] = useState(true);
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const checkPaymentStatus = async () => {
    try {
      // Get transaction details from URL parameters
      const chargeId =
        // Direct gateway params
        searchParams.get("tap_id") ||
        searchParams.get("paylink_id") ||
        searchParams.get("tamara_id") ||
        searchParams.get("stc_id") ||
        // Paylink commonly returns transactionNo
        searchParams.get("transactionNo") ||
        searchParams.get("transaction_no") ||
        searchParams.get("transaction");
      const amount = searchParams.get("amount") || searchParams.get("amt");
      const currency = searchParams.get("currency") || searchParams.get("curr") || "SAR";
      
      if (chargeId) {
        setTransactionDetails({
          chargeId,
          amount,
          currency,
          timestamp: new Date().toISOString(),
        });

        // التحقق من حالة المعاملة في قاعدة البيانات
        const { data: transaction, error } = await supabase
          .from('payment_transactions')
          .select('*')
          .or(`tap_charge_id.eq.${chargeId},paylink_transaction_no.eq.${chargeId},tamara_order_id.eq.${chargeId},stc_pay_reference.eq.${chargeId}`)
          .maybeSingle();

        if (error) {
          console.error('Error fetching transaction:', error);
          setPaymentStatus('failed');
        } else if (transaction) {
          setTransactionDetails(transaction);
          
          // إذا كانت الحالة لا تزال pending أو initiated، تحقق من الحالة الفعلية
          if (transaction.status === 'INITIATED' || transaction.status === 'PENDING') {
            await verifyPaymentWithProvider(transaction.id);
          } else if (transaction.status === 'PAID' || transaction.status === 'COMPLETED') {
            setPaymentStatus('success');
          } else {
            setPaymentStatus('failed');
          }
        } else {
          setPaymentStatus('pending');
        }
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentWithProvider = async (transactionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment-status', {
        body: { transactionId }
      });

      if (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('pending');
        return;
      }

      if (data.status === 'PAID' || data.status === 'COMPLETED') {
        setPaymentStatus('success');
        setTransactionDetails(prev => prev ? { ...prev, status: data.status } : null);
      } else if (data.status === 'FAILED') {
        setPaymentStatus('failed');
        setTransactionDetails(prev => prev ? { ...prev, status: data.status } : null);
      } else {
        setPaymentStatus('pending');
      }
    } catch (error) {
      console.error('Error verifying payment status:', error);
      setPaymentStatus('pending');
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [searchParams]);

  // إنشاء عنصر HTML مبسّط للعقد لاستخدامه في توليد PDF
  const buildContractElement = (contract: any, tx: any) => {
    const el = document.createElement('div');
    el.style.cssText = `width:794px;padding:32px;background:#fff;color:#000;direction:rtl;text-align:right;font-family:Tahoma,Arial,sans-serif;position:fixed;left:-10000px;top:0;`;
    el.innerHTML = `
      <div style="border:2px solid #1e3a8a;padding:16px;background:#f8fafc;text-align:center">
        <h1 style="margin:0 0 6px 0;color:#1e3a8a">شركة علي صالح الشهري القابضة</h1>
        <div style="color:#475569">عقد إلكتروني رقم: <b>${contract.contract_number || ''}</b></div>
      </div>
      <div style="border:1px solid #e5e7eb;margin-top:12px;padding:12px;background:#fff">
        <div><b>اسم العميل:</b> ${contract.client_name || ''}</div>
        <div><b>البريد:</b> ${contract.client_email || ''} — <b>الهاتف:</b> ${contract.client_phone || ''}</div>
        <div><b>الخدمة:</b> ${contract.service_type || tx.offer_title || 'خدمات تقنية'}</div>
        <div><b>الوصف:</b> ${contract.service_description || ''}</div>
        <div><b>القيمة:</b> ${contract.service_price || tx.amount} ${contract.currency || tx.currency || 'SAR'}</div>
        <div><b>تاريخ الإصدار:</b> ${new Date().toLocaleDateString('ar-SA')}</div>
      </div>
    `;
    return el;
  };

  const generateAndUploadContractPDF = async (contract: any, tx: any) => {
    try {
      setGenerating(true);
      const el = buildContractElement(contract, tx);
      document.body.appendChild(el);
      const canvas = await html2canvas(el as unknown as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 48; // margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 24, 24, imgWidth, Math.min(imgHeight, pageHeight - 48));
      const blob = pdf.output('blob');

      const path = `${contract.id}/contract-${contract.contract_number || 'document'}.pdf`;
      const { error: upErr } = await supabase.storage.from('contracts').upload(path, blob, { upsert: true, contentType: 'application/pdf' });
      if (upErr) throw upErr;

      const { data: pub } = await supabase.storage.from('contracts').getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      await supabase.from('contracts').update({ contract_pdf_url: publicUrl }).eq('id', contract.id);
      setContractUrl(publicUrl);

      // إرسال بريد بالعقد
      await supabase.functions.invoke('contract-email', {
        body: {
          to: contract.client_email,
          customerName: contract.client_name,
          contractNumber: contract.contract_number,
          pdfUrl: publicUrl,
          amount: contract.service_price,
          currency: contract.currency || 'SAR',
          offerTitle: tx.offer_title,
          paymentStatus: 'paid',
        },
      });
    } catch (e) {
      console.error('Contract PDF generation/upload failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  const prepareContract = async () => {
    try {
      const tx = transactionDetails;
      if (!tx) return;
      // احصل على أحدث المعاملة لتأكيد وجود contract_id
      let currentTx = tx;
      if (!currentTx.id) {
        const { data: fetched } = await supabase
          .from('payment_transactions')
          .select('*')
          .or(`tap_charge_id.eq.${tx.chargeId},paylink_transaction_no.eq.${tx.chargeId},tamara_order_id.eq.${tx.chargeId},stc_pay_reference.eq.${tx.chargeId}`)
          .maybeSingle();
        if (fetched) currentTx = fetched;
      }
      if (!currentTx?.contract_id) return;

      const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', currentTx.contract_id)
        .maybeSingle();

      if (!contract) return;
      if (contract.contract_pdf_url) {
        setContractUrl(contract.contract_pdf_url);
        return;
      }
      await generateAndUploadContractPDF(contract, currentTx);
    } catch (e) {
      console.error('prepareContract error:', e);
    }
  };

  useEffect(() => {
    if (paymentStatus === 'success') {
      prepareContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus, transactionDetails]);
  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {loading ? (
            <div className="space-y-4">
              <Clock className="w-20 h-20 text-blue-500 mx-auto animate-spin" />
              <h1 className="text-2xl font-bold text-foreground">
                جاري التحقق من حالة الدفع...
              </h1>
            </div>
          ) : (
            <>
              {/* Success/Pending/Failed States */}
              {paymentStatus === 'success' && (
                <div className="space-y-4">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
                  <h1 className="text-4xl font-bold text-foreground">
                    تم الدفع بنجاح!
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    شكراً لك على ثقتك بنا. تم تأكيد عملية الدفع بنجاح
                  </p>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="space-y-4">
                  <Clock className="w-20 h-20 text-orange-500 mx-auto" />
                  <h1 className="text-3xl font-bold text-foreground">
                    عملية الدفع قيد المعالجة
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    عملية الدفع قيد المراجعة. سيتم إشعارك فور اكتمالها
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">
                      قد تستغرق عملية التأكيد من 5-10 دقائق. يرجى عدم القلق
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="space-y-4">
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                  <h1 className="text-3xl font-bold text-foreground">
                    خطأ في عملية الدفع
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    لم يتم العثور على تفاصيل المعاملة أو حدث خطأ
                  </p>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">
                      يرجى التواصل مع فريق الدعم للمساعدة
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}

          {/* Transaction Details */}
          {transactionDetails && (
            <Card className="text-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Receipt className="w-5 h-5" />
                  تفاصيل المعاملة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">رقم المعاملة:</span>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {transactionDetails.chargeId}
                  </span>
                </div>
                {transactionDetails.amount && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">المبلغ:</span>
                    <span className="text-lg font-bold text-green-600">
                      {transactionDetails.amount} {transactionDetails.currency || 'SAR'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium">تاريخ العملية:</span>
                  <span>{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps - only show for success */}
          {paymentStatus === 'success' && (
            <Card>
              <CardHeader>
                <CardTitle>الخطوات التالية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  سيتم التواصل معك خلال 24 ساعة لتأكيد تفاصيل الخدمة وبدء العمل
                </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {generating && (
                  <Button disabled className="flex items-center gap-2 hover-scale">
                    <Clock className="w-4 h-4 animate-spin" />
                    جاري تجهيز العقد...
                  </Button>
                )}
                {!generating && contractUrl && (
                  <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="hover-scale">
                    <Button className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      تحميل العقد PDF
                    </Button>
                  </a>
                )}
                {!generating && !contractUrl && (
                  <Button disabled className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    يتم تجهيز العقد
                  </Button>
                )}
                <Button 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 hover-scale"
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/current-offers")}
                  className="flex items-center gap-2 hover-scale"
                >
                  <ArrowRight className="w-4 h-4" />
                  مشاهدة العروض الأخرى
                </Button>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Pending Status Actions */}
          {paymentStatus === 'pending' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    العودة للرئيسية
                  </Button>
                  <Button 
                    onClick={() => checkPaymentStatus()}
                    className="flex items-center gap-2"
                  >
                    التحقق من حالة الدفع
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failed Status Actions */}
          {paymentStatus === 'failed' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    العودة للرئيسية
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/software-products")}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    إعادة المحاولة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">هل تحتاج المساعدة؟</h3>
            <p className="text-muted-foreground mb-4">
              فريق الدعم الفني متاح على مدار الساعة لمساعدتك
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <span>📧 info@alialshehriholding.com</span>
              <span>📱 0555812567</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;