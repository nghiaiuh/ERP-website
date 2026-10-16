'use client';

import {
  Modal as AntModal,
  type ModalProps as AntModalProps,
} from 'antd';
import type { ReactNode } from 'react';

export interface ModalProps
  extends Omit<
    AntModalProps,
    'open' | 'onCancel' | 'title' | 'children'
  > {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  ...props
}: ModalProps) {
  return (
    <AntModal
      {...props}
      open={open}
      title={title}
      onCancel={() => {
        onOpenChange(false);
      }}
    >
      {children}
    </AntModal>
  );
}
