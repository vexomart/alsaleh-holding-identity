/**
 * Entities Tab - إدارة الكيانات
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Eye, User, Building2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_CONFIG, KYC_STATUS_CONFIG, EntityType, KYCStatus } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function EntitiesTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: entities, isLoading } = useQuery({
    queryKey: ["admin-entities", typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("entities")
        .select(`
          *,
          finance_profile:finance_profiles(kyc_status, risk_level, credit_limit_sar)
        `)
        .order("created_at", { ascending: false });

      if (typeFilter && typeFilter !== "all") {
        query = query.eq("entity_type", typeFilter as EntityType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredEntities = entities?.filter((entity) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      entity.legal_name_ar?.toLowerCase().includes(searchLower) ||
      entity.cr_number?.toLowerCase().includes(searchLower) ||
      entity.national_id?.toLowerCase().includes(searchLower)
    );
  });

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case "individual":
        return <User className="h-4 w-4" />;
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "institution":
        return <Landmark className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>الكيانات المسجلة</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 w-[200px]"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="individual">فرد</SelectItem>
                <SelectItem value="company">شركة</SelectItem>
                <SelectItem value="institution">مؤسسة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEntities?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد كيانات
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table dir="rtl" className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right whitespace-nowrap">الكيان</TableHead>
                  <TableHead className="text-right whitespace-nowrap">النوع</TableHead>
                  <TableHead className="text-right whitespace-nowrap">الرقم التعريفي</TableHead>
                  <TableHead className="text-right whitespace-nowrap">حالة KYC</TableHead>
                  <TableHead className="text-right whitespace-nowrap">مستوى المخاطر</TableHead>
                  <TableHead className="text-right whitespace-nowrap">الحد الائتماني</TableHead>
                  <TableHead className="text-right whitespace-nowrap">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities?.map((entity) => {
                  const typeConfig = ENTITY_TYPE_CONFIG[entity.entity_type as EntityType];
                  const kycStatus = entity.finance_profile?.[0]?.kyc_status as KYCStatus;
                  const kycConfig = kycStatus ? KYC_STATUS_CONFIG[kycStatus] : null;
                  const riskLevel = entity.finance_profile?.[0]?.risk_level;

                  return (
                    <TableRow key={entity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEntityIcon(entity.entity_type as EntityType)}
                          <span className="font-medium">{entity.legal_name_ar}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {typeConfig?.label || entity.entity_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {entity.entity_type === "individual"
                          ? entity.national_id
                          : entity.cr_number || "-"}
                      </TableCell>
                      <TableCell>
                        {kycConfig ? (
                          <Badge
                            className={cn(
                              "text-xs",
                              kycConfig.variant === "success" &&
                                "bg-green-500/10 text-green-600 border-green-200",
                              kycConfig.variant === "warning" &&
                                "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                              kycConfig.variant === "destructive" &&
                                "bg-red-500/10 text-red-600 border-red-200",
                              kycConfig.variant === "secondary" &&
                                "bg-muted text-muted-foreground"
                            )}
                          >
                            {kycConfig.label}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {riskLevel ? (
                          <Badge
                            className={cn(
                              "text-xs",
                              riskLevel === "low" &&
                                "bg-green-500/10 text-green-600 border-green-200",
                              riskLevel === "medium" &&
                                "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                              riskLevel === "high" &&
                                "bg-red-500/10 text-red-600 border-red-200"
                            )}
                          >
                            {riskLevel === "low"
                              ? "منخفض"
                              : riskLevel === "medium"
                              ? "متوسط"
                              : "مرتفع"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entity.finance_profile?.[0]?.credit_limit_sar
                          ? `${entity.finance_profile[0].credit_limit_sar.toLocaleString("ar-SA")} ر.س`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
