import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SandboxDrawer from './SandboxDrawer';

// jsdom does not run scripts inside iframes, so these tests stand in for the
// sandboxed runner by posting its result message. The real execution path is
// covered by the browser test (e2e/sandbox.spec.ts).
function postRunnerResult(frame: HTMLIFrameElement, logs: string[]) {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type: '09labs-sandbox', logs },
      source: frame.contentWindow,
    })
  );
}

describe('SandboxDrawer', () => {
  it('runs the code in an iframe that cannot access the page origin', async () => {
    const { container } = render(<SandboxDrawer isOpen onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /run/i }));

    const frame = container.querySelector('iframe');
    expect(frame).not.toBeNull();
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts');
    expect(frame?.getAttribute('sandbox')).not.toContain('allow-same-origin');
  });

  it('shows the logs the runner reports back', async () => {
    const { container } = render(<SandboxDrawer isOpen onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /run/i }));

    postRunnerResult(container.querySelector('iframe')!, ['09 Labs Sandbox Active']);

    await waitFor(() =>
      expect(screen.getByLabelText('Console Output')).toHaveValue('09 Labs Sandbox Active')
    );
  });

  it('ignores messages that do not come from its own iframe', async () => {
    render(<SandboxDrawer isOpen onClose={vi.fn()} />);

    window.dispatchEvent(
      new MessageEvent('message', { data: { type: '09labs-sandbox', logs: ['spoofed'] }, source: window })
    );

    expect(screen.getByLabelText('Console Output')).toHaveValue('Ready for execution...');
  });
});
