import { resolveLogoUrl } from "@/lib/utils/safe-redirect";
import { defaultTheme } from "./default-theme";
import { AppTheme, TenantThemeOverride } from "./theme.types";

const HEX_COLOR_PATTERN = /^(?:"[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const ALLOWED_FONT_FAMILIES = new Set([
    'Inter, sans-serif',
    'Roboto, sans-serif',
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
]);

export function validateTenantThemeOverride(
    input: TenantThemeOverride,
): TenantThemeOverride {
    const output: TenantThemeOverride = {};
    const brandName = input.brandName?.trim();
    if(brandName && brandName.length <= 80) {
        output.brandName = brandName;
    }
    if (input.logoUrl) {
        const safeLogoUrl = resolveLogoUrl(input.logoUrl);
        if(safeLogoUrl) {
            output.logoUrl = safeLogoUrl;
        }
    }

    if(input.primaryColor &&
        HEX_COLOR_PATTERN.test(input.primaryColor)
    ) {
        output.primaryColor = input.primaryColor;
    }

    if(
        typeof input.borderRadius === 'number' &&
        Number.isFinite(input.borderRadius) &&
        input.borderRadius >= 0 &&
        input.borderRadius <= 24
    ) {
        output.borderRadius = input.borderRadius;
    }
    
    if(
        input.fontFamily &&
        ALLOWED_FONT_FAMILIES.has(input.fontFamily)
    ) {
        output.fontFamily = input.fontFamily;
    }
    return output;
}

export function resolveTheme(
    override: TenantThemeOverride = {},
): AppTheme {
    const validOverride = validateTenantThemeOverride(override);
    const borderRadius = validOverride.borderRadius ?? defaultTheme.radius.md;

    return {
        colors: {
            ...defaultTheme.colors,
            primary:
                validOverride.primaryColor ??
                defaultTheme.colors.primary,
        },
        radius: {
            sm: Math.max(0, borderRadius - 2),
            md: borderRadius,
            lg: borderRadius + 4,
        },
        fontFamily:
            validOverride.fontFamily ??
            defaultTheme.fontFamily,
    };
}
