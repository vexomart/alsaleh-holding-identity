import React, { useState, useEffect, useRef } from 'react';
import { performanceConfig } from '@/config/performance';

interface PerformanceOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const PerformanceOptimizedImage: React.FC<PerformanceOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  quality = 85,
  format = 'webp',
  placeholder = 'blur',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  // إنشاء srcset للصور المتجاوبة
  const generateSrcSet = () => {
    const { sizes: configSizes } = performanceConfig.imageOptimization;
    return configSizes
      .map(size => `${src}?w=${size}&q=${quality}&f=${format} ${size}w`)
      .join(', ');
  };

  // إنشاء placeholder
  const generatePlaceholder = () => {
    if (placeholder === 'empty') return '';
    
    const placeholderSvg = `
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6"/>
            <stop offset="100%" style="stop-color:#e5e7eb"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          جارٍ التحميل...
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(placeholderSvg)}`;
  };

  // مراقب التقاطع للـ lazy loading
  useEffect(() => {
    if (!imgRef.current || isInView || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px', // تحميل الصورة قبل ظهورها بـ 50px
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [isInView, priority]);

  // تحسين تحميل الصورة
  const optimizedSrc = isInView ? `${src}?q=${quality}&f=${format}` : generatePlaceholder();
  const srcSet = isInView ? generateSrcSet() : '';

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // صورة fallback في حالة الخطأ
  const fallbackSrc = hasError ? '/images/image-fallback.svg' : optimizedSrc;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder مع تأثير blur */}
      {!isLoaded && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,${btoa(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <circle cx="20" cy="20" r="8" fill="#e5e7eb"/>
              </svg>
            `)}")`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat'
          }}
        />
      )}

      {/* الصورة المحسنة */}
      <img
        ref={imgRef}
        src={fallbackSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-all duration-500 ease-out
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          ${hasError ? 'filter grayscale' : ''}
          w-full h-full object-cover
        `}
        style={{
          willChange: 'transform, opacity',
          transform: isLoaded ? 'translateZ(0)' : 'translateZ(0) scale(1.05)',
        }}
      />

      {/* مؤشر التحميل */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">جارٍ التحميل...</span>
          </div>
        </div>
      )}

      {/* رسالة خطأ */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">فشل تحميل الصورة</p>
          </div>
        </div>
      )}
    </div>
  );
};

// مكون مخصص للصور البطل
export const HeroImage: React.FC<Omit<PerformanceOptimizedImageProps, 'loading' | 'priority'>> = (props) => (
  <PerformanceOptimizedImage
    {...props}
    loading="eager"
    priority={true}
    format="avif"
    quality={90}
  />
);

// مكون مخصص للصور المصغرة
export const ThumbnailImage: React.FC<Omit<PerformanceOptimizedImageProps, 'loading'>> = (props) => (
  <PerformanceOptimizedImage
    {...props}
    loading="lazy"
    format="webp"
    quality={75}
  />
);

// Hook لتحسين مجموعة من الصور
export const useImagePreloader = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadImages = async () => {
    setIsPreloading(true);
    
    const promises = imageSrcs.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    try {
      await Promise.allSettled(promises);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    if (imageSrcs.length > 0) {
      preloadImages();
    }
  }, [imageSrcs.join(',')]);

  return {
    loadedImages,
    isPreloading,
    preloadImages,
    isImageLoaded: (src: string) => loadedImages.has(src)
  };
};