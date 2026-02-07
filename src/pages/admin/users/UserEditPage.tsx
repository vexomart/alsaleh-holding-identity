/**
 * User Edit Page - Command Center Dark Theme
 * Edit user profile and settings
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  Save,
  X,
  Loader2,
  Crown,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { db } from '@/integrations/supabase/db';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

// Role configuration
const roleConfig: Record<string, { labelAr: string; labelEn: string; color: string }> = {
  super_admin: { labelAr: "مدير النظام", labelEn: "Super Admin", color: "var(--cmd-accent-amber)" },
  admin: { labelAr: "مدير", labelEn: "Admin", color: "var(--cmd-accent-purple)" },
  manager: { labelAr: "مشرف", labelEn: "Manager", color: "var(--cmd-accent-blue)" },
  support: { labelAr: "دعم فني", labelEn: "Support", color: "var(--cmd-accent-cyan)" },
  finance: { labelAr: "مالية", labelEn: "Finance", color: "var(--cmd-accent-green)" },
  content_editor: { labelAr: "محرر", labelEn: "Editor", color: "265 70% 60%" },
  staff: { labelAr: "موظف", labelEn: "Staff", color: "220 15% 50%" },
  customer: { labelAr: "عميل", labelEn: "Customer", color: "220 12% 45%" },
};

const availableRoles = [
  'super_admin', 'admin', 'manager', 'support', 'finance', 'content_editor', 'staff', 'customer'
];

interface FormData {
  full_name: string;
  full_name_ar: string;
  phone: string;
  preferred_language: string;
  is_active: boolean;
}

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    full_name_ar: '',
    phone: '',
    preferred_language: 'ar',
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await db
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Fetch user roles separately
      const { data: rolesData } = await db
        .from('user_roles')
        .select('role')
        .eq('user_id', id);

      const roles = rolesData?.map((r: { role: string }) => r.role) || [];
      
      setEmail(profileData.email);
      setCurrentRoles(roles);
      setSelectedRole(roles[0] || 'customer');
      setFormData({
        full_name: profileData.full_name || '',
        full_name_ar: profileData.full_name_ar || '',
        phone: profileData.phone || '',
        preferred_language: profileData.preferred_language || 'ar',
        is_active: profileData.is_active ?? true,
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      toast({
        title: language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data',
        variant: 'destructive',
      });
      navigate(ROUTES.ADMIN.USERS);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
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

      // Update profile
      const { error: profileError } = await db
        .from('profiles')
        .update({
          full_name: formData.full_name,
          full_name_ar: formData.full_name_ar || null,
          phone: formData.phone || null,
          preferred_language: formData.preferred_language,
          is_active: formData.is_active,
        })
        .eq('id', id);

      if (profileError) throw profileError;

      // Update role if changed
      const primaryRole = currentRoles[0];
      if (primaryRole !== selectedRole) {
        // Remove old role
        if (primaryRole) {
          await db.from('user_roles').delete().eq('user_id', id).eq('role', primaryRole);
        }
        // Add new role
        await db.from('user_roles').insert({ user_id: id, role: selectedRole });
      }

      toast({
        title: language === 'ar' ? 'تم حفظ التغييرات' : 'Changes saved',
      });

      navigate(`/adminash/users/${id}`);
    } catch (err) {
      console.error('Error saving user:', err);
      toast({
        title: language === 'ar' ? 'خطأ في حفظ البيانات' : 'Error saving data',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg" style={{ background: 'hsl(var(--cmd-bg-elevated))' }} />
        <div className="h-96 rounded-xl" style={{ background: 'hsl(var(--cmd-bg-card))' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate(`/adminash/users/${id}`)}
          className="h-10 w-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ 
            background: 'hsl(var(--cmd-bg-elevated))',
            color: 'hsl(var(--cmd-text-secondary))',
          }}
        >
          <ArrowRight className={cn("h-5 w-5", !isRTL && "rotate-180")} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
            {language === 'ar' ? 'تعديل المستخدم' : 'Edit User'}
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
            {email}
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
                    style={{
                      background: 'hsl(var(--cmd-bg-elevated))',
                      border: '1px solid hsl(var(--cmd-border-subtle))',
                      color: 'hsl(var(--cmd-text-primary))',
                    }}
                    dir="ltr"
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
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className="p-3 rounded-xl text-sm font-medium transition-all text-start"
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
                    {language === 'ar' ? info.labelAr : info.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: 'hsl(var(--cmd-border-subtle))' }} />

          {/* Status Toggle */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
              {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
            </h3>
            
            <label 
              className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors"
              style={{
                background: 'hsl(var(--cmd-bg-elevated))',
                border: '1px solid hsl(var(--cmd-border-subtle))',
              }}
            >
              <div>
                <p className="font-medium" style={{ color: 'hsl(var(--cmd-text-primary))' }}>
                  {formData.is_active 
                    ? (language === 'ar' ? 'الحساب نشط' : 'Account Active')
                    : (language === 'ar' ? 'الحساب معطل' : 'Account Inactive')}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
                  {language === 'ar' 
                    ? 'تفعيل أو تعطيل وصول المستخدم للنظام'
                    : 'Enable or disable user access to the system'}
                </p>
              </div>
              <div 
                className={cn(
                  "relative w-12 h-7 rounded-full transition-colors cursor-pointer"
                )}
                style={{
                  background: formData.is_active 
                    ? 'hsl(var(--cmd-accent-green))' 
                    : 'hsl(var(--cmd-text-dim) / 0.3)',
                }}
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              >
                <div 
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full transition-all",
                    formData.is_active ? "end-1" : "start-1"
                  )}
                  style={{ background: 'white' }}
                />
              </div>
            </label>
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
            onClick={() => navigate(`/adminash/users/${id}`)}
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
              <Save className="h-4 w-4" />
            )}
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
