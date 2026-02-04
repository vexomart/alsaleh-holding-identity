/**
 * Device Fingerprint Hook
 * Generates a unique fingerprint for the current device
 */

import { useState, useEffect } from 'react';

interface DeviceInfo {
  fingerprint: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  deviceName: string;
}

// Simple hash function
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry/.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/.test(userAgent);
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  
  return 'Unknown';
};

const getOS = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Win')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  
  return 'Unknown';
};

const getDeviceName = (deviceType: string, browser: string, os: string): string => {
  const typeNames: Record<string, string> = {
    mobile: 'هاتف',
    tablet: 'جهاز لوحي',
    desktop: 'حاسوب'
  };
  
  return `${typeNames[deviceType] || deviceType} - ${browser} على ${os}`;
};

const generateFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform,
    // Canvas fingerprint
    (() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillText('fingerprint', 2, 2);
          return canvas.toDataURL();
        }
      } catch {
        return 'canvas-error';
      }
      return 'no-canvas';
    })()
  ];
  
  return hashString(components.join('|'));
};

export const useDeviceFingerprint = (): DeviceInfo | null => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const fingerprint = generateFingerprint();
    const deviceType = getDeviceType();
    const browser = getBrowser();
    const os = getOS();
    const deviceName = getDeviceName(deviceType, browser, os);
    
    setDeviceInfo({
      fingerprint,
      deviceType,
      browser,
      os,
      deviceName
    });
  }, []);

  return deviceInfo;
};

export const getDeviceFingerprint = (): DeviceInfo => {
  const fingerprint = generateFingerprint();
  const deviceType = getDeviceType();
  const browser = getBrowser();
  const os = getOS();
  const deviceName = getDeviceName(deviceType, browser, os);
  
  return {
    fingerprint,
    deviceType,
    browser,
    os,
    deviceName
  };
};
