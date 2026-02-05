/**
 * HeaderTopBar - Premium Top Info Bar
 * Displays contact info, working hours, and status
 */

import * as React from 'react';
import { Clock, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeaderTopBar() {
  return (
    <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-10 bg-foreground">
      <div className="container mx-auto h-full px-4 lg:px-6">
        <div className="flex h-full items-center justify-between" dir="rtl">
          
          {/* Right Side - Contact Info */}
          <div className="flex items-center gap-6 text-xs">
            <a 
              href="mailto:info@ash-holding.sa" 
              className="flex items-center gap-1.5 text-background/80 hover:text-background transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>info@ash-holding.sa</span>
            </a>
            <a 
              href="tel:0555812567" 
              className="flex items-center gap-1.5 text-background/80 hover:text-background transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="ltr-token">0555812567</span>
            </a>
            <div className="flex items-center gap-1.5 text-background/70">
              <MapPin className="w-3.5 h-3.5" />
              <span>جدة، المملكة العربية السعودية</span>
            </div>
          </div>
          
          {/* Left Side - Status & Working Hours */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-background/70 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>الأحد - الخميس • 8:00 ص - 6:00 م</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <span className="text-success font-semibold text-xs">متاح الآن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
