import { ThemeId, UserPreferences } from '../core/types';
import { LocalStorageService } from '../storage/localStorageService';

const PREFS_STORAGE_KEY = 'adivinha_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'minimal-dark',
  colorblindMode: false,
  soundEnabled: true,
  hapticEnabled: true
};

export class ThemeManager {
  private static preferences: UserPreferences = LocalStorageService.getItem<UserPreferences>(
    PREFS_STORAGE_KEY,
    { ...DEFAULT_PREFERENCES }
  );

  public static init(): void {
    this.applyTheme(this.preferences.theme);
    this.applyColorblindMode(this.preferences.colorblindMode);
  }

  public static getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public static setTheme(theme: ThemeId): void {
    this.preferences.theme = theme;
    this.applyTheme(theme);
    this.save();
  }

  public static toggleColorblindMode(): boolean {
    this.preferences.colorblindMode = !this.preferences.colorblindMode;
    this.applyColorblindMode(this.preferences.colorblindMode);
    this.save();
    return this.preferences.colorblindMode;
  }

  private static applyTheme(theme: ThemeId): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  private static applyColorblindMode(enabled: boolean): void {
    document.documentElement.setAttribute('data-colorblind', enabled.toString());
    document.body.setAttribute('data-colorblind', enabled.toString());
  }

  private static save(): void {
    LocalStorageService.setItem(PREFS_STORAGE_KEY, this.preferences);
  }
}
