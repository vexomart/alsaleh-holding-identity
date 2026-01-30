import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Building,
  Check,
  X,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatar?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Ahmed Al-Salem', email: 'ahmed@holding.com', role: 'admin', department: 'Executive', status: 'active', lastActive: '2 mins ago' },
  { id: '2', name: 'Sara Al-Rashid', email: 'sara@holding.com', role: 'manager', department: 'Finance', status: 'active', lastActive: '15 mins ago' },
  { id: '3', name: 'Mohammed Hassan', email: 'mohammed@holding.com', role: 'analyst', department: 'Technology', status: 'active', lastActive: '1 hour ago' },
  { id: '4', name: 'Fatima Al-Zahrani', email: 'fatima@holding.com', role: 'manager', department: 'Media', status: 'inactive', lastActive: '2 days ago' },
  { id: '5', name: 'Khalid Ibrahim', email: 'khalid@holding.com', role: 'viewer', department: 'Operations', status: 'pending', lastActive: 'Never' },
  { id: '6', name: 'Nora Al-Otaibi', email: 'nora@holding.com', role: 'analyst', department: 'Investments', status: 'active', lastActive: '30 mins ago' },
];

const roleConfig = {
  admin: { labelEn: 'Admin', labelAr: 'مدير', color: 'bg-destructive text-destructive-foreground' },
  manager: { labelEn: 'Manager', labelAr: 'مسؤول', color: 'bg-primary text-primary-foreground' },
  analyst: { labelEn: 'Analyst', labelAr: 'محلل', color: 'bg-secondary text-secondary-foreground' },
  viewer: { labelEn: 'Viewer', labelAr: 'مشاهد', color: 'bg-muted text-muted-foreground' },
};

const statusConfig = {
  active: { labelEn: 'Active', labelAr: 'نشط', color: 'bg-success/10 text-success', icon: UserCheck },
  inactive: { labelEn: 'Inactive', labelAr: 'غير نشط', color: 'bg-muted text-muted-foreground', icon: UserX },
  pending: { labelEn: 'Pending', labelAr: 'قيد الانتظار', color: 'bg-warning/10 text-warning', icon: Clock },
};

export const UserManagement: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    inactive: mockUsers.filter(u => u.status === 'inactive').length,
    pending: mockUsers.filter(u => u.status === 'pending').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${stats.total} مستخدم • ${stats.active} نشط`
                : `${stats.total} users • ${stats.active} active`
              }
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: stats.total, icon: Users, color: 'text-primary' },
          { label: language === 'ar' ? 'نشط' : 'Active', value: stats.active, icon: UserCheck, color: 'text-success' },
          { label: language === 'ar' ? 'غير نشط' : 'Inactive', value: stats.inactive, icon: UserX, color: 'text-muted-foreground' },
          { label: language === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, icon: Clock, color: 'text-warning' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
              <Input
                placeholder={language === 'ar' ? 'بحث عن مستخدم...' : 'Search users...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Shield className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === 'ar' ? 'الدور' : 'Role'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</SelectItem>
                <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
                <SelectItem value="manager">{language === 'ar' ? 'مسؤول' : 'Manager'}</SelectItem>
                <SelectItem value="analyst">{language === 'ar' ? 'محلل' : 'Analyst'}</SelectItem>
                <SelectItem value="viewer">{language === 'ar' ? 'مشاهد' : 'Viewer'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
                <SelectItem value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                <TableHead>{language === 'ar' ? 'القسم' : 'Department'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'آخر نشاط' : 'Last Active'}</TableHead>
                <TableHead className="text-right">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => {
                  const role = roleConfig[user.role];
                  const status = statusConfig[user.status];
                  const StatusIcon = status.icon;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', role.color)}>
                          {language === 'ar' ? role.labelAr : role.labelEn}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.department}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-xs gap-1', status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {language === 'ar' ? status.labelAr : status.labelEn}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'تعديل' : 'Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'الصلاحيات' : 'Permissions'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'حذف' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};
