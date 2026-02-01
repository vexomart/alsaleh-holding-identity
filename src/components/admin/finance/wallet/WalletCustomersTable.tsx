/**
 * Wallet Customers Table - Premium Banking Design
 * Modern data table with search and filters
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  User,
  Wallet,
  Eye,
  Plus,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerWallet } from "@/types/financial";

interface CustomerWithWallet {
  id: string;
  customer_uid: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  wallet?: CustomerWallet;
}

interface WalletCustomersTableProps {
  customers: CustomerWithWallet[];
  isLoading: boolean;
  onSelectCustomer: (customer: CustomerWithWallet) => void;
  onCreateWallet: (customerId: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function WalletCustomersTable({
  customers,
  isLoading,
  onSelectCustomer,
  onCreateWallet,
}: WalletCustomersTableProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const copyUid = async (uid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(uid);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.customer_uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.wallet?.wallet_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "with_wallet" && c.wallet) ||
        (statusFilter === "without_wallet" && !c.wallet) ||
        (statusFilter === "active" && c.wallet?.status === "active") ||
        (statusFilter === "frozen" && c.wallet?.status === "frozen");

      return matchesSearch && matchesStatus;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "balance":
          comparison = Number(a.wallet?.balance || 0) - Number(b.wallet?.balance || 0);
          break;
        case "name":
          comparison = (a.full_name || "").localeCompare(b.full_name || "");
          break;
        case "date":
          comparison = new Date(a.wallet?.created_at || 0).getTime() -
            new Date(b.wallet?.created_at || 0).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (field: "balance" | "name" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isRTL ? "محافظ العملاء" : "Customer Wallets"}
            <Badge variant="secondary" className="ms-2">
              {filteredCustomers.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 me-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                <SelectItem value="with_wallet">{isRTL ? "لديهم محفظة" : "With Wallet"}</SelectItem>
                <SelectItem value="without_wallet">{isRTL ? "بدون محفظة" : "No Wallet"}</SelectItem>
                <SelectItem value="active">{isRTL ? "نشطة" : "Active"}</SelectItem>
                <SelectItem value="frozen">{isRTL ? "مجمدة" : "Frozen"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            placeholder={isRTL 
              ? "بحث برقم العميل، البريد، الاسم، رقم المحفظة..." 
              : "Search by UID, email, name, wallet number..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={cn("h-11", isRTL ? "pr-10" : "pl-10")}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className={cn("min-w-[200px]", isRTL ? "text-right" : "text-left")}>
                      <button
                        onClick={() => toggleSort("name")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {isRTL ? "العميل" : "Customer"}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className={cn("min-w-[140px]", isRTL ? "text-right" : "text-left")}>
                      {isRTL ? "رقم المحفظة" : "Wallet #"}
                    </TableHead>
                    <TableHead className={cn("min-w-[120px]", isRTL ? "text-right" : "text-left")}>
                      <button
                        onClick={() => toggleSort("balance")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {isRTL ? "الرصيد" : "Balance"}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className={cn("min-w-[100px]", isRTL ? "text-right" : "text-left")}>
                      {isRTL ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className={cn("min-w-[100px]", isRTL ? "text-right" : "text-left")}>
                      {isRTL ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <User className="h-10 w-10 opacity-30" />
                          <span>{isRTL ? "لا توجد نتائج" : "No results found"}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group border-b hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {customer.full_name || (isRTL ? "عميل" : "Customer")}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{customer.email}</span>
                              </div>
                              {customer.customer_uid && (
                                <button
                                  onClick={(e) => copyUid(customer.customer_uid!, e)}
                                  className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-0.5 font-mono"
                                >
                                  {customer.customer_uid}
                                  {copiedUid === customer.customer_uid ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.wallet ? (
                            <span className="font-mono text-sm bg-muted px-2 py-1 rounded" dir="ltr">
                              {customer.wallet.wallet_number}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {customer.wallet ? (
                            <span className={cn(
                              "font-bold",
                              Number(customer.wallet.balance) > 0 ? "text-emerald-600" : "text-muted-foreground"
                            )} dir="ltr">
                              {formatCurrency(Number(customer.wallet.balance))}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {customer.wallet ? (
                            <Badge
                              variant="outline"
                              className={cn(
                                customer.wallet.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              )}
                            >
                              {customer.wallet.status === "active"
                                ? (isRTL ? "نشطة" : "Active")
                                : (isRTL ? "مجمدة" : "Frozen")}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                              {isRTL ? "لا توجد" : "No wallet"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {customer.wallet ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCustomer(customer);
                                }}
                                className="gap-1.5"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                  {isRTL ? "عرض" : "View"}
                                </span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCreateWallet(customer.id);
                                }}
                                className="gap-1.5"
                              >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                  {isRTL ? "إنشاء" : "Create"}
                                </span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? `عرض ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} من ${filteredCustomers.length}`
                    : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of ${filteredCustomers.length}`}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
