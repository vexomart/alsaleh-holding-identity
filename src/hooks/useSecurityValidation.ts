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
    if (!input || typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<link\b[^<]*>/gi, '')
      .replace(/<meta\b[^<]*>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>\"\']/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  };

  const validateEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const isValidFormat = emailRegex.test(email);
    const hasValidLength = email.length <= 254; // RFC 5321 limit
    const hasValidLocalPart = email.split('@')[0]?.length <= 64; // RFC 5321 limit
    
    return isValidFormat && hasValidLength && hasValidLocalPart;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone || typeof phone !== 'string') return false;
    
    // Enhanced Saudi phone number validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/;
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 9 && cleanPhone.length <= 13;
  };

  const validateRequired = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
    const sanitized = sanitizeInput(value);
    if (!sanitized || sanitized.trim().length === 0) {
      return { isValid: false, error: `${fieldName} مطلوب` };
    }
    return { isValid: true };
  };

  const validateFormData = (data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const sanitized = sanitizeInput(value);
        if (sanitized !== value) {
          logSecurityEvent({
            eventType: 'unauthorized_access_attempt',
            description: 'Potentially malicious input detected',
            metadata: {
              field: key,
              originalValue: value.substring(0, 100), // Log first 100 chars only
              sanitizedValue: sanitized.substring(0, 100)
            }
          });
        }
        
        // Update the data with sanitized value
        data[key] = sanitized;
      }
    });

    // Specific field validations
    if (data.email && !validateEmail(data.email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    if (data.phone && !validatePhone(data.phone)) {
      errors.phone = 'يرجى إدخال رقم هاتف سعودي صحيح';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  return {
    validateFileUpload,
    sanitizeInput,
    validateEmail,
    validatePhone,
    validateRequired,
    validateFormData
  };
};