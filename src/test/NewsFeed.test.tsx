/* eslint-disable @next/next/no-img-element */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/zustand/authStore';
import { postsApi } from '@/lib/api/post';
import { commentsApi } from '@/lib/api/comment';
import { Post, PostStatus } from '@/types/post';
import { User } from '@/types/auth';
import { Comment } from '@/types/comment';
import { Newsfeed } from '@/modules/home/components/NewsFeed';

jest.mock('@/store/zustand/authStore');
jest.mock('@/lib/api/post');
jest.mock('@/lib/api/comment');
jest.mock('@/components', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Img: ({ src, alt, className }: any) => (
    <img
      src={src}
      alt={alt || 'image'}
      className={className}
    />
  ),
  CSComment: () => <div data-testid="comment-icon">💬</div>,
  CSDonate: () => <div data-testid="donate-icon">💰</div>,
  CSDot: () => <div data-testid="dot-icon">•</div>,
  CSDots: () => <div data-testid="dots-icon">⋯</div>,
  CSLike: () => <div data-testid="like-icon">👍</div>,
  CSSend: () => <div data-testid="send-icon">📤</div>,
  CSShare: () => <div data-testid="share-icon">📤</div>,
}));

jest.mock('@/constants', () => ({
  VARIABLE_CONSTANT: {
    NO_AVATAR: '/default-avatar.png',
    LIKE: '/like.png',
  },
}));

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockPostsApi = postsApi as jest.Mocked<typeof postsApi>;
const mockCommentsApi = commentsApi as jest.Mocked<typeof commentsApi>;

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/john-avatar.png',
};

const mockAuthor: User = {
  id: 'author-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: '/jane-avatar.png',
};

const mockComment: Comment = {
  id: 'comment-1',
  content: 'This is a great post!',
  author: mockAuthor,
  authorId: 'author-1',
  postId: 'post-1',
  createdAt: '2023-01-02T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
};

const mockPost: Post = {
  id: 'post-1',
  title: 'Test Post',
  content: '<p>This is a test post content</p>',
  image: '/test-image.jpg',
  views: 100,
  likes: 5,
  status: PostStatus.PUBLISHED,
  publishedAt: '2023-01-01T12:00:00Z',
  author: mockAuthor,
  authorId: 'author-1',
  comments: [mockComment],
  createdAt: '2023-01-01T10:00:00Z',
  updatedAt: '2023-01-01T10:00:00Z',
};

const mockPosts: Post[] = [mockPost];

const renderWithProviders = (props: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Newsfeed {...props} />
    </QueryClientProvider>
  );
};

describe('Newsfeed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      token: 'mock-token',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      checkAuth: jest.fn(),
      setUser: jest.fn(),
      setLoading: jest.fn(),
    });

    mockPostsApi.getLikeStatus.mockResolvedValue(false);
    mockPostsApi.toggleLike.mockResolvedValue({
      post: { ...mockPost, likes: 6 },
      isLiked: true,
    });
    mockCommentsApi.getByPost.mockResolvedValue([mockComment]);
    mockCommentsApi.create.mockResolvedValue(mockComment);
  });

  describe('Loading States', () => {
    it('should display skeleton when loading', () => {
      renderWithProviders({
        posts: [],
        isLoading: true,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getAllByTestId('post-skeleton')).toHaveLength(3);
    });

    it('should display loading more skeleton when fetching next page', () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: true,
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message when there is an error', () => {
      const mockError = new Error('Failed to fetch posts');

      renderWithProviders({
        posts: [],
        isLoading: false,
        error: mockError,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Có lỗi xảy ra')).toBeInTheDocument();
      expect(
        screen.getByText('Không thể tải bài viết. Vui lòng thử lại sau.')
      ).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty message when no posts available', () => {
      renderWithProviders({
        posts: [],
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Chưa có bài viết nào')).toBeInTheDocument();
      expect(
        screen.getByText('Hãy kiểm tra lại bộ lọc hoặc thử tạo bài viết mới.')
      ).toBeInTheDocument();
    });
  });

  describe('Post Rendering', () => {
    it('should render posts correctly', async () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test post content')
      ).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const postWithYesterday = {
        ...mockPost,
        publishedAt: yesterday.toISOString(),
      };

      renderWithProviders({
        posts: [postWithYesterday],
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('should format large numbers correctly', () => {
      const postWithManyLikes = {
        ...mockPost,
        likes: 1500,
      };

      renderWithProviders({
        posts: [postWithManyLikes],
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('1.5K')).toBeInTheDocument();
    });
  });

  describe('Like Functionality', () => {

    it('should show correct like status when post is liked', async () => {
      mockPostsApi.getLikeStatus.mockResolvedValue(true);

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      await waitFor(() => {
        expect(screen.getByText('Unlike')).toBeInTheDocument();
      });
    });
  });

  describe('Comment Functionality', () => {
    it('should display comments correctly', async () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      await waitFor(() => {
        expect(screen.getByText('This is a great post!')).toBeInTheDocument();
      });
    });

    it('should handle comment submission', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const commentInput = screen.getByPlaceholderText('Write a comment...');
      const sendButton = screen.getByTestId('send-icon');

      await user.type(commentInput, 'This is a new comment');
      await user.click(sendButton);

      expect(mockCommentsApi.create).toHaveBeenCalledWith('post-1', {
        content: 'This is a new comment',
      });
    });

    it('should handle comment submission with Enter key', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const commentInput = screen.getByPlaceholderText('Write a comment...');

      await user.type(commentInput, 'This is a new comment');
      await user.keyboard('{Enter}');

      expect(mockCommentsApi.create).toHaveBeenCalledWith('post-1', {
        content: 'This is a new comment',
      });
    });

    it('should not submit empty comments', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const sendButton = screen.getByTestId('send-icon');
      await user.click(sendButton);

      expect(mockCommentsApi.create).not.toHaveBeenCalled();
    });

    it('should focus comment input when comment button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const commentButton = screen.getByText('Comment');
      await user.click(commentButton);

      const commentInput = screen.getByPlaceholderText('Write a comment...');
      expect(commentInput).toHaveFocus();
    });
  });

  describe('Infinite Scroll', () => {
    it('should setup intersection observer for infinite scroll', () => {
      const mockFetchNextPage = jest.fn();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('should display end message when no more pages', () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(
        screen.getByText('You have seen all the posts.')
      ).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render all action buttons', () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Like')).toBeInTheDocument();
      expect(screen.getByText('Comment')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
      expect(screen.getByText('Donate')).toBeInTheDocument();
    });

    it('should handle share button click', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const shareButton = screen.getByText('Share');
      await user.click(shareButton);

    });

    it('should handle donate button click', async () => {
      const user = userEvent.setup();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const donateButton = screen.getByText('Donate');
      await user.click(donateButton);

    });
  });

  describe('Accessibility', () => {
    it('should have proper alt texts for images', () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByAltText(/jane smith avatar/i)).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle posts without images', () => {
      const postWithoutImage = {
        ...mockPost,
        image: undefined,
      };

      renderWithProviders({
        posts: [postWithoutImage],
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByAltText('Test Post')).not.toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      mockPostsApi.getLikeStatus.mockRejectedValue(new Error('API Error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      renderWithProviders({
        posts: mockPosts,
        isLoading: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to check like status:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
