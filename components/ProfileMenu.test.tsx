import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProfileMenu from './ProfileMenu';

const requiredProps = {
  currentTheme: 'dark' as const,
  onThemeChange: vi.fn(),
  onOpenSubscription: vi.fn(),
  onOpenHistory: vi.fn(),
  viewMode: 'grid' as const,
  onToggleView: vi.fn(),
};

async function openProfileMenu() {
  await userEvent.click(screen.getByTitle('Open Profile Menu'));
}

async function startEditing() {
  await userEvent.click(screen.getByTitle('Edit Profile'));
}

describe('ProfileMenu', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the default name when nothing is saved', () => {
    render(<ProfileMenu {...requiredProps} />);

    expect(screen.getByTitle('Open Profile Menu')).toHaveTextContent('DR');
  });

  it('shows the saved name from localStorage on the next render', () => {
    localStorage.setItem('09labs-name', JSON.stringify('Ada Lovelace'));

    render(<ProfileMenu {...requiredProps} />);

    expect(screen.getByTitle('Open Profile Menu')).toHaveTextContent('AL');
  });

  it('Cancel discards the draft and keeps the saved name', async () => {
    render(<ProfileMenu {...requiredProps} />);
    await openProfileMenu();
    await startEditing();

    const nameInput = screen.getByPlaceholderText('Full Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Changed Name');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(localStorage.getItem('09labs-name')).toBeNull();
    expect(screen.getByTitle('Open Profile Menu')).toHaveTextContent('DR');
  });

  it('Save stores the new name and title in localStorage', async () => {
    render(<ProfileMenu {...requiredProps} />);
    await openProfileMenu();
    await startEditing();

    const nameInput = screen.getByPlaceholderText('Full Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Ada Lovelace');
    const titleInput = screen.getByPlaceholderText('Professional Title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Analyst');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(JSON.parse(localStorage.getItem('09labs-name')!)).toBe('Ada Lovelace');
    expect(JSON.parse(localStorage.getItem('09labs-title')!)).toBe('Analyst');
    expect(screen.getByTitle('Open Profile Menu')).toHaveTextContent('AL');
  });
});
