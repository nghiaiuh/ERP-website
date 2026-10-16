import type { ReactNode } from 'react';

import { cn } from '@/design-system/utils/cn';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 text-4xl text-muted"
        >
          {icon}
        </div>
      )}

      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
