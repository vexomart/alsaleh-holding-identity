/**
 * Customer Profile Page - Complete Redesign
 * Premium tabbed interface with all profile sections
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  ProfileHeader,
  ProfileTabs,
  ProfileTabId,
  PersonalInfoForm,
  SecurityForm,
  PreferencesForm,
  NotificationsSettings,
} from "./profile";
import { CustomerWalletCard } from "./wallet/CustomerWalletCard";

export function CustomerProfile() {
  const { language, setLanguage } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileTabId>("info");

  const handleLanguageChange = (lang: "ar" | "en") => {
    setLanguage(lang);
  };

  const renderTabContent = () => {
    const contentVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    };

    switch (activeTab) {
      case "info":
        return (
          <motion.div
            key="info"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <PersonalInfoForm
              userId={user?.id || ""}
              initialData={{
                fullName: profile?.full_name || "",
                email: profile?.email || user?.email || "",
                phone: profile?.phone || "",
              }}
            />
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            key="security"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <SecurityForm />
          </motion.div>
        );

      case "wallet":
        return (
          <motion.div
            key="wallet"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CustomerWalletCard />
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div
            key="notifications"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <NotificationsSettings userId={user?.id || ""} />
          </motion.div>
        );

      case "preferences":
        return (
          <motion.div
            key="preferences"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <PreferencesForm
              userId={user?.id || ""}
              initialLanguage={profile?.preferred_language || "ar"}
              onLanguageChange={handleLanguageChange}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Profile Header */}
      <ProfileHeader
        fullName={profile?.full_name || ""}
        email={profile?.email || user?.email || ""}
        phone={profile?.phone}
        avatarUrl={profile?.avatar_url}
        clientId={(profile as any)?.client_id}
        isVerified={profile?.is_kyc_verified}
        memberSince={user?.created_at}
      />

      {/* Navigation Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
