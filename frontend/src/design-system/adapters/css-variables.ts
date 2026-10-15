import type { CSSProperties } from "react";
import type { AppTheme } from "../tokens/theme.types";

type DesignSystemCssVariables = CSSProperties &
    Record<`--ds-${string}`, string>;

export function createCssVariables(
    theme: AppTheme,
): DesignSystemCssVariables {
    return {
        '--ds-color-primary': theme.colors.primary,
        '--ds-color-background': theme.colors.background,
        '--ds-color-surface': theme.colors.surface,
        '--ds-color-text': theme.colors.text,
        '--ds-color-text-secondary': theme.colors.textSecondary,
        '--ds-color-border': theme.colors.border,
        '--ds-color-danger': theme.colors.danger,

        '--ds-radius-sm': `${theme.radius.sm}px`,
        '--ds-radius-md': `${theme.radius.md}px`,
        '--ds-radius-lg': `${theme.radius.lg}px`,

        '--ds-font-family': theme.fontFamily,
    };
}