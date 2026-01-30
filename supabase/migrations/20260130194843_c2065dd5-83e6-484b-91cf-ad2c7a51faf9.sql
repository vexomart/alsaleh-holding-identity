-- =====================================================
-- PHASE 0.5C: SEED PERMISSIONS + ROLE_PERMISSIONS
-- =====================================================

-- B.1) INSERT ALL PERMISSION KEYS
-- =====================================================
INSERT INTO public.permissions (name, name_ar, module, description) VALUES
-- Users module
('users.view', 'عرض المستخدمين', 'users', 'View users list'),
('users.create', 'إنشاء مستخدم', 'users', 'Create new users'),
('users.edit', 'تعديل مستخدم', 'users', 'Edit user details'),
('users.delete', 'حذف مستخدم', 'users', 'Delete users'),
-- Roles module
('roles.view', 'عرض الأدوار', 'roles', 'View roles'),
('roles.edit', 'تعديل الأدوار', 'roles', 'Edit roles and permissions'),
-- Services module
('services.view', 'عرض الخدمات', 'services', 'View services'),
('services.create', 'إنشاء خدمة', 'services', 'Create services'),
('services.edit', 'تعديل خدمة', 'services', 'Edit services'),
('services.delete', 'حذف خدمة', 'services', 'Delete services'),
-- Orders module
('orders.view_all', 'عرض جميع الطلبات', 'orders', 'View all orders'),
('orders.view_own', 'عرض طلباتي', 'orders', 'View own orders'),
('orders.create', 'إنشاء طلب', 'orders', 'Create orders'),
('orders.edit_status', 'تعديل حالة الطلب', 'orders', 'Change order status'),
('orders.assign', 'تعيين الطلب', 'orders', 'Assign orders to staff'),
('orders.export', 'تصدير الطلبات', 'orders', 'Export orders data'),
-- CMS module
('cms.pages.view', 'عرض الصفحات', 'cms', 'View CMS pages'),
('cms.pages.create', 'إنشاء صفحة', 'cms', 'Create CMS pages'),
('cms.pages.edit', 'تعديل صفحة', 'cms', 'Edit CMS pages'),
('cms.pages.publish', 'نشر صفحة', 'cms', 'Publish CMS pages'),
('cms.menus.edit', 'تعديل القوائم', 'cms', 'Edit menus'),
('cms.media.upload', 'رفع الوسائط', 'cms', 'Upload media files'),
-- Reports module
('reports.view', 'عرض التقارير', 'reports', 'View reports'),
('reports.export', 'تصدير التقارير', 'reports', 'Export reports'),
-- Notifications module
('notifications.view', 'عرض الإشعارات', 'notifications', 'View notifications'),
('notifications.send', 'إرسال إشعار', 'notifications', 'Send notifications'),
-- Audit module
('audit.view', 'عرض سجل التدقيق', 'audit', 'View audit logs'),
-- Settings module
('settings.edit', 'تعديل الإعدادات', 'settings', 'Edit system settings')
ON CONFLICT (name) DO NOTHING;

-- B.2) SEED ROLE_PERMISSIONS MAPPING
-- =====================================================

-- Clear existing global role_permissions to re-seed
DELETE FROM public.role_permissions WHERE tenant_id IS NULL;

-- super_admin: all permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'super_admin'::app_role, id, NULL FROM public.permissions;

-- admin: most permissions except roles.edit and users.delete
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'admin'::app_role, id, NULL FROM public.permissions 
WHERE name NOT IN ('roles.edit', 'users.delete');

-- manager: operational permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'manager'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'users.view', 'services.view', 
  'orders.view_all', 'orders.view_own', 'orders.create', 'orders.edit_status', 'orders.assign', 'orders.export',
  'reports.view', 'notifications.view'
);

-- support: customer support permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'support'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'users.view', 'services.view',
  'orders.view_all', 'orders.view_own', 'orders.edit_status',
  'notifications.view', 'notifications.send'
);

-- finance: financial permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'finance'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'orders.view_all', 'orders.view_own', 'orders.export',
  'reports.view', 'reports.export'
);

-- content_editor: CMS permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'content_editor'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'cms.pages.view', 'cms.pages.create', 'cms.pages.edit',
  'cms.menus.edit', 'cms.media.upload'
);

-- staff: basic staff permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'staff'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'services.view', 'orders.view_own', 'notifications.view'
);

-- customer: basic permissions
INSERT INTO public.role_permissions (role, permission_id, tenant_id)
SELECT 'customer'::app_role, id, NULL FROM public.permissions 
WHERE name IN (
  'services.view', 'orders.view_own', 'orders.create', 'notifications.view'
);