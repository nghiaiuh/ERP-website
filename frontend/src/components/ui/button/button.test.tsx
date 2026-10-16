import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderUi } from '@/test/render';

import { Button } from './button';

describe('Button', () => {
  it('calls onClick when a user activates it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderUi(
      <Button onClick={onClick}>
        Lưu thay đổi
      </Button>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Lưu thay đổi' }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not activate when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderUi(
      <Button disabled onClick={onClick}>
        Lưu thay đổi
      </Button>,
    );

    const button = screen.getByRole('button', {
      name: 'Lưu thay đổi',
    });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});
