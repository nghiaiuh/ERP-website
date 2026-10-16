import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Drawer, type DrawerProps } from './drawer';

function DrawerPreview(props: DrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Mở drawer
      </Button>
      <Drawer
        {...props}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Chi tiết khách hàng',
    children: 'Thông tin chi tiết sẽ hiển thị trong drawer này.',
    getContainer: false,
    rootStyle: {
      position: 'absolute',
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[32rem] overflow-hidden rounded-lg border border-border bg-surface p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      story: {
        height: '560px',
      },
    },
  },
  render: (args) => <DrawerPreview {...args} />,
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
