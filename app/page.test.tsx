import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';
import { Snippet } from '@/data/snippets';

const SEARCH_PLACEHOLDER = 'Search snippets, tags, or commands...';

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the seeded snippets on first load', () => {
    render(<Home />);

    expect(screen.getAllByText('Tailwind CSS v4 Quick Setup').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vite Production Build Script').length).toBeGreaterThan(0);
  });

  it('narrows the list as the user types in search', async () => {
    render(<Home />);

    await userEvent.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), 'Vite Production');

    await waitFor(() => {
      expect(screen.queryByText('Tailwind CSS v4 Quick Setup')).not.toBeInTheDocument();
    });
    expect(screen.getAllByText('Vite Production Build Script').length).toBeGreaterThan(0);
  });

  it('loads saved custom snippets alongside the seed data', async () => {
    const custom: Snippet = {
      id: 'custom-test-1',
      category: 'General',
      title: 'My Saved Snippet',
      description: 'Saved in localStorage',
      code: 'console.log("hi")',
      details: '',
      tags: ['Test'],
    };
    localStorage.setItem('09labs-custom-snippets', JSON.stringify([custom]));

    render(<Home />);

    expect(await screen.findByText('My Saved Snippet')).toBeInTheDocument();
  });
});
