import type { ThemeConfig } from "antd";
import type { AppTheme } from "../tokens/theme.types";

export function createAntdTheme(
    theme: AppTheme,
): ThemeConfig {
    return {
        token: {
            colorPrimary: theme.colors.primary,
            colorBgLayout: theme.colors.background,
            colorBgContainer: theme.colors.surface,
            colorText: theme.colors.text,
            colorTextSecondary: theme.colors.textSecondary,
            colorBorder: theme.colors.border,
            colorError: theme.colors.danger,
            borderRadius: theme.radius.md,
            fontFamily: theme.fontFamily,
        },
        components: {
            Button: {
                borderRadius: theme.radius.md,
            },
            Card: {
                borderRadiusLG: theme.radius.lg,
            },
        },
    };
}