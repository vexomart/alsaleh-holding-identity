/**
 * Payment Gateway Integrations - Paylink, Tap, Moyasar
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationDialog } from "./IntegrationDialog";
import { CreditCard, Wallet, Banknote } from "lucide-react";

const PAYMENT_PROVIDERS = [
  {
    provider: "paylink",
    nameAr: "Paylink",
    nameEn: "Paylink",
    descriptionAr: "بوابة الدفع السعودية - بطاقات ومدى وApple Pay",
    descriptionEn: "Saudi payment gateway - Cards, Mada & Apple Pay",
    icon: CreditCard,
    color: "text-accent",
    bgColor: "bg-accent/10",
    fields: [
      { key: "api_key", labelAr: "Vendor ID", labelEn: "Vendor ID", type: "text" as const },
      { key: "api_secret", labelAr: "Vendor Secret", labelEn: "Vendor Secret", type: "password" as const },
      { key: "webhook_url", labelAr: "Webhook URL", labelEn: "Webhook URL", type: "text" as const, readonly: true },
      { key: "settings.environment", labelAr: "البيئة", labelEn: "Environment", type: "select" as const, options: [
        { value: "sandbox", labelAr: "تجريبي", labelEn: "Sandbox" },
        { value: "production", labelAr: "إنتاج", labelEn: "Production" },
      ]},
    ],
  },
  {
    provider: "tap_payments",
    nameAr: "Tap Payments",
    nameEn: "Tap Payments",
    descriptionAr: "بوابة دفع متكاملة للخليج - بطاقات و KNET و Apple Pay",
    descriptionEn: "GCC payment gateway - Cards, KNET & Apple Pay",
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/10",
    fields: [
      { key: "api_key", labelAr: "Public Key", labelEn: "Public Key", type: "text" as const },
      { key: "api_secret", labelAr: "Secret Key", labelEn: "Secret Key", type: "password" as const },
      { key: "webhook_url", labelAr: "Webhook URL", labelEn: "Webhook URL", type: "text" as const, readonly: true },
      { key: "settings.merchant_id", labelAr: "Merchant ID", labelEn: "Merchant ID", type: "text" as const },
    ],
  },
  {
    provider: "moyasar",
    nameAr: "Moyasar",
    nameEn: "Moyasar",
    descriptionAr: "بوابة دفع سعودية حديثة - دعم شامل لجميع طرق الدفع",
    descriptionEn: "Modern Saudi payment gateway - Full payment support",
    icon: Banknote,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    fields: [
      { key: "api_key", labelAr: "Publishable Key", labelEn: "Publishable Key", type: "text" as const },
      { key: "api_secret", labelAr: "Secret Key", labelEn: "Secret Key", type: "password" as const },
      { key: "webhook_url", labelAr: "Webhook URL", labelEn: "Webhook URL", type: "text" as const, readonly: true },
    ],
  },
];

export function PaymentIntegrations() {
  const { language } = useLanguage();
  const { integrations, saveIntegration, testConnection, toggleActive, isSaving } = useIntegrations();
  const [selectedProvider, setSelectedProvider] = useState<typeof PAYMENT_PROVIDERS[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const paymentIntegrations = integrations?.filter(i => i.integration_type === "payment") || [];

  const getIntegrationByProvider = (provider: string) => {
    return paymentIntegrations.find(i => i.provider === provider);
  };

  const handleConfigure = (provider: typeof PAYMENT_PROVIDERS[0]) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedProvider) return;
    
    const existing = getIntegrationByProvider(selectedProvider.provider);
    
    // Generate webhook URL
    const webhookUrl = `${window.location.origin}/api/webhooks/${selectedProvider.provider}`;
    
    await saveIntegration({
      ...(existing && { id: existing.id }),
      integration_type: "payment",
      provider: selectedProvider.provider,
      name_ar: selectedProvider.nameAr,
      name_en: selectedProvider.nameEn,
      webhook_url: webhookUrl,
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
        {PAYMENT_PROVIDERS.map((provider) => {
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
