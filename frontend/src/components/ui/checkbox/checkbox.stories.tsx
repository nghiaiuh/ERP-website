import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Checkbox, type CheckboxProps } from './checkbox';

function ControlledCheckbox(args: CheckboxProps) {
  const [checked, setChecked] = useState(args.checked);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    checked: false,
    label: 'Gửi thông báo qua email',
  },
  render: (args) => <ControlledCheckbox {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Gửi thông báo qua email',
    onCheckedChange: () => undefined,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Gửi thông báo qua email',
    onCheckedChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Gửi thông báo qua email',
    onCheckedChange: () => undefined,
  },
};
