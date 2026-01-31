/**
 * Customer Services Page
 * Browse available services with CTA
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, fetchCustomerServicesByCategory, type Service, type ServicesByCategory } from "@/lib/api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Star,
  CheckCircle,
  Sparkles,
  Tag,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function CustomerServices() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<ServicesByCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allServices, byCategory] = await Promise.all([
          fetchCustomerServices(),
          fetchCustomerServicesByCategory(),
        ]);
        setServices(allServices);
        setServicesByCategory(byCategory);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: isRTL ? "خطأ في جلب الخدمات" : "Error fetching services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isRTL]);

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return isRTL ? "اتصل للسعر" : "Contact for price";
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRequestService = (service: Service) => {
    toast({
      title: isRTL ? "طلب الخدمة" : "Request Service",
      description: isRTL 
        ? `تم اختيار خدمة: ${service.name_ar || service.name}` 
        : `Selected service: ${service.name}`,
    });
    // TODO: Navigate to order creation with pre-selected service
    navigate("/app/orders");
  };

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const categories = ["all", ...new Set(services.map(s => s.category).filter(Boolean))] as string[];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          {isRTL ? "خدماتنا" : "Our Services"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isRTL
            ? `${services.length} خدمة متاحة`
            : `${services.length} services available`}
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className={cn(
                "px-4 py-2 rounded-full border transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-accent border-border"
              )}
            >
              {category === "all"
                ? isRTL ? "جميع الخدمات" : "All Services"
                : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? "لا توجد خدمات" : "No Services Found"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? "لا توجد خدمات في هذه الفئة حالياً"
                    : "No services available in this category"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow group">
                    {/* Service Image or Gradient */}
                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      {service.category && (
                        <Badge className="absolute top-3 end-3 bg-background/90 text-foreground">
                          {service.category}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="flex-1 p-4 flex flex-col">
                      {/* Title & Description */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {isRTL ? service.name_ar || service.name : service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {isRTL
                            ? service.short_description_ar || service.description_ar || service.description
                            : service.short_description || service.description}
                        </p>
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(service.price, service.currency)}
                            </p>
                            {service.include_vat && service.price && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-emerald-500" />
                                {isRTL ? "شامل الضريبة" : "VAT Included"}
                              </p>
                            )}
                            {!service.include_vat && service.price && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {isRTL ? "+ 15% ضريبة" : "+ 15% VAT"}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRequestService(service)}
                          className="w-full gap-2 group-hover:bg-primary/90"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {isRTL ? "اطلب الخدمة" : "Request Service"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
