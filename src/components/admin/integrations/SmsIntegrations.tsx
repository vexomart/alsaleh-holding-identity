/**
 * SMS Service Integrations - Twilio, Unifonic, Rabet
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationDialog } from "./IntegrationDialog";
import { MessageSquare, Phone, Send } from "lucide-react";

const SMS_PROVIDERS = [
  {
    provider: "twilio",
    nameAr: "Twilio",
    nameEn: "Twilio",
    descriptionAr: "منصة اتصالات عالمية - SMS و WhatsApp و Voice",
    descriptionEn: "Global communication platform - SMS, WhatsApp & Voice",
    icon: MessageSquare,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    fields: [
      { key: "api_key", labelAr: "Account SID", labelEn: "Account SID", type: "text" as const },
      { key: "api_secret", labelAr: "Auth Token", labelEn: "Auth Token", type: "password" as const },
      { key: "settings.phone_number", labelAr: "رقم الإرسال", labelEn: "From Number", type: "text" as const },
      { key: "settings.messaging_service_sid", labelAr: "Messaging Service SID", labelEn: "Messaging Service SID", type: "text" as const },
    ],
  },
  {
    provider: "unifonic",
    nameAr: "Unifonic",
    nameEn: "Unifonic",
    descriptionAr: "منصة سعودية للرسائل - دعم محلي ممتاز",
    descriptionEn: "Saudi messaging platform - Excellent local support",
    icon: Phone,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    fields: [
      { key: "api_key", labelAr: "App SID", labelEn: "App SID", type: "text" as const },
      { key: "api_secret", labelAr: "Secret Key", labelEn: "Secret Key", type: "password" as const },
      { key: "settings.sender_id", labelAr: "اسم المرسل", labelEn: "Sender ID", type: "text" as const },
    ],
  },
  {
    provider: "rabet",
    nameAr: "Rabet (رابط)",
    nameEn: "Rabet",
    descriptionAr: "منصة سعودية للرسائل النصية - أسعار تنافسية",
    descriptionEn: "Saudi SMS platform - Competitive pricing",
    icon: Send,
    color: "text-accent",
    bgColor: "bg-accent/10",
    fields: [
      { key: "api_key", labelAr: "App ID", labelEn: "App ID", type: "text" as const },
      { key: "api_secret", labelAr: "App Key", labelEn: "App Key", type: "password" as const },
      { key: "settings.sender_name", labelAr: "اسم المرسل", labelEn: "Sender Name", type: "text" as const },
    ],
  },
];

export function SmsIntegrations() {
  const { language } = useLanguage();
  const { integrations, saveIntegration, testConnection, toggleActive, isSaving } = useIntegrations();
  const [selectedProvider, setSelectedProvider] = useState<typeof SMS_PROVIDERS[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const smsIntegrations = integrations?.filter(i => i.integration_type === "sms") || [];

  const getIntegrationByProvider = (provider: string) => {
    return smsIntegrations.find(i => i.provider === provider);
  };

  const handleConfigure = (provider: typeof SMS_PROVIDERS[0]) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedProvider) return;
    
    const existing = getIntegrationByProvider(selectedProvider.provider);
    
    await saveIntegration({
      ...(existing && { id: existing.id }),
      integration_type: "sms",
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
        {SMS_PROVIDERS.map((provider) => {
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
