import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { defaultTheme } from '@/design-system/tokens/default-theme';
import { DesignSystemProvider } from '@/providers/design-system-provider';

import { Button } from '@/components/ui/button';

function ButtonTree() {
  return (
    <DesignSystemProvider locale="vi" theme={defaultTheme}>
      <Button>Lưu thay đổi</Button>
    </DesignSystemProvider>
  );
}

describe('Button hydration', () => {
  it('hydrates without recoverable errors', async () => {
    const container = document.createElement('div');
    const recoverableErrors: unknown[] = [];

    container.innerHTML = renderToString(<ButtonTree />);

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, <ButtonTree />, {
        onRecoverableError(error) {
          recoverableErrors.push(error);
        },
      });
    });

    expect(recoverableErrors).toHaveLength(0);

    await act(async () => {
      root?.unmount();
    });
  });
});
