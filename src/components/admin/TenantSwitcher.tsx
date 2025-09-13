import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/components/TenantProvider';
import { Building2, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const TenantSwitcher = () => {
  const { currentTenant, tenants, switchTenant, loading } = useTenant();

  const handleTenantSwitch = async (tenantCode: string) => {
    const success = await switchTenant(tenantCode);
    if (success) {
      toast.success(`تم التبديل إلى موقع: ${tenants.find(t => t.code === tenantCode)?.name}`);
      // إعادة تحميل الصفحة لتطبيق السياق الجديد
      window.location.reload();
    } else {
      toast.error('فشل في التبديل بين المواقع');
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="mr-2">جاري تحميل المواقع...</span>
        </CardContent>
      </Card>
    );
  }

  const getTenantSettings = (tenant: any) => {
    if (!tenant?.settings || typeof tenant.settings === 'string') {
      return { branding: { primary_color: '#1e3a8a' }, theme: 'corporate' };
    }
    return tenant.settings;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          إدارة المواقع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">الموقع الحالي:</label>
          {currentTenant ? (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Globe className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{currentTenant.name}</div>
                <div className="text-xs text-muted-foreground">{currentTenant.domain}</div>
              </div>
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: getTenantSettings(currentTenant)?.branding?.primary_color || '#1e3a8a',
                  color: 'white'
                }}
              >
                {getTenantSettings(currentTenant)?.theme || 'corporate'}
              </Badge>
            </div>
          ) : (
            <div className="p-3 bg-muted rounded-lg text-center text-muted-foreground">
              لم يتم تحديد موقع
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">التبديل إلى موقع آخر:</label>
          <Select onValueChange={handleTenantSwitch} value={currentTenant?.code}>
            <SelectTrigger>
              <SelectValue placeholder="اختر موقع..." />
            </SelectTrigger>
            <SelectContent>
              {tenants.filter(tenant => tenant.code === 'alishehri').map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.code}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-xs text-muted-foreground">{tenant.domain}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
          <div>• كل موقع يحتوي على بيانات منفصلة</div>
          <div>• يمكن للمدير الوصول لجميع المواقع</div>
          <div>• التبديل سيعيد تحميل الصفحة</div>
        </div>
      </CardContent>
    </Card>
  );
};