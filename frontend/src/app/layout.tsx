import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { createCssVariables } from "@/design-system/adapters/css-variables";
import { defaultTheme } from "@/design-system/tokens/default-theme";
import { DesignSystemProvider } from "@/providers/design-system-provider";
import { QueryProvider } from "@/providers/query-provider";

import './globals.css';

export const metadata: Metadata = {
  title: 'CRM Workspace',
  description: 'CRM operations workspace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body style={createCssVariables(defaultTheme)}>
        
        <AntdRegistry layer>
          <DesignSystemProvider locale="vi" theme={defaultTheme}>
            <QueryProvider>
              {children}
            </QueryProvider>
          </DesignSystemProvider>
        </AntdRegistry>
        
      </body>
    </html>
  )
}