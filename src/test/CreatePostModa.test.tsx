
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as postApi from '@/lib/api/post';
import { CreatePostModal } from '@/components';


jest.mock('@ckeditor/ckeditor5-react', () => ({
  CKEditor: ({ onChange, data, ...props }: any) => {
    return (
      <textarea
        data-testid="mock-ckeditor"
        value={data}
        onChange={(e) =>
          onChange && onChange({ editor: { getData: () => e.target.value } })
        }
        {...props}
      />
    );
  },
}));

// Mock API
jest.mock('@/lib/api/post', () => ({
  postsApi: {
    drafts: {
      create: jest.fn(),
      update: jest.fn(),
      publish: jest.fn(),
      discard: jest.fn(),
    },
    uploadImage: jest.fn(),
  },
}));

// ---- RENDER HELPER ----
const queryClient = new QueryClient();

const renderModal = (props: any) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreatePostModal {...props} />
    </QueryClientProvider>
  );

// ---- TESTS ----
describe('CreatePostModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with initial data', () => {
    renderModal({
      isOpen: true,
      onClose: jest.fn(),
      initialData: { title: 'Hello', content: '<p>World</p>' },
    });

    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    expect(screen.getByText(/characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Publish Post/i)).toBeInTheDocument();
  });

  it('calls createDraft when user types title', async () => {
    const mockCreate = postApi.postsApi.drafts.create as jest.Mock;
    mockCreate.mockResolvedValue({ id: 'draft1' });

    renderModal({ isOpen: true, onClose: jest.fn() });

    const titleInput = screen.getByPlaceholderText(/Enter your post title/i);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Title',
          content: '',
        })
      )
    );
  });

  it('opens confirm modal when closing with unsaved changes', async () => {
    renderModal({ isOpen: true, onClose: jest.fn() });

    const titleInput = screen.getByPlaceholderText(/Enter your post title/i);
    fireEvent.change(titleInput, { target: { value: 'Unsaved' } });

    const cancelBtn = screen.getByText(/Cancel$/i);
    fireEvent.click(cancelBtn);

    expect(await screen.findByText(/Save your progress/i)).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const mockUpload = postApi.postsApi.uploadImage as jest.Mock;
    mockUpload.mockResolvedValue({ url: 'https://example.com/image.jpg' });

    renderModal({ isOpen: true, onClose: jest.fn() });

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = screen.getByLabelText(/Featured Image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(mockUpload).toHaveBeenCalledWith(file));
    expect(await screen.findByAltText(/Preview/i)).toBeInTheDocument();
  });
});
