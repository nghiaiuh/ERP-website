import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderUi } from '@/test/render';

import { AsyncState } from './async-state';

describe('AsyncState', () => {
  it('calls retry from the error state', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderUi(
      <AsyncState
        status="error"
        errorTitle="Không thể tải khách hàng"
        retryLabel="Thử lại"
        onRetry={onRetry}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Thử lại' }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('marks loading content as a live status', () => {
    renderUi(
      <AsyncState
        status="pending"
        loadingLabel="Đang tải khách hàng..."
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Đang tải khách hàng...',
    );
  });
});
