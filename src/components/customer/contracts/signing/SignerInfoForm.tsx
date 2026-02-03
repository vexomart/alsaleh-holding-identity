/**
 * Signer Information Form - Collects signer details
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { 
  User, 
  CreditCard, 
  Phone,
  Mail,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface SignerInfoFormProps {
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  onContinue: (data: SignerData) => void;
  onBack: () => void;
}

export interface SignerData {
  name: string;
  nationalId: string;
  phone: string;
  email?: string;
}

export function SignerInfoForm({
  initialName = '',
  initialPhone = '',
  initialEmail = '',
  onContinue,
  onBack,
}: SignerInfoFormProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [name, setName] = useState(initialName);
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialName) setName(initialName);
    if (initialPhone) setPhone(initialPhone);
    if (initialEmail) setEmail(initialEmail);
  }, [initialName, initialPhone, initialEmail]);

  const validateNationalId = (id: string): boolean => {
    // Saudi National ID: 10 digits starting with 1 or 2
    const regex = /^[12]\d{9}$/;
    return regex.test(id);
  };

  const validatePhone = (phoneNum: string): boolean => {
    // Saudi phone: starts with 05 or +966
    const cleaned = phoneNum.replace(/\s/g, '');
    const regex = /^(05\d{8}|\+966\d{9})$/;
    return regex.test(cleaned);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isRTL ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!nationalId.trim()) {
      newErrors.nationalId = isRTL ? 'رقم الهوية مطلوب' : 'National ID is required';
    } else if (!validateNationalId(nationalId)) {
      newErrors.nationalId = isRTL ? 'رقم الهوية غير صحيح' : 'Invalid National ID';
    }

    if (!phone.trim()) {
      newErrors.phone = isRTL ? 'رقم الجوال مطلوب' : 'Phone is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = isRTL ? 'رقم الجوال غير صحيح' : 'Invalid phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onContinue({
        name: name.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      });
    }
  };

  const isFormValid = name.trim() && nationalId.trim() && phone.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Info Card */}
      <Card className="border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="font-medium text-indigo-700 dark:text-indigo-400">
                {isRTL ? 'بيانات الموقع الإلكتروني' : 'Electronic Signer Information'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL 
                  ? 'يرجى إدخال بياناتك بدقة. هذه البيانات ستُستخدم لتوثيق التوقيع الإلكتروني وستظهر في العقد الرسمي.'
                  : 'Please enter your details accurately. This information will be used to authenticate your electronic signature and appear in the official contract.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {isRTL ? 'بيانات الموقع' : 'Signer Details'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'أدخل بياناتك الشخصية للتوقيع على العقد'
              : 'Enter your personal information to sign the contract'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="signer-name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {isRTL ? 'الاسم الكامل' : 'Full Name'} *
            </Label>
            <Input
              id="signer-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder={isRTL ? 'أدخل اسمك الكامل كما في الهوية' : 'Enter your full name as on ID'}
              className={cn(errors.name && "border-red-500")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <Label htmlFor="national-id" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              {isRTL ? 'رقم الهوية الوطنية' : 'National ID Number'} *
            </Label>
            <Input
              id="national-id"
              value={nationalId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setNationalId(value);
                if (errors.nationalId) setErrors(prev => ({ ...prev, nationalId: '' }));
              }}
              placeholder="1XXXXXXXXX"
              dir="ltr"
              className={cn("font-mono", errors.nationalId && "border-red-500")}
              maxLength={10}
            />
            {errors.nationalId && (
              <p className="text-xs text-red-500">{errors.nationalId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'رقم الهوية الوطنية السعودية (10 أرقام)' : 'Saudi National ID (10 digits)'}
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {isRTL ? 'رقم الجوال' : 'Phone Number'} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              placeholder="05XXXXXXXX"
              dir="ltr"
              className={cn("font-mono", errors.phone && "border-red-500")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {isRTL ? 'البريد الإلكتروني' : 'Email'} ({isRTL ? 'اختياري' : 'Optional'})
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {isFormValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  {isRTL ? 'جميع البيانات المطلوبة مكتملة' : 'All required fields are complete'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="sm:flex-1"
        >
          {isRTL ? 'السابق' : 'Back'}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isRTL ? 'متابعة للتوقيع' : 'Continue to Sign'}
        </Button>
      </div>
    </motion.div>
  );
}
