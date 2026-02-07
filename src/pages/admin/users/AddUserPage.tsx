/**
 * Add User Page - Command Center Dark Theme
 * Create new user with role assignment
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  UserPlus,
  X,
  Loader2,
  Crown,
  Star,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

// Role configuration
const roleConfig: Record<string, { labelAr: string; labelEn: string; color: string; description: string; descriptionAr: string }> = {
  super_admin: { 
    labelAr: "مدير النظام", 
    labelEn: "Super Admin", 
    color: "var(--cmd-accent-amber)",
    description: "Full system access",
    descriptionAr: "وصول كامل للنظام"
  },
  admin: { 
    labelAr: "مدير", 
    labelEn: "Admin", 
    color: "var(--cmd-accent-purple)",
    description: "Manage users and content",
    descriptionAr: "إدارة المستخدمين والمحتوى"
  },
  manager: { 
    labelAr: "مشرف", 
    labelEn: "Manager", 
    color: "var(--cmd-accent-blue)",
    description: "Team and order management",
    descriptionAr: "إدارة الفريق والطلبات"
  },
  support: { 
    labelAr: "دعم فني", 
    labelEn: "Support", 
    color: "var(--cmd-accent-cyan)",
    description: "Customer support access",
    descriptionAr: "دعم العملاء"
  },
  finance: { 
    labelAr: "مالية", 
    labelEn: "Finance", 
    color: "var(--cmd-accent-green)",
    description: "Financial operations",
    descriptionAr: "العمليات المالية"
  },
  content_editor: { 
    labelAr: "محرر", 
    labelEn: "Editor", 
    color: "265 70% 60%",
    description: "Content management",
    descriptionAr: "إدارة المحتوى"
  },
  staff: { 
    labelAr: "موظف", 
    labelEn: "Staff", 
    color: "220 15% 50%",
    description: "Basic staff access",
    descriptionAr: "وصول الموظف الأساسي"
  },
  customer: { 
    labelAr: "عميل", 
    labelEn: "Customer", 
    color: "220 12% 45%",
    description: "Customer portal access",
    descriptionAr: "وصول بوابة العميل"
  },
};

const availableRoles = [
  'super_admin', 'admin', 'manager', 'support', 'finance', 'content_editor', 'staff', 'customer'
];

interface FormData {
  email: string;
  full_name: string;
  full_name_ar: string;
  phone: string;
  preferred_language: string;
  role: string;
}

export default function AddUserPage() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    full_name: '',
    full_name_ar: '',
    phone: '',
    preferred_language: 'ar',
    role: 'customer',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email format';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);

      // Check if email already exists
      const { data: existingUser } = await db
        .from('profiles')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        setErrors({ email: language === 'ar' ? 'البريد الإلكتروني مسجل مسبقاً' : 'Email already exists' });
        setSaving(false);
        return;
      }

      // Create user through Supabase Auth (Admin)
      // Note: This requires admin privileges, typically done through edge function
      // For now, we'll create an invitation flow
      
      // Create a profile directly (for invited users)
      const userId = crypto.randomUUID();
      
      const { error: profileError } = await db
        .from('profiles')
        .insert({
          id: userId,
          email: formData.email.toLowerCase(),
          full_name: formData.full_name,
          full_name_ar: formData.full_name_ar || null,
          phone: formData.phone || null,
          preferred_language: formData.preferred_language,
          is_active: true,
        });

      if (profileError) throw profileError;

      // Assign role
      const { error: roleError } = await db
        .from('user_roles')
        .insert({
          user_id: userId,
          role: formData.role,
        });

      if (roleError) {
        // Rollback profile creation
        await db.from('profiles').delete().eq('id', userId);
        throw roleError;
      }

      toast({
        title: language === 'ar' ? 'تم إنشاء المستخدم بنجاح' : 'User created successfully',
        description: language === 'ar' 
          ? 'سيتم إرسال رابط تفعيل الحساب للمستخدم'
          : 'An activation link will be sent to the user',
      });

      navigate(ROUTES.ADMIN.USERS);
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast({
        title: language === 'ar' ? 'خطأ في إنشاء المستخدم' : 'Error creating user',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedRoleInfo = roleConfig[formData.role];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate(ROUTES.ADMIN.USERS)}
          className="h-10 w-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ 
            background: 'hsl(var(--cmd-bg-elevated))',
            color: 'hsl(var(--cmd-text-secondary))',
          }}
        >
          <ArrowRight className={cn("h-5 w-5", !isRTL && "rotate-180")} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
            <UserPlus className="h-6 w-6" style={{ color: 'hsl(var(--cmd-accent-cyan))' }} />
            {language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
            {language === 'ar' ? 'أنشئ حساب مستخدم جديد في النظام' : 'Create a new user account in the system'}
          </p>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{
          background: 'hsl(var(--cmd-accent-blue) / 0.1)',
          border: '1px solid hsl(var(--cmd-accent-blue) / 0.3)',
        }}
      >
        <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'hsl(var(--cmd-accent-blue))' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--cmd-accent-blue))' }}>
            {language === 'ar' ? 'ملاحظة' : 'Note'}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
            {language === 'ar' 
              ? 'سيتم إرسال رابط تفعيل الحساب وكلمة مرور مؤقتة إلى البريد الإلكتروني المسجل'
              : 'An activation link and temporary password will be sent to the registered email'}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(var(--cmd-bg-card))',
          border: '1px solid hsl(var(--cmd-border-subtle))',
        }}
      >
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
              <User className="h-5 w-5" style={{ color: 'hsl(var(--cmd-accent-cyan))' }} />
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--cmd-text-secondary))' }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                </label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(var(--cmd-text-muted))' }} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 ps-10 pe-4 rounded-xl text-sm outline-none transition-all"
                    placeholder={language === 'ar' ? 'user@example.com' : 'user@example.com'}
                    dir="ltr"
                    style={{
                      background: 'hsl(var(--cmd-bg-elevated))',
                      border: errors.email 
                        ? '1px solid hsl(var(--cmd-accent-red))' 
                        : '1px solid hsl(var(--cmd-border-subtle))',
                      color: 'hsl(var(--cmd-text-primary))',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-accent-cyan))'}
                    onBlur={(e) => e.currentTarget.style.borderColor = errors.email 
                      ? 'hsl(var(--cmd-accent-red))' 
                      : 'hsl(var(--cmd-border-subtle))'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'hsl(var(--cmd-accent-red))' }}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--cmd-text-secondary))' }}>
                  {language === 'ar' ? 'الاسم الكامل (إنجليزي)' : 'Full Name (English)'} *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'hsl(var(--cmd-bg-elevated))',
                    border: errors.full_name 
                      ? '1px solid hsl(var(--cmd-accent-red))' 
                      : '1px solid hsl(var(--cmd-border-subtle))',
                    color: 'hsl(var(--cmd-text-primary))',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-accent-cyan))'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.full_name 
                    ? 'hsl(var(--cmd-accent-red))' 
                    : 'hsl(var(--cmd-border-subtle))'}
                />
                {errors.full_name && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'hsl(var(--cmd-accent-red))' }}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Full Name Arabic */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--cmd-text-secondary))' }}>
                  {language === 'ar' ? 'الاسم الكامل (عربي)' : 'Full Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.full_name_ar}
                  onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'hsl(var(--cmd-bg-elevated))',
                    border: '1px solid hsl(var(--cmd-border-subtle))',
                    color: 'hsl(var(--cmd-text-primary))',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-accent-cyan))'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-border-subtle))'}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--cmd-text-secondary))' }}>
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(var(--cmd-text-muted))' }} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 ps-10 pe-4 rounded-xl text-sm outline-none transition-all"
                    placeholder="966xxxxxxxxx"
                    dir="ltr"
                    style={{
                      background: 'hsl(var(--cmd-bg-elevated))',
                      border: '1px solid hsl(var(--cmd-border-subtle))',
                      color: 'hsl(var(--cmd-text-primary))',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-accent-cyan))'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(var(--cmd-border-subtle))'}
                  />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--cmd-text-secondary))' }}>
                  {language === 'ar' ? 'اللغة المفضلة' : 'Preferred Language'}
                </label>
                <div className="relative">
                  <Globe className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(var(--cmd-text-muted))' }} />
                  <select
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                    className="w-full h-11 ps-10 pe-4 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                    style={{
                      background: 'hsl(var(--cmd-bg-elevated))',
                      border: '1px solid hsl(var(--cmd-border-subtle))',
                      color: 'hsl(var(--cmd-text-primary))',
                    }}
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: 'hsl(var(--cmd-border-subtle))' }} />

          {/* Role Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
              <Shield className="h-5 w-5" style={{ color: 'hsl(var(--cmd-accent-purple))' }} />
              {language === 'ar' ? 'الدور والصلاحيات' : 'Role & Permissions'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableRoles.map((role) => {
                const info = roleConfig[role];
                const isSelected = formData.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className="p-3 rounded-xl text-sm transition-all text-start"
                    style={{
                      background: isSelected 
                        ? `hsl(${info.color} / 0.15)` 
                        : 'hsl(var(--cmd-bg-elevated))',
                      border: isSelected 
                        ? `2px solid hsl(${info.color} / 0.7)` 
                        : '1px solid hsl(var(--cmd-border-subtle))',
                      color: isSelected 
                        ? `hsl(${info.color})` 
                        : 'hsl(var(--cmd-text-secondary))',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {role === 'super_admin' && <Crown className="h-4 w-4" />}
                      {role === 'admin' && <Star className="h-4 w-4" />}
                      {isSelected && <CheckCircle2 className="h-4 w-4 ms-auto" />}
                    </div>
                    <p className="font-medium">
                      {language === 'ar' ? info.labelAr : info.labelEn}
                    </p>
                    <p className="text-xs mt-0.5 opacity-70">
                      {language === 'ar' ? info.descriptionAr : info.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Info */}
            <div 
              className="mt-4 p-4 rounded-xl"
              style={{
                background: `hsl(${selectedRoleInfo.color} / 0.1)`,
                border: `1px solid hsl(${selectedRoleInfo.color} / 0.3)`,
              }}
            >
              <p className="text-sm font-medium" style={{ color: `hsl(${selectedRoleInfo.color})` }}>
                {language === 'ar' ? 'الدور المحدد:' : 'Selected Role:'} {language === 'ar' ? selectedRoleInfo.labelAr : selectedRoleInfo.labelEn}
              </p>
              <p className="text-sm mt-1" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
                {language === 'ar' ? selectedRoleInfo.descriptionAr : selectedRoleInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div 
          className="p-6 flex items-center justify-end gap-3"
          style={{ 
            background: 'hsl(var(--cmd-bg-elevated))',
            borderTop: '1px solid hsl(var(--cmd-border-subtle))',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.USERS)}
            className="h-11 px-6 flex items-center gap-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid hsl(var(--cmd-border-subtle))',
              color: 'hsl(var(--cmd-text-secondary))',
            }}
          >
            <X className="h-4 w-4" />
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 flex items-center gap-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--cmd-accent-cyan)), hsl(var(--cmd-accent-blue)))',
              color: 'white',
            }}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {language === 'ar' ? 'إنشاء المستخدم' : 'Create User'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
