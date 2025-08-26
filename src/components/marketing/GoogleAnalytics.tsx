import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  trackingId: string;
}

const GoogleAnalytics = ({ trackingId }: GoogleAnalyticsProps) => {
  useEffect(() => {
    // تحميل Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'service_interest',
          custom_parameter_2: 'client_type'
        }
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  return null;
};

// وظائف تتبع الأحداث
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackServiceInterest = (serviceName: string) => {
  trackEvent('service_interest', 'engagement', serviceName);
};

export const trackContactAttempt = (method: string) => {
  trackEvent('contact_attempt', 'conversion', method);
};

export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submit', 'conversion', formType);
};

export default GoogleAnalytics;