import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c76d202873e145b9a970979a33912db9',
  appName: 'alsaleh-holding-identity',
  webDir: 'dist',
  server: {
    url: "https://c76d2028-73e1-45b9-a970-979a33912db9.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff'
    }
  },
};

export default config;