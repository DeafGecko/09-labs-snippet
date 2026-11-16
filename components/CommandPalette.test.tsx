import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommandPalette from './CommandPalette';

describe('CommandPalette', () => {
  it('runs a category action when a matching quick action is chosen', async () => {
    const onSelectCategory = vi.fn();
    render(
      <CommandPalette
        isOpen
        onClose={vi.fn()}
        onSelectSnippet={vi.fn()}
        onSelectCategory={onSelectCategory}
      />
    );

    await userEvent.type(screen.getByPlaceholderText('Type a command or search snippets...'), 'favorites');
    await userEvent.click(screen.getByText('Go to Favorites'));

    expect(onSelectCategory).toHaveBeenCalledWith('Favorites');
  });
});
