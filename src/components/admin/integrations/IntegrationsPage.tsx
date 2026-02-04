/**
 * Integrations Management Page - Admin
 * Main hub for all external service integrations
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link2, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { MarketingIntegrations } from "./MarketingIntegrations";
import { PaymentIntegrations } from "./PaymentIntegrations";
import { SmsIntegrations } from "./SmsIntegrations";
import { AnalyticsIntegrations } from "./AnalyticsIntegrations";
import { useIntegrations } from "@/hooks/useIntegrations";
import { motion } from "framer-motion";

export function IntegrationsPage() {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("marketing");
  const { integrations, isLoading } = useIntegrations();

  const tabs = [
    {
      id: "marketing",
      labelAr: "التسويق",
      labelEn: "Marketing",
      icon: ShoppingBag,
      description: {
        ar: "Google Merchant, Meta Ads, TikTok",
        en: "Google Merchant, Meta Ads, TikTok"
      },
      connectedCount: integrations?.filter(i => i.integration_type === 'marketing' && i.is_connected).length || 0
    },
    {
      id: "payment",
      labelAr: "بوابات الدفع",
      labelEn: "Payment Gateways",
      icon: CreditCard,
      description: {
        ar: "Paylink, Tap, Moyasar",
        en: "Paylink, Tap, Moyasar"
      },
      connectedCount: integrations?.filter(i => i.integration_type === 'payment' && i.is_connected).length || 0
    },
    {
      id: "sms",
      labelAr: "الرسائل النصية",
      labelEn: "SMS Services",
      icon: MessageSquare,
      description: {
        ar: "Twilio, Unifonic, Rabet",
        en: "Twilio, Unifonic, Rabet"
      },
      connectedCount: integrations?.filter(i => i.integration_type === 'sms' && i.is_connected).length || 0
    },
    {
      id: "analytics",
      labelAr: "الإحصائيات",
      labelEn: "Analytics",
      icon: BarChart3,
      description: {
        ar: "Google Analytics, Mixpanel",
        en: "Google Analytics, Mixpanel"
      },
      connectedCount: integrations?.filter(i => i.integration_type === 'analytics' && i.is_connected).length || 0
    }
  ];

  const totalConnected = integrations?.filter(i => i.is_connected).length || 0;
  const totalIntegrations = integrations?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            {language === "ar" ? "إدارة التكاملات" : "Integrations Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" 
              ? "ربط الخدمات الخارجية لتوسيع إمكانيات المنصة"
              : "Connect external services to expand platform capabilities"
            }
          </p>
        </div>
        
        {/* Status Overview */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "التكاملات النشطة" : "Active Integrations"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalConnected} / {totalIntegrations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 bg-card hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">
                  {language === "ar" ? tab.labelAr : tab.labelEn}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? tab.description.ar : tab.description.en}
              </p>
              {tab.connectedCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5">
                  {tab.connectedCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="marketing" className="mt-0">
            <MarketingIntegrations />
          </TabsContent>
          
          <TabsContent value="payment" className="mt-0">
            <PaymentIntegrations />
          </TabsContent>
          
          <TabsContent value="sms" className="mt-0">
            <SmsIntegrations />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <AnalyticsIntegrations />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}

export default IntegrationsPage;
