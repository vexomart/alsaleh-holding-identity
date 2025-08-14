import { useState, FormEvent, ReactNode } from 'react';
import { useEnhancedSecurity } from './EnhancedSecurityProvider';
import { toast } from 'sonner';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  formData: Record<string, any>;
  requiredFields?: string[];
  className?: string;
}

export const SecureForm = ({ 
  children, 
  onSubmit, 
  formData, 
  requiredFields = [], 
  className = "" 
}: SecureFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { validateFormData, logSecurityEvent } = useEnhancedSecurity();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error("يرجى تصحيح الأخطاء في النموذج");
        return;
      }

      // Check required fields
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      if (missingFields.length > 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }

      // Log form submission for audit
      logSecurityEvent({
        eventType: 'sensitive_data_access',
        description: 'Secure form submitted',
        metadata: {
          formFields: Object.keys(formData),
          hasEmail: !!formData.email,
          hasPhone: !!formData.phone
        }
      });

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("حدث خطأ أثناء إرسال النموذج");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm font-medium mb-2">يرجى تصحيح الأخطاء التالية:</p>
          <ul className="text-red-600 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};