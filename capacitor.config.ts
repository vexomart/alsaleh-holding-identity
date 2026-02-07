import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sa.ash.holding',
  appName: 'شركة علي صالح الشهري القابضة - ASH HOLDING',
  webDir: 'dist',
  server: {
    url: "https://alialshehriholding.com",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e293b'
    }
  },
};

export default config;
