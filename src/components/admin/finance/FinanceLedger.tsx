/**
 * Finance Ledger Tab
 * Journal entries list with drilldown lines (read-only)
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  entry_number: string;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  description_ar: string | null;
  is_posted: boolean;
  posted_at: string | null;
  created_at: string;
  lines?: JournalLine[];
}

interface JournalLine {
  id: string;
  account_id: string;
  debit: number;
  credit: number;
  currency: string;
  description: string | null;
  account?: {
    code: string;
    name_ar: string;
    name_en: string;
  };
}

export function FinanceLedger() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Map<string, { code: string; name_ar: string; name_en: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch ledger accounts
      const { data: accountsData } = await supabase
        .from("ledger_accounts")
        .select("id, code, name_ar, name_en");

      const accountsMap = new Map(
        accountsData?.map((a) => [a.id, { code: a.code, name_ar: a.name_ar, name_en: a.name_en }]) || []
      );
      setAccounts(accountsMap);

      // Fetch journal entries
      const { data: entriesData, error: entriesError } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (entriesError) throw entriesError;

      // Fetch journal lines for all entries
      const entryIds = entriesData?.map((e) => e.id) || [];
      const { data: linesData } = await supabase
        .from("journal_lines")
        .select("*")
        .in("entry_id", entryIds);

      // Group lines by entry
      const linesByEntry = new Map<string, JournalLine[]>();
      linesData?.forEach((line) => {
        const existing = linesByEntry.get(line.entry_id) || [];
        existing.push(line);
        linesByEntry.set(line.entry_id, existing);
      });

      // Enrich entries with lines
      const enrichedEntries = entriesData?.map((entry) => ({
        ...entry,
        lines: linesByEntry.get(entry.id) || [],
      })) || [];

      setEntries(enrichedEntries);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const toggleEntry = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const getReferenceTypeLabel = (type: string | null) => {
    if (!type) return "-";
    const labels: Record<string, { ar: string; en: string }> = {
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      adjustment: { ar: "تعديل", en: "Adjustment" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  const filteredEntries = entries.filter((entry) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      entry.entry_number.toLowerCase().includes(search) ||
      entry.description?.toLowerCase().includes(search) ||
      entry.description_ar?.toLowerCase().includes(search)
    );
  });

  // Stats
  const totalEntries = entries.length;
  const postedEntries = entries.filter((e) => e.is_posted).length;

  return (
    <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "إجمالي القيود" : "Total Entries"}
                </span>
                <div className="text-2xl font-bold text-primary">
                  {totalEntries}
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-4">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "القيود المرحّلة" : "Posted Entries"}
                </span>
                <div className="text-2xl font-bold text-accent">
                  {postedEntries}
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {isRTL ? "قيود اليومية" : "Journal Entries"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                placeholder={isRTL ? "بحث برقم القيد أو الوصف..." : "Search by entry number or description..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL ? "لا توجد قيود" : "No journal entries found"}
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <Collapsible
                    key={entry.id}
                    open={expandedEntries.has(entry.id)}
                    onOpenChange={() => toggleEntry(entry.id)}
                  >
                    <div className="rounded-lg border overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <div className={cn(
                          "flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "flex items-center gap-4",
                            isRTL && "flex-row-reverse"
                          )}>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <span className="font-mono text-sm font-semibold" dir="ltr">
                                {entry.entry_number}
                              </span>
                              <div className="text-xs text-muted-foreground mt-1">
                                {isRTL ? entry.description_ar : entry.description}
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "flex items-center gap-4",
                            isRTL && "flex-row-reverse"
                          )}>
                            <Badge
                              variant="outline"
                              className={cn(
                                entry.is_posted
                                  ? "bg-accent/10 text-accent border-accent/30"
                                  : "bg-secondary/10 text-secondary border-secondary/30"
                              )}
                            >
                              {entry.is_posted
                                ? (isRTL ? "مرحّل" : "Posted")
                                : (isRTL ? "معلق" : "Pending")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(entry.created_at)}
                            </span>
                            {expandedEntries.has(entry.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div dir={isRTL ? "rtl" : "ltr"} className="border-t bg-muted/20 p-4 overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className={isRTL ? "text-right" : "text-left"}>
                                  {isRTL ? "الحساب" : "Account"}
                                </TableHead>
                                <TableHead className={isRTL ? "text-right" : "text-left"}>
                                  {isRTL ? "مدين" : "Debit"}
                                </TableHead>
                                <TableHead className={isRTL ? "text-right" : "text-left"}>
                                  {isRTL ? "دائن" : "Credit"}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entry.lines?.map((line) => {
                                const account = accounts.get(line.account_id);
                                return (
                                  <TableRow key={line.id}>
                                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                                      <div className={cn(
                                        "flex items-center gap-2",
                                        isRTL && "flex-row-reverse"
                                      )}>
                                        <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                                          {account?.code || "-"}
                                        </span>
                                        <span className="text-sm">
                                          {isRTL ? account?.name_ar : account?.name_en || "-"}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                                      {Number(line.debit) > 0 && (
                                        <span className="font-semibold text-destructive" dir="ltr">
                                          {formatCurrency(Number(line.debit), line.currency)}
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className={isRTL ? "text-right" : "text-left"}>
                                      {Number(line.credit) > 0 && (
                                        <span className="font-semibold text-accent" dir="ltr">
                                          {formatCurrency(Number(line.credit), line.currency)}
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {/* Totals Row */}
                              <TableRow className="bg-muted/30 font-semibold">
                                <TableCell className={isRTL ? "text-right" : "text-left"}>
                                  {isRTL ? "المجموع" : "Total"}
                                </TableCell>
                                <TableCell className={isRTL ? "text-right" : "text-left"}>
                                  <span dir="ltr">
                                    {formatCurrency(
                                      entry.lines?.reduce((sum, l) => sum + Number(l.debit), 0) || 0
                                    )}
                                  </span>
                                </TableCell>
                                <TableCell className={isRTL ? "text-right" : "text-left"}>
                                  <span dir="ltr">
                                    {formatCurrency(
                                      entry.lines?.reduce((sum, l) => sum + Number(l.credit), 0) || 0
                                    )}
                                  </span>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
