import { InboxOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';

import { EmptyState } from './empty-state';

const meta = {
  title: 'Patterns/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <InboxOutlined />,
    title: 'Chưa có khách hàng',
    description: 'Thêm khách hàng đầu tiên để bắt đầu quản lý dữ liệu.',
    action: <Button>Thêm khách hàng</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
