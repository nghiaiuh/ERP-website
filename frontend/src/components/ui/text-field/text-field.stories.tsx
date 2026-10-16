import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextField } from './text-field';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Email công việc',
    placeholder: 'name@company.com',
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
    helpText: 'Dùng email công việc để nhận thông báo.',
  },
};

export const Error: Story = {
  args: {
    error: 'Email không hợp lệ.',
    defaultValue: 'not-an-email',
  },
};
