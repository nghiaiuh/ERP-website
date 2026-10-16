import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AsyncState } from './async-state';

const meta = {
  title: 'Patterns/AsyncState',
  component: AsyncState,
  tags: ['autodocs'],
} satisfies Meta<typeof AsyncState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
    loadingLabel: 'Đang tải khách hàng...',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    errorTitle: 'Không thể tải khách hàng',
    errorDescription: 'Vui lòng kiểm tra kết nối rồi thử lại.',
    retryLabel: 'Thử lại',
    onRetry: () => undefined,
  },
};

export const Empty: Story = {
  args: {
    status: 'empty',
    emptyTitle: 'Chưa có khách hàng',
    emptyDescription: 'Thêm khách hàng đầu tiên để bắt đầu.',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    children: <p>Dữ liệu khách hàng đã tải xong.</p>,
  },
};
