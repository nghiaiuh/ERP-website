import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';

import { PageHeader } from './page-header';

const meta = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    breadcrumb: <span className="text-sm text-muted">Khách hàng / Danh sách</span>,
    title: 'Khách hàng',
    description: 'Quản lý hồ sơ và trạng thái của khách hàng.',
    actions: <Button>Thêm khách hàng</Button>,
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
