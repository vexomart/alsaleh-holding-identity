import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EmailTest = () => {
  const [to, setTo] = useState("info@alialshehriholding.com");
  const [subject, setSubject] = useState("اختبار التوثيق - Resend");
  const [message, setMessage] = useState("اختبار إرسال من داخل الموقع للتأكد من التوثيق");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    document.title = "اختبار توثيق البريد | Ali AlShehri Holding";
  }, []);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("email-test", {
        body: { to, subject, message },
      });
      if (error) throw error;
      setResult(`تم الإرسال بنجاح (ID: ${data?.id || "-"}) إلى ${to}`);
    } catch (err: any) {
      setResult(`فشل الإرسال: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">اختبار توثيق البريد</h1>
        <p className="text-muted-foreground mt-2">
          أرسل رسالة تجريبية من خلال Resend باستخدام وظيفة الحافة للتحقق من وصول الرسائل.
        </p>
      </header>

      <section aria-labelledby="form-title" className="bg-card rounded-lg border p-6">
        <h2 id="form-title" className="sr-only">نموذج الاختبار</h2>
        <form onSubmit={onSend} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">البريد المستلم</label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm mb-1">العنوان</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">الرسالة</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "جار الإرسال..." : "إرسال رسالة اختبار"}
            </Button>
            <span className="text-xs text-muted-foreground">سيتم أيضاً إرسال نسخة BCC إلى info@alialshehriholding.com</span>
          </div>
        </form>
        {result && (
          <div className="mt-4 text-sm">
            {result}
          </div>
        )}
      </section>
    </main>
  );
};

export default EmailTest;
