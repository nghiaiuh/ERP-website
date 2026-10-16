import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

import { defaultTheme } from '@/design-system/tokens/default-theme';
import { DesignSystemProvider } from '@/providers/design-system-provider';

function TestProviders({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider locale="vi" theme={defaultTheme}>
      {children}
    </DesignSystemProvider>
  );
}

export function renderUi(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
}
