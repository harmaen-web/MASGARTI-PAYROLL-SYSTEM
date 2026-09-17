import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masgarti.payroll',
  appName: 'Masgarti Payroll',
  webDir: 'frontend/dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
