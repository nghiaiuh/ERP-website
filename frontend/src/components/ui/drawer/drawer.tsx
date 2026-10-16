'use client';

import {
  Drawer as AntDrawer,
  type DrawerProps as AntDrawerProps,
} from 'antd';
import type { ReactNode } from 'react';

export interface DrawerProps
  extends Omit<
    AntDrawerProps,
    'open' | 'onClose' | 'title' | 'children'
  > {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  ...props
}: DrawerProps) {
  return (
    <AntDrawer
      {...props}
      open={open}
      title={title}
      onClose={() => {
        onOpenChange(false);
      }}
    >
      {children}
    </AntDrawer>
  );
}
