 import { useEffect, ReactNode } from 'react';

interface ReCaptchaProviderProps {
   children: ReactNode;
}

 export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
   useEffect(() => {
    // Add reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize reCAPTCHA when script loads
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA is ready');
        });
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

   return children;
 }

// Global type declaration for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
  }
}
