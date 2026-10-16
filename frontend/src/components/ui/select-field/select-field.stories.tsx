import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SelectField } from './select-field';

const meta = {
  title: 'UI/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  args: {
    label: 'Ngôn ngữ hiển thị',
    placeholder: 'Chọn ngôn ngữ',
    options: [
      { label: 'Tiếng Việt', value: 'vi' },
      { label: 'English', value: 'en' },
    ],
  },
} satisfies Meta<typeof SelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
    helpText: 'Ngôn ngữ được dùng để hiển thị giao diện.',
  },
};

export const Error: Story = {
  args: {
    error: 'Hãy chọn một ngôn ngữ.',
  },
};
