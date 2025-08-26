import React from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  React.useLayoutEffect(() => {
    try {
      if (hash) {
        // Scroll to hash target after route renders
        setTimeout(() => {
          const id = hash.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          }
        }, 0);
      } else {
        // Scroll to top when route changes and no hash provided
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    } catch (error) {
      console.warn('ScrollToTop error:', error);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;