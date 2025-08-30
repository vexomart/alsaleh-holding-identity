import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientEmail: string;
  clientName: string;
  onSuccess: () => void;
}

export const EmailVerificationDialog: React.FC<EmailVerificationDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  clientEmail,
  clientName,
  onSuccess
}) => {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const { toast } = useToast();

  const handleSendVerificationCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: {
          email: clientEmail,
          type: 'user',
          user_name: clientName
        }
      });

      if (error) {
        console.error('Error sending verification code:', error);
        toast({
          title: "خطأ في الإرسال",
          description: "حدث خطأ أثناء إرسال رمز التحقق",
          variant: "destructive",
        });
        return;
      }

      console.log('Verification code sent:', data);
      setCodeSent(true);
      setStep('verify');
      toast({
        title: "تم الإرسال بنجاح",
        description: `تم إرسال رمز التحقق إلى ${clientEmail}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال رمز التحقق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "رمز غير صحيح",
        description: "يرجى إدخال رمز التحقق المكون من 6 أرقام",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-login-code', {
        body: {
          email: clientEmail,
          code: verificationCode,
          type: 'user'
        }
      });

      if (error) {
        console.error('Error verifying code:', error);
        toast({
          title: "رمز غير صحيح",
          description: "الرمز المدخل غير صحيح أو منتهي الصلاحية",
          variant: "destructive",
        });
        return;
      }

      // Update user verification status
      const { error: updateError } = await supabase
        .from('ash_users')
        .update({
          verified_at: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', clientId);

      if (updateError) {
        console.error('Error updating user status:', updateError);
        toast({
          title: "خطأ في التحديث",
          description: "حدث خطأ أثناء تحديث حالة التوثيق",
          variant: "destructive",
        });
        return;
      }

      console.log('Email verified successfully:', data);
      toast({
        title: "تم التوثيق بنجاح",
        description: "تم توثيق البريد الإلكتروني للعميل بنجاح",
      });
      
      onSuccess();
      onOpenChange(false);
      setStep('send');
      setVerificationCode('');
      setCodeSent(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الرمز",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('send');
    setVerificationCode('');
    setCodeSent(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 font-tajawal">
            <Mail className="h-5 w-5 text-primary" />
            توثيق البريد الإلكتروني
          </DialogTitle>
          <DialogDescription className="font-tajawal">
            {step === 'send' 
              ? `سيتم إرسال رمز التحقق إلى البريد الإلكتروني: ${clientEmail}`
              : 'يرجى إدخال رمز التحقق المرسل إلى البريد الإلكتروني'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'send' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium font-tajawal">{clientName}</p>
                  <p className="text-sm text-muted-foreground font-tajawal">{clientEmail}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="font-tajawal">
                  رمز التحقق
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
              {codeSent && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-tajawal">تم إرسال الرمز بنجاح</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="font-tajawal">
            إلغاء
          </Button>
          {step === 'send' ? (
            <Button 
              onClick={handleSendVerificationCode} 
              disabled={loading}
              className="font-tajawal"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  إرسال رمز التحقق
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleVerifyCode} 
              disabled={loading || verificationCode.length !== 6}
              className="font-tajawal"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تأكيد التوثيق
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};