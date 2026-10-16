import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderUi } from '@/test/render';

import { TextField } from './text-field';

describe('TextField', () => {
  it('exposes the label, required state and error to assistive technology', () => {
    renderUi(
      <TextField
        label="Email công việc"
        required
        error="Email không hợp lệ."
      />,
    );

    const input = screen.getByRole('textbox', {
      name: 'Email công việc',
    });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-error'),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Email không hợp lệ.',
    );
  });
});
