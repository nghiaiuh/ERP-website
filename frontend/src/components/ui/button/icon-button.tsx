'use client';

import {
  forwardRef,
  type ReactNode,
} from 'react';

import {
    Button,
    type ButtonProps,
} from './button';

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    'children' | 'icon' | 'shape' | 'aria-label'
  > {
  label: string;
  icon: ReactNode;
  showTooltip?: boolean;
}

export const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>(function IconButton(
  {
    label,
    icon,
    showTooltip = true,
    ...props
  },
  ref,
) {
    return (
      <Button
        {...props}
        ref={ref}
        shape="circle"
        icon={icon}
        aria-label={label}
        title={showTooltip ? label : undefined}
      />
    );
});
