import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Switch, type SwitchProps } from './switch';

function ControlledSwitch(args: SwitchProps) {
  const [checked, setChecked] = useState(args.checked);

  return (
    <Switch
      {...args}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    checked: false,
    label: 'Cho phép nhận thông báo',
  },
  render: (args) => <ControlledSwitch {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Cho phép nhận thông báo',
    onCheckedChange: () => undefined,
  },
};

export const Enabled: Story = {
  args: {
    checked: true,
    label: 'Cho phép nhận thông báo',
    onCheckedChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Cho phép nhận thông báo',
    onCheckedChange: () => undefined,
  },
};
