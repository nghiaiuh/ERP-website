'use client';

import {
  Checkbox as AntCheckbox,
  type CheckboxProps as AntCheckboxProps,
} from 'antd';
import type { ReactNode } from 'react';

export interface CheckboxProps
  extends Omit<
    AntCheckboxProps,
    'checked' | 'defaultChecked' | 'onChange' | 'children'
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  ...props
}: CheckboxProps) {
  return (
    <AntCheckbox
      {...props}
      checked={checked}
      onChange={(event) => {
        onCheckedChange(event.target.checked);
      }}
    >
      {label}
    </AntCheckbox>
  );
}
