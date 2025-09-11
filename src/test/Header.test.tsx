/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock('@/store/zustand/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      name: 'Test User',
      avatar: '/test-avatar.jpg',
    },
    logout: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@/lib/api/search', () => ({
  searchApi: {
    quickSearch: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('@/components/common', () => ({
  Button: ({ children, onClick }: any) => (
    <button
      onClick={onClick}
      data-testid="button"
    >
      {children}
    </button>
  ),
  Img: ({ src, alt }: any) => (
    <img
      src={src}
      alt={alt}
      data-testid="img"
    />
  ),
  Input: React.forwardRef((props: any, ref: any) => (
    <input
      ref={ref}
      data-testid="input"
      {...props}
    />
  )),
}));

jest.mock('@/components/common/iconography', () => ({
  CSBell: () => <div>Bell</div>,
  CSChatBubble: () => <div>Chat</div>,
  CSWallet: () => <div>Wallet</div>,
}));

jest.mock('lucide-react', () => ({
  LogOut: () => <div>Logout</div>,
  Menu: () => <div>Menu</div>,
  X: () => <div>X</div>,
  Search: () => <div>Search</div>,
}));

jest.mock('@/constants', () => ({
  MENU_ARR: [
    { label: 'Home', url: '/', icon: () => <div>Home</div> },
    { label: 'Profile', url: '/profile', icon: () => <div>Profile</div> },
  ],
  VARIABLE_CONSTANT: {
    SHORT_LOGO: '/short-logo.png',
    DARK_LOGO: '/dark-logo.png',
    EVENT_BANNER: '/event-banner.png',
    NO_AVATAR: '/no-avatar.png',
  },
}));

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    render(<Header />);
    const images = screen.getAllByTestId('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders search input', () => {
    render(<Header />);
    const searchInput = screen.getByTestId('input');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders navigation menu', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Header />);
    expect(screen.getByText('Bell')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();

    const wallets = screen.getAllByText('Wallet');
    expect(wallets.length).toBeGreaterThan(0);
  });

  it('can interact with mobile menu button', () => {
    render(<Header />);
    const menuButton = screen.getByText('Menu').closest('button');
    expect(menuButton).toBeInTheDocument();

    if (menuButton) {
      fireEvent.click(menuButton);
    }
  });

  it('can interact with search input', () => {
    render(<Header />);
    const searchInput = screen.getByTestId('input');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.focus(searchInput);

    expect(searchInput).toHaveValue('test');
  });

  it('can click on profile avatar - alternative', () => {
    render(<Header />);

    const avatarContainer = screen.getByTestId('profile-avatar');
    expect(avatarContainer).toBeInTheDocument();

    fireEvent.click(avatarContainer);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
  });

  it('can click on profile avatar - with testid', () => {
    render(<Header />);

    const avatarContainer = screen.getByTestId('profile-avatar');
    expect(avatarContainer).toBeInTheDocument();

    fireEvent.click(avatarContainer);

    const logoutElements = screen.getAllByText((content, element) => {
      return (
        content === 'Logout' && element?.tagName.toLowerCase() === 'button'
      );
    });

    expect(logoutElements[0]).toBeInTheDocument();

    fireEvent.click(logoutElements[0]);
  });
});
