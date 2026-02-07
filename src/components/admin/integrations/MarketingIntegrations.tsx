/**
 * Marketing Integrations - Google Merchant, Meta Ads, TikTok
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationDialog } from "./IntegrationDialog";
import { ShoppingBag, Facebook, Music2 } from "lucide-react";

const MARKETING_PROVIDERS = [
  {
    provider: "google_merchant",
    nameAr: "Google Merchant Center",
    nameEn: "Google Merchant Center",
    descriptionAr: "مزامنة المنتجات مع Google Shopping",
    descriptionEn: "Sync products with Google Shopping",
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary/10",
    fields: [
      { key: "api_key", labelAr: "Merchant ID", labelEn: "Merchant ID", type: "text" as const },
      { key: "api_secret", labelAr: "API Key", labelEn: "API Key", type: "password" as const },
    ],
  },
  {
    provider: "meta_ads",
    nameAr: "Meta Ads (Facebook/Instagram)",
    nameEn: "Meta Ads (Facebook/Instagram)",
    descriptionAr: "إدارة حملات Facebook و Instagram الإعلانية",
    descriptionEn: "Manage Facebook & Instagram ad campaigns",
    icon: Facebook,
    color: "text-primary",
    bgColor: "bg-primary/10",
    fields: [
      { key: "api_key", labelAr: "App ID", labelEn: "App ID", type: "text" as const },
      { key: "api_secret", labelAr: "App Secret", labelEn: "App Secret", type: "password" as const },
      { key: "settings.access_token", labelAr: "Access Token", labelEn: "Access Token", type: "password" as const },
      { key: "settings.ad_account_id", labelAr: "Ad Account ID", labelEn: "Ad Account ID", type: "text" as const },
    ],
  },
  {
    provider: "tiktok_ads",
    nameAr: "TikTok Ads",
    nameEn: "TikTok Ads",
    descriptionAr: "إدارة حملات TikTok الإعلانية",
    descriptionEn: "Manage TikTok advertising campaigns",
    icon: Music2,
    color: "text-foreground",
    bgColor: "bg-muted",
    fields: [
      { key: "api_key", labelAr: "App ID", labelEn: "App ID", type: "text" as const },
      { key: "api_secret", labelAr: "App Secret", labelEn: "App Secret", type: "password" as const },
      { key: "settings.advertiser_id", labelAr: "Advertiser ID", labelEn: "Advertiser ID", type: "text" as const },
    ],
  },
];

export function MarketingIntegrations() {
  const { language } = useLanguage();
  const { integrations, saveIntegration, testConnection, toggleActive, isSaving } = useIntegrations();
  const [selectedProvider, setSelectedProvider] = useState<typeof MARKETING_PROVIDERS[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const marketingIntegrations = integrations?.filter(i => i.integration_type === "marketing") || [];

  const getIntegrationByProvider = (provider: string) => {
    return marketingIntegrations.find(i => i.provider === provider);
  };

  const handleConfigure = (provider: typeof MARKETING_PROVIDERS[0]) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedProvider) return;
    
    const existing = getIntegrationByProvider(selectedProvider.provider);
    
    await saveIntegration({
      ...(existing && { id: existing.id }),
      integration_type: "marketing",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKETING_PROVIDERS.map((provider) => {
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
