'use client';

import {
  Switch as AntSwitch,
  type SwitchProps as AntSwitchProps,
} from 'antd';

export interface SwitchProps
  extends Omit<
    AntSwitchProps,
    | 'checked'
    | 'defaultChecked'
    | 'value'
    | 'defaultValue'
    | 'onChange'
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  ...props
}: SwitchProps) {
  return (
    <AntSwitch
      {...props}
      checked={checked}
      aria-label={label}
      onChange={(nextChecked) => {
        onCheckedChange(nextChecked);
      }}
    />
  );
}
