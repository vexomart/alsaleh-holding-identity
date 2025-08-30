import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Activity, Zap } from 'lucide-react';

interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (value: string) => void;
  filteredCount: number;
}

export const ClientsFilters: React.FC<ClientsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sectorFilter,
  onSectorFilterChange,
  filteredCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 font-tajawal">
            <Activity className="h-5 w-5 text-primary" />
            قائمة العملاء
          </h3>
          <p className="text-sm text-muted-foreground font-tajawal">إدارة ومتابعة بيانات العملاء مع التحكم الفوري</p>
        </div>
        <Badge variant="outline" className="gap-1 font-tajawal">
          <Zap className="h-3 w-3" />
          {filteredCount} عميل
        </Badge>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث عن عميل..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 font-tajawal"
            dir="rtl"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full lg:w-48 font-tajawal">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
            <SelectItem value="blocked">محظور</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sectorFilter} onValueChange={onSectorFilterChange}>
          <SelectTrigger className="w-full lg:w-48 font-tajawal">
            <SelectValue placeholder="الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأدوار</SelectItem>
            <SelectItem value="client">عميل</SelectItem>
            <SelectItem value="admin">مدير</SelectItem>
            <SelectItem value="superadmin">مدير عام</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};