import { MenuOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconButton } from './icon-button';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    label: 'Mở menu điều hướng',
    icon: <MenuOutlined />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
