import { useSecurityAudit } from './useSecurityAudit';

export const useSecurityValidation = () => {
  const { logSecurityEvent } = useSecurityAudit();

  const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension || '')) {
      return { isValid: false, error: 'نوع الملف غير مدعوم' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'حجم الملف كبير جداً' };
    }

    // Check for suspicious content
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '..'];
    const fileName = file.name.toLowerCase();
    if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
      logSecurityEvent({
        eventType: 'unauthorized_access_attempt',
        description: 'Suspicious file upload attempt detected',
        metadata: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        }
      });
      return { isValid: false, error: 'ملف مشبوه تم اكتشافه' };
    }

    return { isValid: true };
  };

  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Saudi phone number validation
    const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  return {
    validateFileUpload,
    sanitizeInput,
    validateEmail,
    validatePhone
  };
};