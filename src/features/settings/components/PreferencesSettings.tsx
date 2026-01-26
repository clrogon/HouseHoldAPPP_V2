import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useLanguage, availableLanguages, type Language } from '@/shared/i18n';
import { useTheme } from '@/shared/theme';
import { getCurrencyOptions } from '@/shared/lib/currency';
import type { UserPreferences } from '../types/settings.types';

interface PreferencesSettingsProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const timezones = [
  { value: 'Africa/Luanda', label: 'Luanda (WAT)' },
  { value: 'Europe/Lisbon', label: 'Lisboa (WET)' },
  { value: 'Europe/London', label: 'Londres (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'America/New_York', label: 'Nova Iorque (ET)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'Africa/Johannesburg', label: 'Joanesburgo (SAST)' },
];

const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export function PreferencesSettings({ preferences, onUpdate }: PreferencesSettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme: currentTheme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);

  // Sync local theme with global theme context
  useEffect(() => {
    if (localPrefs.theme !== currentTheme) {
      setLocalPrefs(prev => ({ ...prev, theme: currentTheme }));
    }
  }, [currentTheme, localPrefs.theme]);

  // Get currency options based on current language
  const currencies = getCurrencyOptions(language);

  // Sync local language with global language context
  useEffect(() => {
    if (localPrefs.language !== language) {
      setLocalPrefs(prev => ({ ...prev, language }));
    }
  }, [language, localPrefs.language]);

  const handleChange = (key: keyof UserPreferences, value: string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));

    // If language changes, also update the global language context
    if (key === 'language') {
      setLanguage(value as Language);
    }

    // If theme changes, also update the global theme context
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(localPrefs);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = JSON.stringify(localPrefs) !== JSON.stringify(preferences);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.preferences}</CardTitle>
        <CardDescription>
          {language === 'pt-PT' ? 'Personalize a sua experiência' : 'Customize your app experience'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <div className="space-y-2">
          <Label>{t.settings.theme}</Label>
          <div className="flex gap-2">
            {[
              { value: 'light', icon: Sun, label: t.settings.light },
              { value: 'dark', icon: Moon, label: t.settings.dark },
              { value: 'system', icon: Monitor, label: t.settings.system },
            ].map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={localPrefs.theme === value ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleChange('theme', value)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>{t.settings.language}</Label>
          <Select value={localPrefs.language} onValueChange={(v) => handleChange('language', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label>{t.settings.timezone}</Label>
          <Select value={localPrefs.timezone} onValueChange={(v) => handleChange('timezone', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map(tz => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Time Format */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.settings.dateFormat}</Label>
            <Select value={localPrefs.dateFormat} onValueChange={(v) => handleChange('dateFormat', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map(fmt => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.timeFormat}</Label>
            <Select value={localPrefs.timeFormat} onValueChange={(v) => handleChange('timeFormat', v as '12h' | '24h')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                <SelectItem value="24h">24-hour (13:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label>{t.settings.currency}</Label>
          <Select value={localPrefs.currency} onValueChange={(v) => handleChange('currency', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(curr => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.common.saving}
              </>
            ) : (
              t.settings.savePreferences
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
