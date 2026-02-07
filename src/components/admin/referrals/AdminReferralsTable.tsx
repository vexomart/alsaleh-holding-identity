/**
 * Admin Referrals Table with Filters
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Referral, ReferralStatus } from '@/types/referrals';
import { 
  REFERRAL_STATUS_LABELS, 
  REFERRAL_STATUS_COLORS,
  REFERRAL_STATUS_ORDER
} from '@/types/referrals';

interface AdminReferralsTableProps {
  referrals: Referral[];
  onSelectReferral: (id: string) => void;
  onUpdateStatus: (id: string, status: ReferralStatus) => void;
  statusFilter?: ReferralStatus;
  onStatusFilterChange: (status: ReferralStatus | undefined) => void;
}

export function AdminReferralsTable({ 
  referrals, 
  onSelectReferral,
  onUpdateStatus,
  statusFilter,
  onStatusFilterChange
}: AdminReferralsTableProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            جدول الإحالات
          </CardTitle>
          
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={statusFilter || 'all'} 
              onValueChange={(v) => onStatusFilterChange(v === 'all' ? undefined : v as ReferralStatus)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {REFERRAL_STATUS_ORDER.map(status => (
                  <SelectItem key={status} value={status}>
                    {REFERRAL_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-right">المُحيل</TableHead>
                <TableHead className="text-right">المُحال</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">تحذيرات</TableHead>
                <TableHead className="text-right w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد إحالات</p>
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((referral, index) => {
                  const hasFraudFlags = (referral.fraud_flags as string[])?.length > 0;
                  
                  return (
                    <motion.tr
                      key={referral.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                        hasFraudFlags ? 'bg-destructive/5 dark:bg-destructive/10' : ''
                      }`}
                    >
                      <TableCell>
                        <div className="font-mono text-sm" dir="ltr">
                          {referral.referrer_user_id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {referral.referred_name || referral.referred_email || (
                          <span className="text-muted-foreground">بانتظار التسجيل</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={REFERRAL_STATUS_COLORS[referral.status as ReferralStatus]}
                        >
                          {REFERRAL_STATUS_LABELS[referral.status as ReferralStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(referral.created_at), 'dd/MM/yyyy', { locale: ar })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {hasFraudFlags ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {(referral.fraud_flags as string[]).length}
                          </Badge>
                        ) : (
                          <span className="text-accent text-sm">✓ سليم</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSelectReferral(referral.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {referral.status !== 'qualified' && referral.status !== 'reward_paid' && (
                                <DropdownMenuItem 
                                  onClick={() => onUpdateStatus(referral.id, 'qualified')}
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-accent" />
                                  تأهيل للمكافأة
                                </DropdownMenuItem>
                              )}
                              {referral.status !== 'rejected' && (
                                <DropdownMenuItem 
                                  onClick={() => onUpdateStatus(referral.id, 'rejected')}
                                  className="gap-2 text-destructive"
                                >
                                  <XCircle className="h-4 w-4" />
                                  رفض الإحالة
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
