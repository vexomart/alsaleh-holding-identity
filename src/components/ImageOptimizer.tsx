import React, { useEffect } from 'react';

const ImageOptimizer = React.memo(() => {
  useEffect(() => {
    // Optimize all images for lazy loading and performance
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach((img) => {
        // Add lazy loading
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // Add decoding optimization
        img.decoding = 'async';
        
        // Reduce image quality on slower connections
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            // Use lower quality for slow connections
            if (img.src.includes('jpg') || img.src.includes('jpeg')) {
              img.style.filter = 'blur(1px)';
              img.style.transition = 'filter 0.3s ease';
              
              img.onload = () => {
                img.style.filter = 'none';
              };
            }
          }
        }
      });
    };

    // Run optimization immediately and on DOM changes
    optimizeImages();
    
    // Observer for new images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          optimizeImages();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
});

ImageOptimizer.displayName = 'ImageOptimizer';

export { ImageOptimizer };