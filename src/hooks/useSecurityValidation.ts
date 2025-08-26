import { useState, useCallback } from 'react';

export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: { [key: string]: string[] };
  sanitizedData: { [key: string]: any };
}

/**
 * Advanced security validation hook with XSS protection, 
 * input sanitization, and comprehensive validation rules
 */
export const useSecurityValidation = () => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({});

  /**
   * Sanitize string input to prevent XSS attacks
   */
  const sanitizeString = useCallback((input: string, maxLength: number = 1000): string => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .substring(0, maxLength)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, (match) => ({ '<': '&lt;', '>': '&gt;' }[match] || match)); // Escape HTML
  }, []);

  /**
   * Validate email format (RFC 5321 compliant)
   */
  const validateEmail = useCallback((email: string): SecurityValidationResult => {
    const errors: string[] = [];
    
    if (!email || typeof email !== 'string') {
      errors.push('البريد الإلكتروني مطلوب');
      return { isValid: false, errors };
    }

    // Enhanced email regex (RFC 5321 compliant)
    const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    
    const sanitizedEmail = email.trim().toLowerCase();
    
    if (sanitizedEmail.length > 254) {
      errors.push('البريد الإلكتروني طويل جداً');
    }
    
    if (!emailRegex.test(sanitizedEmail)) {
      errors.push('تنسيق البريد الإلكتروني غير صحيح');
    }

    // Check for suspicious patterns
    if (sanitizedEmail.includes('..') || sanitizedEmail.startsWith('.') || sanitizedEmail.endsWith('.')) {
      errors.push('البريد الإلكتروني يحتوي على أحرف غير صحيحة');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedEmail
    };
  }, []);

  /**
   * Validate phone number with international format support
   */
  const validatePhone = useCallback((phone: string): SecurityValidationResult => {
    const errors: string[] = [];
    
    if (!phone || typeof phone !== 'string') {
      errors.push('رقم الهاتف مطلوب');
      return { isValid: false, errors };
    }

    // Sanitize phone number (remove all non-digit characters except +)
    const sanitizedPhone = phone.replace(/[^\d+]/g, '');
    
    if (sanitizedPhone.length < 8 || sanitizedPhone.length > 20) {
      errors.push('رقم الهاتف يجب أن يكون بين 8 و 20 رقم');
    }

    // Check for Saudi phone number patterns
    const saudiMobileRegex = /^(\+966|966|0)?5\d{8}$/;
    const internationalRegex = /^\+\d{8,20}$/;
    
    if (!saudiMobileRegex.test(sanitizedPhone) && !internationalRegex.test(sanitizedPhone)) {
      errors.push('رقم الهاتف غير صحيح. يرجى إدخال رقم هاتف صحيح');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedPhone
    };
  }, []);

  /**
   * Validate name with Arabic and English support
   */
  const validateName = useCallback((name: string, minLength: number = 2, maxLength: number = 100): SecurityValidationResult => {
    const errors: string[] = [];
    
    if (!name || typeof name !== 'string') {
      errors.push('الاسم مطلوب');
      return { isValid: false, errors };
    }

    const sanitizedName = sanitizeString(name.trim(), maxLength);
    
    if (sanitizedName.length < minLength) {
      errors.push(`الاسم يجب أن يكون ${minLength} أحرف على الأقل`);
    }
    
    if (sanitizedName.length > maxLength) {
      errors.push(`الاسم يجب أن يكون ${maxLength} حرف كحد أقصى`);
    }

    // Check for valid name characters (Arabic, English, spaces, hyphens)
    const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s\-'.]+$/;
    if (!nameRegex.test(sanitizedName)) {
      errors.push('الاسم يحتوي على أحرف غير مسموحة');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedName
    };
  }, [sanitizeString]);

  /**
   * Validate password with security requirements
   */
  const validatePassword = useCallback((password: string): SecurityValidationResult => {
    const errors: string[] = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('كلمة المرور مطلوبة');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }

    if (password.length > 128) {
      errors.push('كلمة المرور طويلة جداً');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }

    if (!/\d/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'password123'];
    if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
      errors.push('كلمة المرور ضعيفة جداً');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: password // Don't sanitize passwords
    };
  }, []);

  /**
   * Validate URL format
   */
  const validateUrl = useCallback((url: string): SecurityValidationResult => {
    const errors: string[] = [];
    
    if (!url || typeof url !== 'string') {
      return { isValid: true, errors: [], sanitizedValue: '' }; // URL is optional
    }

    try {
      const urlObj = new URL(url);
      
      // Only allow https and http protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('الرابط يجب أن يبدأ بـ http:// أو https://');
      }

      // Check for suspicious patterns
      if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
        errors.push('الرابط يحتوي على محتوى غير آمن');
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue: url
      };
    } catch {
      errors.push('تنسيق الرابط غير صحيح');
      return { isValid: false, errors };
    }
  }, []);

  /**
   * Validate form data comprehensively
   */
  const validateFormData = useCallback((data: { [key: string]: any }, rules: { [key: string]: string[] }): FormValidationResult => {
    const errors: { [key: string]: string[] } = {};
    const sanitizedData: { [key: string]: any } = {};

    for (const [field, validationRules] of Object.entries(rules)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      for (const rule of validationRules) {
        switch (rule) {
          case 'required':
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              fieldErrors.push('هذا الحقل مطلوب');
            }
            break;
          
          case 'email':
            if (value) {
              const emailResult = validateEmail(value);
              if (!emailResult.isValid) {
                fieldErrors.push(...emailResult.errors);
              } else {
                sanitizedData[field] = emailResult.sanitizedValue;
              }
            }
            break;
          
          case 'phone':
            if (value) {
              const phoneResult = validatePhone(value);
              if (!phoneResult.isValid) {
                fieldErrors.push(...phoneResult.errors);
              } else {
                sanitizedData[field] = phoneResult.sanitizedValue;
              }
            }
            break;
          
          case 'name':
            if (value) {
              const nameResult = validateName(value);
              if (!nameResult.isValid) {
                fieldErrors.push(...nameResult.errors);
              } else {
                sanitizedData[field] = nameResult.sanitizedValue;
              }
            }
            break;
          
          case 'password':
            if (value) {
              const passwordResult = validatePassword(value);
              if (!passwordResult.isValid) {
                fieldErrors.push(...passwordResult.errors);
              } else {
                sanitizedData[field] = passwordResult.sanitizedValue;
              }
            }
            break;
          
          case 'url':
            if (value) {
              const urlResult = validateUrl(value);
              if (!urlResult.isValid) {
                fieldErrors.push(...urlResult.errors);
              } else {
                sanitizedData[field] = urlResult.sanitizedValue;
              }
            }
            break;
          
          default:
            // Handle custom validation rules
            if (rule.startsWith('maxLength:')) {
              const maxLength = parseInt(rule.split(':')[1]);
              if (value && typeof value === 'string' && value.length > maxLength) {
                fieldErrors.push(`يجب أن يكون ${maxLength} حرف كحد أقصى`);
              } else if (value && typeof value === 'string') {
                sanitizedData[field] = sanitizeString(value, maxLength);
              }
            }
            break;
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }

      // If no errors and value exists, sanitize it
      if (fieldErrors.length === 0 && value && !sanitizedData[field]) {
        if (typeof value === 'string') {
          sanitizedData[field] = sanitizeString(value);
        } else {
          sanitizedData[field] = value;
        }
      }
    }

    setValidationErrors(errors);

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }, [validateEmail, validatePhone, validateName, validatePassword, validateUrl, sanitizeString]);

  /**
   * Clear validation errors
   */
  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  /**
   * Validate required fields
   */
  const validateRequired = useCallback((fields: { [key: string]: any }): string[] => {
    const errors: string[] = [];
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(`${fieldName} مطلوب`);
      }
    }
    
    return errors;
  }, []);

  return {
    // Validation functions
    sanitizeString,
    validateEmail,
    validatePhone,
    validateName,
    validatePassword,
    validateUrl,
    validateFormData,
    validateRequired,
    
    // State and utilities
    validationErrors,
    clearErrors,
    
    // Utility methods
    isValidEmail: (email: string) => validateEmail(email).isValid,
    isValidPhone: (phone: string) => validatePhone(phone).isValid,
    isValidName: (name: string) => validateName(name).isValid,
    isValidPassword: (password: string) => validatePassword(password).isValid,
    isValidUrl: (url: string) => validateUrl(url).isValid,
  };
};