import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewSnippetModal from './NewSnippetModal';

describe('NewSnippetModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <NewSnippetModal isOpen={false} onClose={vi.fn()} onAddSnippet={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not save when title or code is empty', async () => {
    const onAddSnippet = vi.fn();
    render(<NewSnippetModal isOpen onClose={vi.fn()} onAddSnippet={onAddSnippet} />);

    await userEvent.type(screen.getByPlaceholderText('e.g., Glassmorphism Card Effect'), 'Only a title');
    await userEvent.click(screen.getByRole('button', { name: /create|save|add/i }));

    expect(onAddSnippet).not.toHaveBeenCalled();
  });
});
