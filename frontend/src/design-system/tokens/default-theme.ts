import type { AppTheme } from './theme.types';

export const defaultTheme = {
  colors: {
    primary: '#0958d9',
    background: '#f4f6f8',
    surface: '#ffffff',
    text: '#172033',
    textSecondary: '#667085',
    border: '#e4e7ec',
    danger: '#d92d20',
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} satisfies AppTheme;