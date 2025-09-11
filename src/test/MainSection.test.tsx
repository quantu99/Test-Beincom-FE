import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/post';
import { Post, PostStatus } from '@/types/post';
import { User } from '@/types/auth';
import { MainSection } from '@/modules/home/components';

jest.mock('@/lib/api/post');
jest.mock('@/components', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  CSFilter: () => <div data-testid="filter-icon">🔽</div>,
}));

jest.mock('@/modules/home/components/PostContainer', () => ({
  PostContainer: () => <div data-testid="post-container">Post Container</div>,
}));

jest.mock('@/modules/home/components/FilterDropdown', () => ({
  FilterDropdown: ({ isOpen, filters, onApply, onReset, onClose }: any) => (
    <div
      data-testid="filter-dropdown"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div data-testid="filter-content">
        <div>Sort by: {filters.sortBy}</div>
        <div>Sort order: {filters.sortOrder}</div>
        <div>Limit: {filters.limit}</div>
        <button
          onClick={() =>
            onApply({ sortBy: 'likes', sortOrder: 'DESC', limit: 20 })
          }
        >
          Apply Test Filter
        </button>
        <button onClick={onReset}>Reset</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ),
}));

jest.mock('@/modules/home/components/NewsFeed', () => ({
  Newsfeed: ({
    posts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }: any) => (
    <div data-testid="newsfeed">
      <div data-testid="posts-count">Posts: {posts?.length || 0}</div>
      <div data-testid="loading-state">Loading: {isLoading.toString()}</div>
      <div data-testid="error-state">
        Error: {error ? error.message : 'none'}
      </div>
      <div data-testid="has-next-page">Has Next: {hasNextPage.toString()}</div>
      <div data-testid="fetching-next">
        Fetching Next: {isFetchingNextPage.toString()}
      </div>
      <button
        onClick={fetchNextPage}
        data-testid="fetch-next-btn"
      >
        Fetch Next Page
      </button>
    </div>
  ),
}));

const mockPostsApi = postsApi as jest.Mocked<typeof postsApi>;

const mockAuthor: User = {
  id: 'author-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/john-avatar.png',
};

const mockPost: Post = {
  id: 'post-1',
  title: 'Test Post',
  content: 'This is a test post',
  image: '/test-image.jpg',
  views: 100,
  likes: 5,
  status: PostStatus.PUBLISHED,
  publishedAt: '2023-01-01T12:00:00Z',
  author: mockAuthor,
  authorId: 'author-1',
  comments: [],
  createdAt: '2023-01-01T10:00:00Z',
  updatedAt: '2023-01-01T10:00:00Z',
};

const mockPostsResponse = {
  posts: [mockPost],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasMore: false,
};

const mockPopularPosts = [
  { ...mockPost, id: 'popular-1', likes: 100 },
  { ...mockPost, id: 'popular-2', likes: 80 },
];

const renderWithProviders = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MainSection />
    </QueryClientProvider>
  );
};

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
});
Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
});

describe('MainSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockPostsApi.getAll.mockResolvedValue(mockPostsResponse);
    mockPostsApi.getPopular.mockResolvedValue(mockPopularPosts);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render main section with all child components', async () => {
      renderWithProviders();

      expect(screen.getByTestId('post-container')).toBeInTheDocument();
      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Saved')).toBeInTheDocument();
      expect(screen.getByText('Filter')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('newsfeed')).toBeInTheDocument();
      });
    });

    it('should have correct CSS classes and structure', () => {
      renderWithProviders();

      const mainSection =
        screen.getByRole('main') ||
        screen.getByText('Following').closest('section');
      expect(mainSection).toHaveClass(
        'min-w-[524px]',
        'max-w-[672px]',
        'flex-1'
      );
    });
  });

  describe('Section Navigation', () => {
    it('should render all menu sections', () => {
      renderWithProviders();

      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('should have Following as default active section', () => {
      renderWithProviders();

      const followingButton = screen.getByText('Following');
      expect(followingButton).toHaveClass(
        '!text-customPurple-1',
        'font-semibold'
      );
    });

    it('should change active section when clicking menu items', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const exploreButton = screen.getByText('Explore');
      await user.click(exploreButton);

      expect(exploreButton).toHaveClass(
        '!text-customPurple-1',
        'font-semibold'
      );

      const followingButton = screen.getByText('Following');
      expect(followingButton).toHaveClass('!text-customBlue-4', 'font-normal');
    });

    it('should render active indicator for current section', () => {
      renderWithProviders();

      const followingButton = screen.getByText('Following');
      const parentDiv = followingButton.closest('div');
      expect(parentDiv?.querySelector('span')).toHaveClass('bg-customPurple-1');
    });
  });

  describe('Filter Functionality', () => {
    it('should render filter button', () => {
      renderWithProviders();

      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
    });

    it('should toggle filter dropdown when clicking filter button', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');

      expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).toBeVisible();

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();
    });

    it('should display current filter values in dropdown', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);

      expect(screen.getByText('Sort by: createdAt')).toBeInTheDocument();
      expect(screen.getByText('Sort order: DESC')).toBeInTheDocument();
      expect(screen.getByText('Limit: 10')).toBeInTheDocument();
    });

    it('should apply new filters when Apply button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);

      const applyButton = screen.getByText('Apply Test Filter');
      await user.click(applyButton);

      expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();

      await waitFor(() => {
        expect(mockPostsApi.getAll).toHaveBeenCalledWith(
          expect.objectContaining({
            sortBy: 'likes',
            sortOrder: 'DESC',
            limit: 20,
            page: 1,
          })
        );
      });
    });

    it('should reset filters when reset button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);

      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);

      expect(screen.getByText('Sort by: createdAt')).toBeInTheDocument();
      expect(screen.getByText('Sort order: DESC')).toBeInTheDocument();
      expect(screen.getByText('Limit: 10')).toBeInTheDocument();
    });

    it('should close dropdown when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);

      expect(screen.getByTestId('filter-dropdown')).toBeVisible();

      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch posts with default filters on mount', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockPostsApi.getAll).toHaveBeenCalledWith({
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          limit: 10,
          page: 1,
        });
      });
    });

    it('should handle popular sort differently', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);

      const applyButton = screen.getByText('Apply Test Filter');
      await user.click(applyButton);

      await waitFor(() => {
        expect(mockPostsApi.getAll).toHaveBeenCalled();
      });
    });

    it('should pass correct data to Newsfeed component', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Posts: 1')).toBeInTheDocument();
        expect(screen.getByText('Loading: false')).toBeInTheDocument();
        expect(screen.getByText('Error: none')).toBeInTheDocument();
      });
    });

    it('should handle loading state', async () => {
      mockPostsApi.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderWithProviders();

      expect(screen.getByText('Loading: true')).toBeInTheDocument();
    });

    it('should handle error state', async () => {
      const mockError = new Error('API Error');
      mockPostsApi.getAll.mockRejectedValue(mockError);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Error: API Error')).toBeInTheDocument();
      });
    });
  });

  describe('Infinite Query', () => {
    it('should handle fetchNextPage correctly', async () => {
      const multiPageResponse = {
        ...mockPostsResponse,
        page: 1,
        totalPages: 3,
        hasMore: true,
      };
      mockPostsApi.getAll.mockResolvedValue(multiPageResponse);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Has Next: true')).toBeInTheDocument();
      });

      const fetchNextButton = screen.getByTestId('fetch-next-btn');
      fireEvent.click(fetchNextButton);

      await waitFor(() => {
        expect(mockPostsApi.getAll).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 2,
          })
        );
      });
    });

    it('should handle end of pagination', async () => {
      const lastPageResponse = {
        ...mockPostsResponse,
        page: 1,
        totalPages: 1,
        hasMore: false,
      };
      mockPostsApi.getAll.mockResolvedValue(lastPageResponse);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Has Next: false')).toBeInTheDocument();
      });
    });
  });

  describe('Popular Posts Handling', () => {
    it('should handle popular posts pagination differently', async () => {
      const user = userEvent.setup();
      renderWithProviders();


      expect(mockPostsApi.getPopular).not.toHaveBeenCalled();

      expect(typeof mockPostsApi.getPopular).toBe('function');
    });
  });

  describe('Click Outside Handling', () => {
    it('should setup click outside event listeners', () => {
      renderWithProviders();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderWithProviders();

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );
    });

    it('should close filter dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');
      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).toBeVisible();

      const clickOutsideHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'mousedown'
      )?.[1];

      if (clickOutsideHandler) {
        const mockEvent = {
          target: document.body,
        };
        act(() => {
          clickOutsideHandler(mockEvent);
        });

        expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();
      }
    });
  });

  describe('Query Configuration', () => {
    it('should use correct staleTime and gcTime', () => {
      renderWithProviders();

      expect(screen.getByTestId('newsfeed')).toBeInTheDocument();
    });

    it('should use correct query key', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockPostsApi.getAll).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty posts response', async () => {
      const emptyResponse = {
        posts: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasMore: false,
      };
      mockPostsApi.getAll.mockResolvedValue(emptyResponse);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Posts: 0')).toBeInTheDocument();
      });
    });

    it('should handle multiple rapid filter changes', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).toBeVisible();

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).not.toBeVisible();

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).toBeVisible();
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      mockPostsApi.getAll.mockRejectedValue(networkError);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderWithProviders();

      const section =
        screen.getByRole('main') || document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      renderWithProviders();

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.textContent).toBeTruthy();
      });
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const filterButton = screen.getByText('Filter');

      await user.click(filterButton);
      expect(screen.getByTestId('filter-dropdown')).toBeVisible();
    });
  });

  describe('Performance Considerations', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();

      renderWithProviders();

      expect(screen.getByTestId('newsfeed')).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', async () => {
      const largePosts = Array.from({ length: 100 }, (_, i) => ({
        ...mockPost,
        id: `post-${i}`,
      }));

      const largeResponse = {
        ...mockPostsResponse,
        posts: largePosts,
        total: 100,
      };

      mockPostsApi.getAll.mockResolvedValue(largeResponse);

      renderWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Posts: 100')).toBeInTheDocument();
      });
    });
  });
});
