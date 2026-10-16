'use client';

import {
  Select,
  type SelectProps,
} from 'antd';
import {
  useId,
  type ReactNode,
} from 'react';

import { cn } from '@/design-system/utils/cn';

export type SelectFieldValue = string | number;

export interface SelectFieldOption<
  Value extends SelectFieldValue,
> {
  label: ReactNode;
  value: Value;
  disabled?: boolean;
}

export interface SelectFieldProps<
  Value extends SelectFieldValue,
> extends Omit<
    SelectProps<Value>,
    'options' | 'status'
  > {
  label?: ReactNode;
  helpText?: ReactNode;
  error?: ReactNode;
  options: SelectFieldOption<Value>[];
  required?: boolean;
  containerClassName?: string;
}

export function SelectField<
  Value extends SelectFieldValue,
>({
  id: providedId,
  label,
  helpText,
  error,
  options,
  required,
  className,
  containerClassName,
  ...props
}: SelectFieldProps<Value>) {
  const generatedId = useId();
  const selectId = providedId ?? generatedId;
  const helpId = `${selectId}-help`;
  const errorId = `${selectId}-error`;

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
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

      <Select<Value>
        {...props}
        id={selectId}
        options={options}
        status={error ? 'error' : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? errorId
            : helpText
              ? helpId
              : undefined
        }
        className={cn('w-full', className)}
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
}