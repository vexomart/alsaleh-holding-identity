/**
 * Integration Card Component - Displays integration status and controls
 */

import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Settings2, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import type { Integration } from "@/hooks/useIntegrations";
import type { LucideIcon } from "lucide-react";

interface ProviderConfig {
  provider: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface IntegrationCardProps {
  provider: ProviderConfig;
  integration: Integration | undefined;
  onConfigure: () => void;
  onTest: () => Promise<void>;
  onToggle: (active: boolean) => Promise<void>;
}

export function IntegrationCard({
  provider,
  integration,
  onConfigure,
  onTest,
  onToggle,
}: IntegrationCardProps) {
  const { language, isRTL } = useLanguage();
  const [isTesting, setIsTesting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const Icon = provider.icon;
  const isConnected = integration?.is_connected;
  const isActive = integration?.is_active;
  const hasCredentials = Boolean(integration?.api_key);
  const lastSync = integration?.last_sync_at;
  const lastError = integration?.last_error;

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTest();
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggle(checked);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusBadge = () => {
    if (!hasCredentials) {
      return (
        <Badge variant="outline" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {language === "ar" ? "غير مُعد" : "Not Configured"}
        </Badge>
      );
    }
    if (isConnected) {
      return (
        <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" />
          {language === "ar" ? "متصل" : "Connected"}
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        {language === "ar" ? "غير متصل" : "Disconnected"}
      </Badge>
    );
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-md",
      isActive && isConnected && "ring-1 ring-emerald-500/30"
    )}>
      {/* Status indicator bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        isConnected && isActive ? "bg-emerald-500" : 
        hasCredentials ? "bg-amber-500" : "bg-muted"
      )} />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
              provider.bgColor
            )}>
              <Icon className={cn("h-5 w-5", provider.color)} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {language === "ar" ? provider.nameAr : provider.nameEn}
              </CardTitle>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {language === "ar" ? provider.descriptionAr : provider.descriptionEn}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Last sync info */}
        {lastSync && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {language === "ar" ? "آخر مزامنة: " : "Last sync: "}
              {format(new Date(lastSync), "PPp", { locale: language === "ar" ? ar : undefined })}
            </span>
          </div>
        )}

        {/* Error message */}
        {lastError && (
          <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{lastError}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onConfigure}
              className="gap-1.5"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {language === "ar" ? "إعداد" : "Configure"}
            </Button>
            
            {hasCredentials && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTest}
                disabled={isTesting}
                className="gap-1.5"
              >
                {isTesting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {language === "ar" ? "اختبار" : "Test"}
              </Button>
            )}
          </div>

          {hasCredentials && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isActive 
                  ? (language === "ar" ? "نشط" : "Active")
                  : (language === "ar" ? "متوقف" : "Inactive")
                }
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isToggling || !isConnected}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
