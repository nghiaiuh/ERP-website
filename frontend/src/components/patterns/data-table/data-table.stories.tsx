import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataTable } from './data-table';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
}

const rows: CustomerRow[] = [
  {
    id: 'customer-1',
    name: 'Nguyễn Minh Anh',
    email: 'anh@acme.vn',
  },
  {
    id: 'customer-2',
    name: 'Trần Quốc Bảo',
    email: 'bao@acme.vn',
  },
];

function CustomerTable() {
  return (
    <DataTable<CustomerRow>
      columns={[
        { title: 'Khách hàng', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
      ]}
      rows={rows}
      rowKey="id"
    />
  );
}

const meta = {
  title: 'Patterns/DataTable',
  component: CustomerTable,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomerTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
