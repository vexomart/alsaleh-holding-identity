/**
 * HeaderTopBar - Premium Enterprise Info Bar
 * Displays contact info, working hours, status, and quick links
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Mail, Phone, Globe, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function HeaderTopBar() {
  return (
    <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-10 bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border-b border-white/5">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <motion.div 
          animate={{ x: [-100, 100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2"
        />
      </div>

      <div className="container mx-auto h-full px-4 lg:px-6 relative z-10">
        <div className="flex h-full items-center justify-between" dir="rtl">
          
          {/* Right Side - Contact Info */}
          <div className="flex items-center gap-5 text-xs">
            {/* Email */}
            <a 
              href="mailto:info@ash-holding.sa" 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group"
            >
              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="w-3 h-3" />
              </div>
              <span className="font-medium">info@ash-holding.sa</span>
            </a>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10" />
            
            {/* Phone */}
            <a 
              href="tel:0555812567" 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group"
            >
              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Phone className="w-3 h-3" />
              </div>
              <span className="ltr-token font-medium">0555812567</span>
            </a>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10" />
            
            {/* Location */}
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                <MapPin className="w-3 h-3" />
              </div>
              <span>جدة، السعودية</span>
            </div>
          </div>
          
          {/* Left Side - Status & Quick Links */}
          <div className="flex items-center gap-4">
            {/* Working Hours */}
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>الأحد - الخميس • 8:00 ص - 6:00 م</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10" />

            {/* Verified Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-primary font-semibold text-xs">موثق رسمياً</span>
            </div>

            {/* Status */}
            <motion.div 
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 rounded-full border border-success/20"
            >
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <span className="text-success font-semibold text-xs">متاح الآن</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
