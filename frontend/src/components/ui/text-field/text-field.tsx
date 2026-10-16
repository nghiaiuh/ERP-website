'use client';

import {
  Input,
  type InputProps,
  type InputRef,
} from 'antd';
import {
  forwardRef,
  useId,
  type ReactNode,
} from 'react';

import { cn } from '@/design-system/utils/cn';

export interface TextFieldProps
  extends Omit<InputProps, 'status'> {
  label?: ReactNode;
  helpText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
}

export const TextField = forwardRef<
  InputRef,
  TextFieldProps
>(function TextField(
  {
    id: providedId,
    label,
    helpText,
    error,
    required,
    className,
    containerClassName,
    'aria-describedby': providedDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    providedDescribedBy,
    error ? errorId : undefined,
    !error && helpText ? helpId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-danger"
            >
              *
            </span>
          )}
        </label>
      )}

      <Input
        {...props}
        ref={ref}
        id={inputId}
        required={required}
        status={error ? 'error' : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={className}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-danger"
        >
          {error}
        </p>
      ) : helpText ? (
        <p
          id={helpId}
          className="text-sm text-muted"
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
});