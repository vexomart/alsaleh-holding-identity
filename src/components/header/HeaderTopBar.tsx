/**
 * HeaderTopBar - Premium Top Info Bar (Desktop Only)
 */

import * as React from 'react';
import { Clock, MapPin, Mail, Phone } from 'lucide-react';

export function HeaderTopBar() {
  return (
    <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-10 bg-gradient-to-l from-primary via-primary-variant to-primary border-b border-primary-variant/50">
      <div className="container mx-auto h-full px-6">
        <div className="flex h-full items-center justify-between" dir="rtl">
          {/* Right Side (RTL) - Time & Location */}
          <div className="flex items-center gap-6 text-xs text-primary-foreground/90">
            <div className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="font-medium">جدة، المملكة العربية السعودية</span>
            </div>
          </div>
          
          {/* Left Side (RTL) - Contact & Status */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:info@ash-holding.sa" 
              className="flex items-center gap-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="font-medium text-xs">info@ash-holding.sa</span>
            </a>
            <a 
              href="tel:0555812567" 
              className="flex items-center gap-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium text-xs ltr-token">0555812567</span>
            </a>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-success/20 rounded-full border border-success/30">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <span className="text-success font-semibold text-xs">متاح الآن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
