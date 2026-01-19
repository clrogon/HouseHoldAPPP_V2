import type {
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  TrustedDevice,
  LoginHistoryEntry,
} from '@/features/settings/types/settings.types';

export const mockPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
};

export const mockNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  taskReminders: true,
  eventReminders: true,
  billReminders: true,
  inventoryAlerts: true,
  weeklyDigest: false,
};

export const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'household',
  showActivityStatus: true,
  allowInvitations: true,
  shareCalendar: true,
};

export const mockTrustedDevices: TrustedDevice[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    browser: 'Chrome 120',
    os: 'macOS Sonoma',
    lastUsed: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: '2',
    name: 'iPhone 15',
    browser: 'Safari Mobile',
    os: 'iOS 17',
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
  },
  {
    id: '3',
    name: 'Windows Desktop',
    browser: 'Firefox 121',
    os: 'Windows 11',
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
  },
];

export const mockLoginHistory: LoginHistoryEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Chrome on macOS',
    status: 'success',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Safari on iOS',
    status: 'success',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '10.0.0.50',
    location: 'Brooklyn, NY',
    device: 'Firefox on Windows',
    status: 'success',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '45.33.32.156',
    location: 'Unknown',
    device: 'Chrome on Linux',
    status: 'failed',
  },
];

export const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeout: 30,
  trustedDevices: mockTrustedDevices,
  loginHistory: mockLoginHistory,
};

// Mock API functions
export async function updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  await new Promise(resolve => setTimeout(resolve, 300));
  Object.assign(mockPreferences, preferences);
  return mockPreferences;
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
  await new Promise(resolve => setTimeout(resolve, 300));
  Object.assign(mockNotificationSettings, settings);
  return mockNotificationSettings;
}

export async function updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
  await new Promise(resolve => setTimeout(resolve, 300));
  Object.assign(mockPrivacySettings, settings);
  return mockPrivacySettings;
}

export async function enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockSecuritySettings.twoFactorEnabled = true;
  return {
    secret: 'JBSWY3DPEHPK3PXP',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/HouseholdHero:user@example.com?secret=JBSWY3DPEHPK3PXP',
  };
}

export async function disableTwoFactor(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockSecuritySettings.twoFactorEnabled = false;
}

export async function removeDevice(deviceId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockSecuritySettings.trustedDevices.findIndex(d => d.id === deviceId);
  if (index !== -1) {
    mockSecuritySettings.trustedDevices.splice(index, 1);
  }
}

export async function changePassword(currentPassword: string, _newPassword: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (currentPassword === 'wrong') {
    throw new Error('Current password is incorrect');
  }
}
