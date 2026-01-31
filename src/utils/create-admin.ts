import { supabase } from "@/integrations/supabase/client";

// دالة لإنشاء المستخدم الإداري
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      body: {
        email: 'info@ash-holding.sa',
        password: 'Ali@@#@@1409',
        fullName: 'المدير العام'
      }
    });

    if (error) {
      console.error('خطأ في إنشاء المستخدم الإداري:', error);
      return { success: false, error: error.message };
    }

    console.log('تم إنشاء المستخدم الإداري بنجاح:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('خطأ في التواصل مع الخادم:', error);
    return { success: false, error: error.message };
  }
};

// تشغيل الدالة
createAdminUser().then(result => {
  if (result.success) {
    console.log('✅ تم إنشاء المستخدم الإداري بنجاح');
  } else {
    console.error('❌ فشل في إنشاء المستخدم الإداري:', result.error);
  }
});