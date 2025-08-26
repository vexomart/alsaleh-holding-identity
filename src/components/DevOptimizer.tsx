import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

export const DevOptimizer = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // تحسين التطوير - إزالة التأخيرات غير الضرورية
    if (import.meta.env.DEV) {
      // تسريع الانتقال بين الصفحات
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
};