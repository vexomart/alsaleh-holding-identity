/**
 * Profile Header - Premium Hero Section
 * Displays user avatar, name, and quick stats
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  ShieldCheck, 
  Calendar, 
  Mail,
  Phone,
  Sparkles,
  Edit3,
  CheckCircle2
} from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  clientId?: string;
  isVerified?: boolean;
  memberSince?: string;
  onAvatarChange?: (file: File) => void;
}

export function ProfileHeader({
  fullName,
  email,
  phone,
  avatarUrl,
  clientId,
  isVerified = false,
  memberSince,
  onAvatarChange,
}: ProfileHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return isRTL ? "غير محدد" : "Not set";
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
    }).format(new Date(dateString));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 end-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Gold Accent Line */}
      <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              animate={{ scale: isHovering ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-3xl font-bold bg-white/20 text-white">
                  {getInitials(fullName || email)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            {/* Avatar Upload Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-8 w-8 text-white" />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Verified Badge */}
            {isVerified && (
              <div className="absolute -bottom-1 -end-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-start">
            {/* Name & Badges */}
            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {fullName || (isRTL ? "مستخدم" : "User")}
              </h1>
              <div className="flex items-center gap-2">
                {isVerified && (
                  <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {isRTL ? "موثق" : "Verified"}
                  </Badge>
                )}
                <Badge className="bg-amber-400/20 text-amber-100 border-amber-400/30 gap-1">
                  <Sparkles className="h-3 w-3" />
                  {isRTL ? "عميل مميز" : "Premium"}
                </Badge>
              </div>
            </div>

            {/* Client ID */}
            {clientId && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
                <span className="text-white/70 text-sm">
                  {isRTL ? "رقم العميل:" : "Client ID:"}
                </span>
                <span dir="ltr" className="font-mono text-sm font-semibold text-amber-300 ltr-token">
                  {clientId}
                </span>
              </div>
            )}

            {/* Contact Info Grid */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="h-4 w-4 text-amber-300" />
                <span dir="ltr" className="ltr-token">{email}</span>
              </div>
              {phone && (
                <div className="flex items-center gap-2 text-white/80">
                  <Phone className="h-4 w-4 text-amber-300" />
                  <span dir="ltr" className="ltr-token">{phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4 text-amber-300" />
                <span>
                  {isRTL ? "عضو منذ " : "Member since "}
                  {formatDate(memberSince)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 w-12"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
