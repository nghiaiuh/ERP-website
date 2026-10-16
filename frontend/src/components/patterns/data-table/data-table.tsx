'use client';

import {
  Table,
  type TableColumnsType,
  type TableProps,
} from 'antd';

export interface DataTableProps<T extends object>
  extends Omit<
    TableProps<T>,
    'columns' | 'dataSource' | 'rowKey'
  > {
  columns: TableColumnsType<T>;
  rows: T[];
  rowKey: TableProps<T>['rowKey'];
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  pagination = {
    pageSize: 20,
    showSizeChanger: true,
  },
  scroll,
  ...props
}: DataTableProps<T>) {
  return (
    <Table<T>
      {...props}
      columns={columns}
      dataSource={rows}
      rowKey={rowKey}
      pagination={pagination}
      scroll={{
        x: 'max-content',
        ...scroll,
      }}
    />
  );
}
