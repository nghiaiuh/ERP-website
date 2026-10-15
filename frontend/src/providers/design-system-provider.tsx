'use client'

import enUS from "antd/locale/en_US"
import viVN from 'antd/locale/vi_VN'
import { ConfigProvider } from "antd";
import { useMemo, type ReactNode } from "react"

import { createAntdTheme } from "@/design-system/adapters/antd-theme"
import { createCssVariables } from "@/design-system/adapters/css-variables"
import type { AppLocale, AppTheme } from "@/design-system/tokens/theme.types"

interface DesignSystemProviderProps {
    children: ReactNode;
    locale: AppLocale;
    theme: AppTheme;
}

const antdLocales = {
  vi: viVN,
  en: enUS,
} as const;

export function DesignSystemProvider({
    children,
    locale,
    theme,
}: DesignSystemProviderProps) {
    const antdTheme = useMemo(
        () => createAntdTheme(theme),
        [theme]
    );
      const cssVariables = useMemo(
        () => createCssVariables(theme),
        [theme],
    );

    return (
        <div style={cssVariables}>
            <ConfigProvider
                locale={antdLocales[locale]}
                theme={antdTheme}
                button={{ autoInsertSpace: false }}
            >
                {children}
            </ConfigProvider>
        </div>
    )
}