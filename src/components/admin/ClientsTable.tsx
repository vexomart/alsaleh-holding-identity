import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
  Settings,
  UserX,
  Activity,
  CircleCheck,
  CircleX,
  CirclePause,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Crown,
  Banknote,
  UserCheck,
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
  address?: string;
  status: 'pending' | 'active' | 'inactive' | 'blocked';
  role: string;
  kyc_status: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  verified_at?: string;
}

interface ClientsTableProps {
  clients: Client[];
  onlineStatuses: Record<string, { is_online: boolean; last_seen: string }>;
  onViewDetails: (client: Client) => void;
  onStatusChange: (clientId: string, newStatus: string) => void;
  onKycStatusChange: (clientId: string, newKycStatus: string) => void;
  onTwoFactorToggle: (clientId: string, enabled: boolean) => void;
  realtimeEnabled: boolean;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onlineStatuses,
  onViewDetails,
  onStatusChange,
  onKycStatusChange,
  onTwoFactorToggle,
  realtimeEnabled,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'inactive': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
      case 'blocked': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CircleCheck className="h-3.5 w-3.5" />;
      case 'inactive': return <CirclePause className="h-3.5 w-3.5" />;
      case 'pending': return <Clock className="h-3.5 w-3.5" />;
      case 'blocked': return <CircleX className="h-3.5 w-3.5" />;
      default: return <CirclePause className="h-3.5 w-3.5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      case 'blocked': return 'محظور';
      default: return status;
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      case 'unverified': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <ShieldCheck className="h-3.5 w-3.5" />;
      case 'pending': return <ShieldAlert className="h-3.5 w-3.5" />;
      case 'rejected': return <ShieldX className="h-3.5 w-3.5" />;
      case 'unverified': return <Shield className="h-3.5 w-3.5" />;
      default: return <Shield className="h-3.5 w-3.5" />;
    }
  };

  const getKycStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'موثق';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      case 'unverified': return 'غير موثق';
      default: return status;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'superadmin': return <Crown className="h-4 w-4 text-red-600" />;
      case 'finance': return <Banknote className="h-4 w-4 text-green-600" />;
      case 'client': return <UserCheck className="h-4 w-4 text-blue-600" />;
      default: return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'client': return 'عميل';
      case 'admin': return 'مدير';
      case 'superadmin': return 'مدير عام';
      case 'finance': return 'مالية';
      default: return role;
    }
  };

  const getOnlineStatusBadge = (clientId: string) => {
    const status = onlineStatuses[clientId];
    if (!status) return null;

    if (status.is_online) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200 dark:bg-green-900/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700 font-tajawal">متصل</span>
        </div>
      );
    } else {
      const lastSeen = new Date(status.last_seen);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      let timeText = '';
      if (diffInMinutes < 1) {
        timeText = 'الآن';
      } else if (diffInMinutes < 60) {
        timeText = `${diffInMinutes}د`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        timeText = `${hours}س`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        timeText = `${days}ي`;
      }

      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-200 dark:bg-gray-900/30">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600 font-tajawal">{timeText}</span>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="text-right font-tajawal font-semibold min-w-[200px] whitespace-nowrap">المستخدم</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[250px] whitespace-nowrap">معلومات الاتصال</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[150px] whitespace-nowrap">الدور</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[200px] whitespace-nowrap">الحالة والتوثيق</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[130px] whitespace-nowrap">الاتصال</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[150px] whitespace-nowrap">تاريخ التسجيل</TableHead>
                <TableHead className="text-right font-tajawal font-semibold min-w-[120px] whitespace-nowrap">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/30 transition-all duration-200 group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
                        <AvatarImage src={client.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold font-tajawal">
                          {client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-tajawal font-semibold text-sm truncate">{client.name}</p>
                          {realtimeEnabled && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                          )}
                        </div>
                        {client.company_name && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground font-tajawal truncate">{client.company_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 flex-shrink-0">
                          <Mail className="h-3 w-3" />
                        </div>
                        <span className="font-tajawal text-xs truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="p-1.5 rounded-md bg-green-50 text-green-600 dark:bg-green-900/30 flex-shrink-0">
                            <Phone className="h-3 w-3" />
                          </div>
                          <span className="font-tajawal text-xs">{client.phone}</span>
                        </div>
                      )}
                      {client.last_login_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 flex-shrink-0">
                            <Activity className="h-3 w-3" />
                          </div>
                          <span className="font-tajawal text-xs">
                            {new Date(client.last_login_at).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(client.role)}
                        <Badge variant="outline" className="font-tajawal text-xs">
                          {getRoleText(client.role)}
                        </Badge>
                      </div>
                      {client.two_factor_enabled && (
                        <div className="flex items-center gap-1">
                          <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30">
                            <Shield className="h-3 w-3" />
                          </div>
                          <Badge variant="secondary" className="text-xs font-tajawal">
                            2FA
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${getStatusColor(client.status).includes('emerald') ? 'bg-emerald-100 text-emerald-700' : 
                                       getStatusColor(client.status).includes('red') ? 'bg-red-100 text-red-700' :
                                       getStatusColor(client.status).includes('amber') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                          {getStatusIcon(client.status)}
                        </div>
                        <Badge className={`${getStatusColor(client.status)} border font-tajawal text-xs`}>
                          {getStatusText(client.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${getKycStatusColor(client.kyc_status).includes('emerald') ? 'bg-emerald-100 text-emerald-700' : 
                                       getKycStatusColor(client.kyc_status).includes('red') ? 'bg-red-100 text-red-700' :
                                       getKycStatusColor(client.kyc_status).includes('amber') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                          {getKycStatusIcon(client.kyc_status)}
                        </div>
                        <Badge variant="outline" className={`${getKycStatusColor(client.kyc_status)} border text-xs font-tajawal`}>
                          {getKycStatusText(client.kyc_status)}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex flex-col items-start gap-1">
                      {getOnlineStatusBadge(client.id)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30">
                        <Calendar className="h-3 w-3" />
                      </div>
                      <span className="font-tajawal text-xs">
                        {new Date(client.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewDetails(client)}>
                          <Eye className="mr-2 h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onStatusChange(client.id, client.status === 'active' ? 'inactive' : 'active')}>
                          {client.status === 'active' ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4 text-yellow-600" />
                              إيقاف الحساب
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              تفعيل الحساب
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onKycStatusChange(client.id, client.kyc_status === 'verified' ? 'unverified' : 'verified')}>
                          <Shield className="mr-2 h-4 w-4 text-blue-600" />
                          {client.kyc_status === 'verified' ? 'إلغاء التوثيق' : 'توثيق الحساب'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTwoFactorToggle(client.id, !client.two_factor_enabled)}>
                          <Settings className="mr-2 h-4 w-4 text-purple-600" />
                          {client.two_factor_enabled ? 'إيقاف المصادقة الثنائية' : 'تفعيل المصادقة الثنائية'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onStatusChange(client.id, 'blocked')}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          حظر نهائي
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};