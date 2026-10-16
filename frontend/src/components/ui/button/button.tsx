'use client';

import {
  Button as AntButton,
  type ButtonProps as AntButtonProps,
} from 'antd';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/design-system/utils/cn';

export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<
    AntButtonProps,
    | 'type'
    | 'color'
    | 'variant'
    | 'danger'
    | 'size'
    | 'block'
  > {
  intent?: ButtonIntent;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const buttonClasses = cva(
  'font-medium shadow-none',
  {
    variants: {
      intent: {
        primary: 'shadow-sm',
        secondary: '',
        ghost: '',
        danger: 'shadow-sm',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'primary',
      fullWidth: false,
    },
  },
);

const intentMap = {
    primary: {
        type: 'primary',
        danger: false,
    },
    secondary: {
        type: 'default',
        danger: false,
    },
    ghost: {
        type: 'text',
        danger: false,
    },
    danger: {
        type: 'primary',
        danger: true,
    },
} as const;

const sizeMap = {
    sm: 'small',
    md: 'middle',
    lg: 'large',
} as const;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    intent = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    ...props
  },
  ref,
) {
  const config = intentMap[intent];

  return (
    <AntButton
      {...props}
      ref={ref}
      type={config.type}
      danger={config.danger}
      size={sizeMap[size]}
      block={fullWidth}
      className={cn(
        buttonClasses({ intent, fullWidth }),
        className,
      )}
    />
  );
});
