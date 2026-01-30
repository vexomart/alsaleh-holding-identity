import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useUsers } from '@/hooks/useUsers';

const roleColors: Record<string, string> = {
  super_admin: 'bg-red-500/10 text-red-500',
  admin: 'bg-purple-500/10 text-purple-500',
  manager: 'bg-blue-500/10 text-blue-500',
  staff: 'bg-emerald-500/10 text-emerald-500',
  customer: 'bg-amber-500/10 text-amber-500',
};

const roleLabels: Record<string, { ar: string; en: string }> = {
  super_admin: { ar: 'مدير عام', en: 'Super Admin' },
  admin: { ar: 'مدير', en: 'Admin' },
  manager: { ar: 'مشرف', en: 'Manager' },
  staff: { ar: 'موظف', en: 'Staff' },
  customer: { ar: 'عميل', en: 'Customer' },
};

const AdminUsers = () => {
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState('');
  const { users, loading } = useUsers();

  const filteredUsers = users.filter(user =>
    (user.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.phone || '').includes(search)
  );

  const getUserRole = (user: typeof users[0]) => {
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].role;
    }
    return 'customer';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة المستخدمين' : 'Users Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة المستخدمين والصلاحيات' : 'Manage users and permissions'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 me-2" />
          {isRTL ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? 'البحث في المستخدمين...' : 'Search users...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {search ? (isRTL ? 'لا توجد نتائج للبحث' : 'No search results') : (isRTL ? 'لا يوجد مستخدمين بعد' : 'No users yet')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => {
            const role = getUserRole(user);
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {(user.full_name || user.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.full_name || user.email.split('@')[0]}</p>
                          <Badge className={roleColors[role] || roleColors.customer} variant="secondary">
                            <Shield className="w-3 h-3 me-1" />
                            {isRTL ? roleLabels[role]?.ar : roleLabels[role]?.en || role}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {isRTL 
                          ? (user.is_active ? 'نشط' : 'غير نشط')
                          : (user.is_active ? 'Active' : 'Inactive')}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {isRTL ? 'تعديل' : 'Edit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
