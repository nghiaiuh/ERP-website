'use client';

import { ReactNode } from "react";

import {
    Button,
    type ButtonProps,
} from '@/components/ui/button';

export interface IconButtonProps
    extends Omit<
        ButtonProps,
        'children' | 'icon' | 'shape' | 'aria-label'
    > {
        label: string;
        icon: ReactNode;
        showTooltip?: boolean
}

export function IconButton({
    label,
    icon,
    showTooltip = true,
    ...props
}: IconButtonProps) {
    return (
        <Button 
            {...props}
            shape="circle"
            icon={icon}
            aria-label={label}
            title={showTooltip ? label : undefined}
        />
    );
}