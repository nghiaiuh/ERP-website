import type { Preview } from '@storybook/nextjs-vite';

import '../src/app/globals.css';
import { defaultTheme } from '../src/design-system/tokens/default-theme';
import { DesignSystemProvider } from '../src/providers/design-system-provider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <DesignSystemProvider locale="vi" theme={defaultTheme}>
        <Story />
      </DesignSystemProvider>
    ),
  ],
  parameters: {
    // Configure nextjs.appDirectory on an individual story only when that
    // component imports next/navigation. Enabling it globally requires App
    // Router boundary context that ordinary design-system stories do not use.
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
