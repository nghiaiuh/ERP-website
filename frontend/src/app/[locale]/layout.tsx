import { AntdRegistry } from "@ant-design/nextjs-registry";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { createCssVariables } from "@/design-system/adapters/css-variables";
import { defaultTheme } from "@/design-system/tokens/default-theme";
import { routing } from "@/i18n/routing";
import { DesignSystemProvider } from "@/providers/design-system-provider";

import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={createCssVariables(defaultTheme)}>
        <AntdRegistry layer>
          <NextIntlClientProvider messages={messages}>
            <DesignSystemProvider
              locale={locale}
              theme={defaultTheme}
            >
              {children}
            </DesignSystemProvider>
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
