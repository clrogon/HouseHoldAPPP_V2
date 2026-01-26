// Stub file - API integration pending

// Re-export types from features for compatibility
export type {
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  TrustedDevice,
  LoginHistoryEntry,
  AppSettings,
} from '@/features/settings/types/settings.types';

import type {
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
} from '@/features/settings/types/settings.types';

export const mockPreferences: UserPreferences = {
  theme: 'light',
  language: 'pt-PT',
  timezone: 'Africa/Luanda',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'AOA',
};

export const mockNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  taskReminders: true,
  eventReminders: true,
  billReminders: true,
  inventoryAlerts: true,
  weeklyDigest: true,
};

export const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'household',
  showActivityStatus: true,
  allowInvitations: true,
  shareCalendar: true,
};

export const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeout: 30,
  trustedDevices: [],
  loginHistory: [],
};

// Legacy settings object
export interface UserSettings {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    calendar: boolean;
    finance: boolean;
  };
}

export const mockSettings: UserSettings = {
  language: 'pt-PT',
  timezone: 'Africa/Luanda',
  theme: 'light',
  currency: 'AOA',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    email: true,
    push: true,
    tasks: true,
    calendar: true,
    finance: true,
  },
};

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'pt-PT', name: 'Português' },
];

export const availableTimezones = [
  { value: 'Africa/Luanda', label: 'Africa/Luanda (WAT)' },
  { value: 'UTC', label: 'UTC' },
];

export const availableCurrencies = [
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

export async function getSettings(): Promise<UserSettings> {
  return mockSettings;
}

export async function updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
  return { ...mockSettings, ...data };
}

export async function updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  return { ...mockPreferences, ...data };
}

export async function updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
  return { ...mockNotificationSettings, ...data };
}

export async function updatePrivacySettings(data: Partial<PrivacySettings>): Promise<PrivacySettings> {
  return { ...mockPrivacySettings, ...data };
}

export async function enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
  throw new Error('API integration required');
}

export async function disableTwoFactor(): Promise<void> {
  throw new Error('API integration required');
}

export async function removeDevice(_deviceId: string): Promise<void> {
  throw new Error('API integration required');
}

export async function changePassword(_currentPassword: string, _newPassword: string): Promise<{ success: boolean }> {
  throw new Error('API integration required');
}
