/**
 * Analytics Integrations - Google Analytics, Mixpanel, Hotjar
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationDialog } from "./IntegrationDialog";
import { BarChart3, Activity, MousePointer2, TrendingUp } from "lucide-react";

const ANALYTICS_PROVIDERS = [
  {
    provider: "google_analytics",
    nameAr: "Google Analytics 4",
    nameEn: "Google Analytics 4",
    descriptionAr: "تحليلات شاملة للزوار والسلوك على الموقع",
    descriptionEn: "Comprehensive visitor and behavior analytics",
    icon: BarChart3,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    fields: [
      { key: "api_key", labelAr: "Measurement ID", labelEn: "Measurement ID", type: "text" as const, placeholder: "G-XXXXXXXXXX" },
      { key: "api_secret", labelAr: "API Secret", labelEn: "API Secret", type: "password" as const },
      { key: "settings.property_id", labelAr: "Property ID", labelEn: "Property ID", type: "text" as const },
    ],
  },
  {
    provider: "mixpanel",
    nameAr: "Mixpanel",
    nameEn: "Mixpanel",
    descriptionAr: "تحليلات متقدمة للأحداث وسلوك المستخدمين",
    descriptionEn: "Advanced event and user behavior analytics",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
    fields: [
      { key: "api_key", labelAr: "Project Token", labelEn: "Project Token", type: "text" as const },
      { key: "api_secret", labelAr: "API Secret", labelEn: "API Secret", type: "password" as const },
    ],
  },
  {
    provider: "hotjar",
    nameAr: "Hotjar",
    nameEn: "Hotjar",
    descriptionAr: "خرائط حرارية وتسجيلات فيديو لسلوك المستخدمين",
    descriptionEn: "Heatmaps and session recordings for user behavior",
    icon: MousePointer2,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    fields: [
      { key: "api_key", labelAr: "Site ID", labelEn: "Site ID", type: "text" as const },
      { key: "settings.hotjar_version", labelAr: "Hotjar Version", labelEn: "Hotjar Version", type: "text" as const, placeholder: "6" },
    ],
  },
  {
    provider: "clarity",
    nameAr: "Microsoft Clarity",
    nameEn: "Microsoft Clarity",
    descriptionAr: "أداة مجانية لتحليل سلوك المستخدمين من Microsoft",
    descriptionEn: "Free user behavior analytics tool from Microsoft",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    fields: [
      { key: "api_key", labelAr: "Project ID", labelEn: "Project ID", type: "text" as const },
    ],
  },
];

export function AnalyticsIntegrations() {
  const { language } = useLanguage();
  const { integrations, saveIntegration, testConnection, toggleActive, isSaving } = useIntegrations();
  const [selectedProvider, setSelectedProvider] = useState<typeof ANALYTICS_PROVIDERS[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const analyticsIntegrations = integrations?.filter(i => i.integration_type === "analytics") || [];

  const getIntegrationByProvider = (provider: string) => {
    return analyticsIntegrations.find(i => i.provider === provider);
  };

  const handleConfigure = (provider: typeof ANALYTICS_PROVIDERS[0]) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedProvider) return;
    
    const existing = getIntegrationByProvider(selectedProvider.provider);
    
    await saveIntegration({
      ...(existing && { id: existing.id }),
      integration_type: "analytics",
      provider: selectedProvider.provider,
      name_ar: selectedProvider.nameAr,
      name_en: selectedProvider.nameEn,
      ...data,
    });
    
    setDialogOpen(false);
  };

  const handleTest = async (provider: string) => {
    const integration = getIntegrationByProvider(provider);
    if (integration) {
      await testConnection(integration.id);
    }
  };

  const handleToggle = async (provider: string, active: boolean) => {
    const integration = getIntegrationByProvider(provider);
    if (integration) {
      await toggleActive(integration.id, active);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ANALYTICS_PROVIDERS.map((provider) => {
          const integration = getIntegrationByProvider(provider.provider);
          
          return (
            <IntegrationCard
              key={provider.provider}
              provider={provider}
              integration={integration}
              onConfigure={() => handleConfigure(provider)}
              onTest={() => handleTest(provider.provider)}
              onToggle={(active) => handleToggle(provider.provider, active)}
            />
          );
        })}
      </div>

      {selectedProvider && (
        <IntegrationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          provider={selectedProvider}
          integration={getIntegrationByProvider(selectedProvider.provider)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
