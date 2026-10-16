'use client';

import { Alert, Spin } from 'antd';
import type { ReactNode } from 'react';

import { EmptyState } from '@/components/patterns/empty-state';
import { Button } from '@/components/ui/button';

interface PendingAsyncStateProps {
  status: 'pending';
  loadingLabel: string;
}

interface ErrorAsyncStateProps {
  status: 'error';
  errorTitle: string;
  errorDescription?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

interface EmptyAsyncStateProps {
  status: 'empty';
  emptyTitle: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
}

interface SuccessAsyncStateProps {
  status: 'success';
  children: ReactNode;
}

export type AsyncStateProps =
  | PendingAsyncStateProps
  | ErrorAsyncStateProps
  | EmptyAsyncStateProps
  | SuccessAsyncStateProps;

export function AsyncState(props: AsyncStateProps) {
  switch (props.status) {
    case 'pending':
      return (
        <div
          role="status"
          className="flex min-h-40 items-center justify-center gap-3"
        >
          <Spin />
          <span className="text-muted">
            {props.loadingLabel}
          </span>
        </div>
      );

    case 'error':
      return (
        <Alert
          type="error"
          showIcon
          title={props.errorTitle}
          description={props.errorDescription}
          action={
            props.onRetry && props.retryLabel ? (
              <Button
                intent="secondary"
                onClick={props.onRetry}
              >
                {props.retryLabel}
              </Button>
            ) : undefined
          }
        />
      );

    case 'empty':
      return (
        <EmptyState
          title={props.emptyTitle}
          description={props.emptyDescription}
          icon={props.emptyIcon}
          action={props.emptyAction}
        />
      );

    case 'success':
      return props.children;
  }
}
