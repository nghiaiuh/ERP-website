import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Modal, type ModalProps } from './modal';

function ModalPreview(props: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Mở modal
      </Button>
      <Modal
        {...props}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Xác nhận lưu thay đổi',
    children: 'Các thay đổi chưa lưu sẽ được áp dụng cho workspace này.',
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
  render: (args) => <ModalPreview {...args} />,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
