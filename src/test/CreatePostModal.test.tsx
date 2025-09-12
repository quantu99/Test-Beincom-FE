/* eslint-disable @next/next/no-img-element */
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
import { CreatePostModal } from '@/components';

jest.mock('@/lib/api/post', () => ({
  postsApi: {
    uploadImage: jest.fn(),
    drafts: {
      create: jest.fn(),
      update: jest.fn(),
      publish: jest.fn(),
      discard: jest.fn(),
    },
  },
}));

jest.mock('@ckeditor/ckeditor5-react', () => ({
  CKEditor: ({ onChange, data }: any) => (
    <textarea
      data-testid="ckeditor"
      value={data || ''}
      onChange={(e) => {
        const mockEditor = {
          getData: () => e.target.value,
        };
        onChange?.(null, mockEditor);
      }}
      placeholder="Start typing your content here..."
    />
  ),
}));

jest.mock('@ckeditor/ckeditor5-build-classic', () => ({}));

jest.mock('@/components', () => {
  const actual = jest.requireActual('@/components');
  return {
    ...actual,
    Dialog: ({ children, open, onOpenChange }: any) =>
      open ? (
        <div
          data-testid="dialog"
          onClick={() => onOpenChange?.(false)}
        >
          {children}
        </div>
      ) : null,
    DialogContent: ({ children, className }: any) => (
      <div
        data-testid="dialog-content"
        className={className}
      >
        {children}
      </div>
    ),
    Button: ({ children, onClick, disabled, className, ...props }: any) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid={props['data-testid'] || 'button'}
        {...props}
      >
        {children}
      </button>
    ),
    Img: ({ src, alt, className }: any) => (
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid="image"
      />
    ),
    Input: ({
      label,
      value,
      onChange,
      placeholder,
      required,
      ...props
    }: any) => {
      const id =
        props.id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div>
          {label && <label htmlFor={id}>{label}</label>}
          <input
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            data-testid={props['data-testid'] || 'input'}
            {...props}
          />
        </div>
      );
    },
  };
});

jest.mock('lucide-react', () => ({
  PenTool: () => <span data-testid="pen-tool-icon">PenTool</span>,
  Send: () => <span data-testid="send-icon">Send</span>,
  X: () => <span data-testid="x-icon">X</span>,
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  Image: () => <span data-testid="image-icon">Image</span>,
  Trash2: () => <span data-testid="trash-icon">Trash2</span>,
  Save: () => <span data-testid="save-icon">Save</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
  Loader2: () => <span data-testid="loader-icon">Loader2</span>,
}));

const mockedPostsApi = postsApi as jest.Mocked<typeof postsApi>;
const mockedDraftsApi = mockedPostsApi.drafts as jest.Mocked<
  typeof mockedPostsApi.drafts
>;

describe('CreatePostModal', () => {
  let queryClient: QueryClient;
  const mockOnClose = jest.fn();

  const renderComponent = (props = {}) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <CreatePostModal
          isOpen={true}
          onClose={mockOnClose}
          {...props}
        />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the modal when isOpen is true', () => {
      renderComponent();

      expect(
        screen.getByRole('heading', { name: /create new post/i })
      ).toBeInTheDocument();

      expect(
        screen.getByText(/share your thoughts with the community/i)
      ).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderComponent();

      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Featured Image/i)).toBeInTheDocument();

      expect(
        screen.getByText(/Content/i, { selector: 'label' })
      ).toBeInTheDocument();

      expect(screen.getByTestId('ckeditor')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderComponent();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Publish Post')).toBeInTheDocument();
    });

    it('displays draft mode when draftId is provided', () => {
      renderComponent({ draftId: 'draft-123' });

      expect(screen.getByText('Draft Mode')).toBeInTheDocument();
    });

    it('shows initial data when provided', () => {
      const initialData = {
        title: 'Test Title',
        content: 'Test Content',
        image: 'test-image.jpg',
      };

      renderComponent({ initialData });

      expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('updates title when user types', async () => {
      const user = userEvent.setup({ delay: null });
      renderComponent();

      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'My New Post');

      expect(titleInput).toHaveValue('My New Post');
    });

    it('updates content when user types in editor', async () => {
      const user = userEvent.setup({ delay: null });
      renderComponent();

      const contentEditor = screen.getByTestId('ckeditor');
      await user.type(contentEditor, 'This is my post content');

      expect(contentEditor).toHaveValue('This is my post content');
    });

    it('shows character count for title', () => {
      renderComponent({
        initialData: { title: 'Test', content: '', image: '' },
      });

      expect(screen.getByText('4/100 characters')).toBeInTheDocument();
    });

    it('displays character count for content', () => {
      renderComponent({
        initialData: { title: '', content: 'Hello World', image: '' },
      });

      expect(screen.getByText('11 characters')).toBeInTheDocument();
    });
  });

  describe('Image Upload', () => {
    it('shows upload area when no image is selected', () => {
      renderComponent();

      expect(screen.getByText('Click to upload image')).toBeInTheDocument();
      expect(screen.getByText('PNG, JPG, GIF up to 5MB')).toBeInTheDocument();
    });

    it('handles image selection', async () => {
      const user = userEvent.setup({ delay: null });
      mockedPostsApi.uploadImage.mockResolvedValue({
        message: 'Success',
        imageUrl: 'http://example.com/image.jpg',
        filename: 'image.jpg',
        originalName: 'image.jpg',
        size: 12345,
        url: 'http://example.com/image.jpg',
      });

      renderComponent();

      const file = new File(['dummy content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const fileInput = screen.getByLabelText(
        /featured image/i
      ) as HTMLInputElement;

      await user.upload(fileInput, file);

      expect(mockedPostsApi.uploadImage).toHaveBeenCalledWith(file);

      expect(await screen.findByAltText('Preview')).toBeInTheDocument();
    });

    it('shows image preview after upload', async () => {
      mockedPostsApi.uploadImage.mockResolvedValue({
        message: 'Success',
        imageUrl: 'http://example.com/image.jpg',
        filename: 'image.jpg',
        originalName: 'image.jpg',
        size: 12345,
        url: 'http://example.com/image.jpg',
      });

      renderComponent();

      const file = new File(['hello'], 'test.png', { type: 'image/png' });

      const input = screen.getByLabelText(
        /featured image/i
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      expect(await screen.findByAltText('Preview')).toBeInTheDocument();
    });

    it('allows removing uploaded image (footer button)', async () => {
      const user = userEvent.setup({ delay: null });
      renderComponent({
        initialData: { title: '', content: '', image: 'test-image.jpg' },
      });

      const removeButton = await screen.findByRole('button', {
        name: /remove image \(footer\)/i,
      });
      await user.click(removeButton);

      expect(screen.getByText('Click to upload image')).toBeInTheDocument();
    });

    it('allows removing uploaded image (overlay button)', async () => {
      const user = userEvent.setup({ delay: null });
      renderComponent({
        initialData: { title: '', content: '', image: 'test-image.jpg' },
      });

      const removeButton = await screen.findByRole('button', {
        name: /remove image \(overlay\)/i,
      });
      await user.click(removeButton);

      expect(screen.getByText('Click to upload image')).toBeInTheDocument();
    });
  });

  describe('Draft Management', () => {
    it('creates draft when user starts typing', async () => {
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);

      renderComponent();

      const titleInput = screen.getByLabelText(/Title/);

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const calls = mockedDraftsApi.create.mock.calls;
        const lastCall = calls[calls.length - 1];

        expect(lastCall[0]).toEqual(
          expect.objectContaining({
            title: 'Test Title',
            content: expect.any(String),
            image: undefined,
          })
        );
      });
    });

    it('shows auto-save status', async () => {
      renderComponent();

      expect(screen.getByText('Ready to write')).toBeInTheDocument();
    });

    it('updates existing draft', async () => {
      mockedDraftsApi.update.mockResolvedValue({} as any);

      renderComponent({
        draftId: 'draft-123',
        initialData: {
          title: 'Existing Title',
          content: 'Existing Content',
          image: '',
        },
      });

      const titleInput = screen.getByLabelText(/Title/);

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const calls = mockedDraftsApi.update.mock.calls;
        const lastCall = calls[calls.length - 1];

        expect(lastCall[1]).toEqual(
          expect.objectContaining({
            title: 'Updated Title',
            content: expect.any(String),
            image: undefined,
          })
        );
      });
    });
  });

  describe('Publishing', () => {
    it('publishes post with valid data', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);
      mockedDraftsApi.publish.mockResolvedValue({} as any);

      renderComponent();

      const titleInput = screen.getByLabelText(/Title/);
      const contentEditor = screen.getByTestId('ckeditor');
      const publishButton = screen.getByText('Publish Post');

      await user.type(titleInput, 'Test Title');
      await user.type(contentEditor, 'Test Content');
      await user.click(publishButton);

      await waitFor(() => {
        expect(mockedDraftsApi.publish).toHaveBeenCalled();
      });
    });

    it('disables publish button when data is invalid', () => {
      renderComponent();

      const publishButton = screen.getByText('Publish Post');
      expect(publishButton).toBeDisabled();
    });

    it('shows loading state during publish', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);

      mockedDraftsApi.publish.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderComponent();

      const titleInput = screen.getByLabelText(/Title/);
      const contentEditor = screen.getByTestId('ckeditor');
      const publishButton = screen.getByText('Publish Post');

      await user.type(titleInput, 'Test Title');
      await user.type(contentEditor, 'Test Content');
      await user.click(publishButton);

      expect(screen.getByText('Publishing Magic...')).toBeInTheDocument();
    });
  });

  describe('Modal Closing', () => {
    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      renderComponent();

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows confirmation modal when closing with unsaved changes', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);

      renderComponent({ draftId: 'draft-123' });

      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Changed Title');

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.getByText('Save your progress?')).toBeInTheDocument();
      expect(
        screen.getByText('You have unsaved changes. What would you like to do?')
      ).toBeInTheDocument();
    });

    it('handles discard in confirmation modal', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);
      mockedDraftsApi.discard.mockResolvedValue();

      renderComponent({ draftId: 'draft-123' });

      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Changed Title');

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      const discardButton = screen.getByText('Discard');
      await user.click(discardButton);

      await waitFor(() => {
        expect(mockedDraftsApi.discard).toHaveBeenCalledWith('draft-123');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('handles save draft in confirmation modal', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);
      mockedDraftsApi.update.mockResolvedValue({} as any);

      renderComponent({ draftId: 'draft-123' });

      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Changed Title');

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      const saveDraftButton = screen.getByText('Save Draft');
      await user.click(saveDraftButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles image upload error', async () => {
      const user = userEvent.setup({ delay: null });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      mockedPostsApi.uploadImage.mockRejectedValue(new Error('Upload failed'));

      renderComponent();

      const file = new File(['dummy content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen.getByLabelText(
        /Featured Image/i
      ) as HTMLInputElement;
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Image upload failed:',
          expect.any(Error)
        );
        expect(alertSpy).toHaveBeenCalledWith(
          'Upload ảnh thất bại. Vui lòng thử lại.'
        );
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('shows error status for auto-save failure', async () => {
      const user = userEvent.setup({ delay: null });
      mockedDraftsApi.create.mockResolvedValue({
        id: 'draft-123',
        title: 'Test Title',
        content: 'Test Content',
      } as any);
      mockedDraftsApi.update.mockRejectedValue(new Error('Save failed'));

      renderComponent({ draftId: 'draft-123' });

      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Updated Title');

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(screen.getByText('Save failed')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('shows required indicators', () => {
      renderComponent();

      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('has proper button roles', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: /Cancel/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Publish Post/ })
      ).toBeInTheDocument();
    });
  });
});
