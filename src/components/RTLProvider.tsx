import React, { createContext, useContext, useEffect } from 'react';

interface RTLContextType {
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  flipIcon: (iconName: string) => string;
  getMarginClass: (side: 'left' | 'right') => string;
  getPaddingClass: (side: 'left' | 'right') => string;
  getTextAlign: () => 'right' | 'left';
  getBorderRadius: (corner: 'tl' | 'tr' | 'bl' | 'br') => string;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within RTLProvider');
  }
  return context;
};

interface RTLProviderProps {
  children: React.ReactNode;
  force?: boolean; // لإجبار RTL حتى لو كانت البيئة لا تدعمه
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children, force = true }) => {
  const isRTL = force || document.documentElement.dir === 'rtl';
  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    // تطبيق RTL على مستوى الوثيقة
    document.documentElement.dir = direction;
    document.documentElement.lang = isRTL ? 'ar' : 'en';
    
    // إضافة CSS classes للدعم الشامل
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('ltr', !isRTL);

    // تطبيق خطوط عربية
    if (isRTL) {
      document.body.style.fontFamily = 'Tajawal, Cairo, Almarai, Arial, sans-serif';
      document.body.style.textAlign = 'right';
    }

    // إضافة CSS variables للدعم المخصص
    document.documentElement.style.setProperty('--text-direction', isRTL ? '1' : '-1');
    document.documentElement.style.setProperty('--start-direction', isRTL ? 'right' : 'left');
    document.documentElement.style.setProperty('--end-direction', isRTL ? 'left' : 'right');
  }, [isRTL, direction]);

  // دالة لعكس الأيقونات
  const flipIcon = (iconName: string) => {
    const iconsToFlip = [
      'ChevronLeft',
      'ChevronRight', 
      'ArrowLeft',
      'ArrowRight',
      'CaretLeft',
      'CaretRight',
      'AngleLeft',
      'AngleRight'
    ];
    
    if (!isRTL) return iconName;
    
    switch (iconName) {
      case 'ChevronLeft':
        return 'ChevronRight';
      case 'ChevronRight':
        return 'ChevronLeft';
      case 'ArrowLeft':
        return 'ArrowRight';
      case 'ArrowRight':
        return 'ArrowLeft';
      case 'CaretLeft':
        return 'CaretRight';
      case 'CaretRight':
        return 'CaretLeft';
      default:
        return iconName;
    }
  };

  // دوال المساعدة للهوامش والحشو
  const getMarginClass = (side: 'left' | 'right') => {
    if (!isRTL) return side === 'left' ? 'ml' : 'mr';
    return side === 'left' ? 'mr' : 'ml';
  };

  const getPaddingClass = (side: 'left' | 'right') => {
    if (!isRTL) return side === 'left' ? 'pl' : 'pr';
    return side === 'left' ? 'pr' : 'pl';
  };

  const getTextAlign = () => {
    return isRTL ? 'right' : 'left';
  };

  const getBorderRadius = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    if (!isRTL) return corner;
    
    switch (corner) {
      case 'tl':
        return 'tr';
      case 'tr':
        return 'tl';
      case 'bl':
        return 'br';
      case 'br':
        return 'bl';
      default:
        return corner;
    }
  };

  const contextValue: RTLContextType = {
    isRTL,
    direction,
    flipIcon,
    getMarginClass,
    getPaddingClass,
    getTextAlign,
    getBorderRadius
  };

  return (
    <RTLContext.Provider value={contextValue}>
      <div className="rtl-container" dir={direction}>
        {children}
      </div>
    </RTLContext.Provider>
  );
};

// مكون مساعد لعكس الأيقونات
export const RTLIcon: React.FC<{ 
  children: React.ReactNode;
  flip?: boolean;
  className?: string;
}> = ({ children, flip = true, className = "" }) => {
  const { isRTL } = useRTL();
  
  const shouldFlip = flip && isRTL;
  const iconClass = shouldFlip ? `${className} scale-x-[-1]` : className;
  
  return (
    <span className={iconClass}>
      {children}
    </span>
  );
};

// Hook لاستخدام CSS المنطقية
export const useLogicalCSS = () => {
  const { isRTL } = useRTL();
  
  const marginInlineStart = (value: string) => 
    isRTL ? { marginRight: value } : { marginLeft: value };
    
  const marginInlineEnd = (value: string) => 
    isRTL ? { marginLeft: value } : { marginRight: value };
    
  const paddingInlineStart = (value: string) => 
    isRTL ? { paddingRight: value } : { paddingLeft: value };
    
  const paddingInlineEnd = (value: string) => 
    isRTL ? { paddingLeft: value } : { paddingRight: value };
    
  const borderInlineStart = (value: string) => 
    isRTL ? { borderRight: value } : { borderLeft: value };
    
  const borderInlineEnd = (value: string) => 
    isRTL ? { borderLeft: value } : { borderRight: value };

  const insetInlineStart = (value: string) =>
    isRTL ? { right: value } : { left: value };
    
  const insetInlineEnd = (value: string) =>
    isRTL ? { left: value } : { right: value };

  return {
    marginInlineStart,
    marginInlineEnd,
    paddingInlineStart,
    paddingInlineEnd,
    borderInlineStart,
    borderInlineEnd,
    insetInlineStart,
    insetInlineEnd,
    textAlign: isRTL ? 'right' as const : 'left' as const,
    direction: isRTL ? 'rtl' as const : 'ltr' as const
  };
};

// مكون للتأكد من RTL في الجداول
export const RTLTable: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { isRTL } = useRTL();
  
  return (
    <div className={`${className} ${isRTL ? 'rtl-table' : 'ltr-table'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};

// مكون للنماذج المتوافقة مع RTL
export const RTLForm: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { isRTL, getTextAlign } = useRTL();
  
  return (
    <form 
      className={`${className} rtl-form`} 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ textAlign: getTextAlign() }}
    >
      {children}
    </form>
  );
};