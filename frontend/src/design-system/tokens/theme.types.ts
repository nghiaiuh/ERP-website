export type AppLocale = 'vi' | 'en';

export interface ThemeColors {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    danger: string;
}

export interface ThemeRadius {
    sm: number;
    md: number;
    lg: number;
}

export interface AppTheme {
    colors: ThemeColors;
    radius: ThemeRadius
    fontFamily: string;
}

export interface TenantThemeOverride {
  brandName?: string;
  logoUrl?: string;
  primaryColor?: string;
  borderRadius?: number;
  fontFamily?: string;
}