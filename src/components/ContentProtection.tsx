import { useEffect } from 'react';

export function ContentProtection() {
  useEffect(() => {
    // منع النقر بالزر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع اختصارات لوحة المفاتيح
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'p')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // منع السحب والإفلات
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // منع التحديد
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // إضافة المستمعين
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // إضافة أنماط CSS لمنع التحديد
    document.body.style.userSelect = 'none';
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';
    (document.body.style as any).webkitUserDrag = 'none';

    // تنظيف عند إلغاء التحميل
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      
      // إعادة تعيين الأنماط
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitUserDrag = '';
    };
  }, []);

  return null;
}