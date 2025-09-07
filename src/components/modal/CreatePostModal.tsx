/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  PenTool,
  Send,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  Check,
  Loader2,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, DialogContent, Button, Img } from '../common';
import {
  Post,
  PostStatus,
  CreateDraftDto,
  UpdateDraftDto,
  PublishDraftDto,
} from '@/types/post';
import { postsApi } from '@/lib/api/post';

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
  initialData?: {
    title: string;
    content: string;
    image?: string;
  };
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onDiscard,
  onSaveDraft,
  isLoading,
}: ConfirmModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white max-w-md p-6 rounded-xl shadow-2xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Save your progress?
          </h3>
          <p className="text-gray-600 mb-6">
            You have unsaved changes. What would you like to do?
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onDiscard}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button
              onClick={onSaveDraft}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreatePostModal({
  isOpen,
  onClose,
  draftId,
  initialData,
}: PropsType) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(
    draftId
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'saved' | 'saving' | 'error'
  >('saved');
  const [imageUploadStatus, setImageUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => postsApi.uploadImage(file),
    onMutate: () => {
      setImageUploadStatus('uploading');
    },
    onSuccess: (result) => {
      setImageUrl(result.url);
      setImageUploadStatus('success');
      setHasUnsavedChanges(true);
      // Auto-save draft if exists
      if (currentDraftId) {
        setAutoSaveStatus('saving');
        updateDraftMutation.mutate({
          id: currentDraftId,
          data: {
            title: title.trim() || 'Untitled Draft',
            content: content.trim() || 'Untitled Content',
            image: result.url,
          },
        });
      }
    },
    onError: (error) => {
      console.error('Image upload failed:', error);
      setImageUploadStatus('error');
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    },
  });

  // Updated mutations to use image URL instead of file
  const createDraftMutation = useMutation({
    mutationFn: (data: CreateDraftDto) => postsApi.drafts.create(data),
    onSuccess: (draft: Post) => {
      setCurrentDraftId(draft.id);
      setHasUnsavedChanges(false);
      setAutoSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDraftDto }) =>
      postsApi.drafts.update(id, data),
    onSuccess: () => {
      setAutoSaveStatus('saved');
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
    onError: () => {
      setAutoSaveStatus('error');
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: PublishDraftDto }) =>
      postsApi.drafts.publish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      resetForm();
      onClose();
    },
  });

  const discardDraftMutation = useMutation({
    mutationFn: (id: string) => postsApi.drafts.discard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      setCurrentDraftId(undefined);
    },
  });

  // Auto-create draft when user starts typing
  const createDraftIfNeeded = useCallback(async () => {
    if (!currentDraftId && (title.trim() || content.trim())) {
      try {
        await createDraftMutation.mutateAsync({
          title: title.trim() || 'Untitled Draft',
          content: content.trim() || 'Untitled Content',
          image: imageUrl || undefined,
        });
      } catch (error) {
        console.error('Failed to create draft:', error);
      }
    }
  }, [currentDraftId, title, content, imageUrl]);

  // Auto-save draft
  const autoSave = useCallback(async () => {
    if (!currentDraftId || !hasUnsavedChanges) return;

    setAutoSaveStatus('saving');

    try {
      await updateDraftMutation.mutateAsync({
        id: currentDraftId,
        data: {
          title: title.trim() || 'Untitled Draft',
          content: content.trim() || 'Untitled Content',
          image: imageUrl || undefined,
        },
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  }, [currentDraftId, hasUnsavedChanges, title, content, imageUrl]);

  // Auto-save effect
  useEffect(() => {
    if (!currentDraftId || !hasUnsavedChanges) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [autoSave, hasUnsavedChanges]);

  // Track changes
  useEffect(() => {
    const initialTitle = initialData?.title || '';
    const initialContent = initialData?.content || '';
    const initialImage = initialData?.image || null;

    if (
      title !== initialTitle ||
      content !== initialContent ||
      imageUrl !== initialImage
    ) {
      setHasUnsavedChanges(true);
      // Auto-create draft when user starts typing
      if (!currentDraftId) {
        createDraftIfNeeded();
      }
    }
  }, [title, content, imageUrl, initialData, createDraftIfNeeded]);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    uploadImageMutation.mutate(file);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreview(null);
    setImageUploadStatus('idle');
    setHasUnsavedChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    // If no draft exists, create one first
    if (!currentDraftId) {
      try {
        await createDraftMutation.mutateAsync({
          title: title.trim(),
          content,
          image: imageUrl || undefined,
        });
      } catch (error) {
        console.error('Failed to create draft before publishing:', error);
        alert('Có lỗi xảy ra khi tạo draft. Vui lòng thử lại.');
        return;
      }
    }

    // Now publish the draft
    if (currentDraftId) {
      try {
        const publishData = hasUnsavedChanges
          ? {
              title: title.trim(),
              content,
              image: imageUrl || undefined,
            }
          : undefined;

        await publishMutation.mutateAsync({
          id: currentDraftId,
          data: publishData,
        });
      } catch (error) {
        console.error('Error publishing post:', error);
        alert('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
      }
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges && currentDraftId) {
      setShowConfirmModal(true);
      return;
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl(null);
    setImagePreview(null);
    setCurrentDraftId(undefined);
    setHasUnsavedChanges(false);
    setAutoSaveStatus('saved');
    setImageUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmDiscard = async () => {
    if (currentDraftId) {
      try {
        await discardDraftMutation.mutateAsync(currentDraftId);
      } catch (error) {
        console.error('Error discarding draft:', error);
      }
    }
    setShowConfirmModal(false);
    resetForm();
    onClose();
  };

  const handleConfirmSave = async () => {
    if (currentDraftId && hasUnsavedChanges) {
      await autoSave();
    }
    setShowConfirmModal(false);
    resetForm();
    onClose();
  };

  const getAutoSaveText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'error':
        return 'Save failed';
      case 'saved':
      default:
        return currentDraftId ? 'Draft saved automatically' : 'Ready to write';
    }
  };

  const getImageUploadStatusIcon = () => {
    switch (imageUploadStatus) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getImageUploadStatusText = () => {
    switch (imageUploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Upload successful';
      case 'error':
        return 'Upload failed';
      default:
        return null;
    }
  };

  const isLoading =
    createDraftMutation.isPending ||
    updateDraftMutation.isPending ||
    publishMutation.isPending ||
    discardDraftMutation.isPending ||
    uploadImageMutation.isPending;

  const isImageUploading = uploadImageMutation.isPending;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={handleClose}
      >
        <DialogContent className="bg-white max-w-[1400px] lg:min-w-[800px] h-[90vh] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, #6F32BB 0%, #8043CC 50%, #B3B9DA 100%)`,
              }}
            ></div>
            <div
              className="relative flex items-center justify-between px-6 py-5 border-b"
              style={{
                borderColor: '#DAC9F0',
                background: `linear-gradient(135deg, #DAC9F0 0%, #B3B9DA 100%)`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl shadow-lg"
                  style={{ backgroundColor: '#6F32BB' }}
                >
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: '#5F2BA0' }}
                  >
                    Create New Post
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: '#6F32BB' }}
                  >
                    Share your thoughts with the community
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: '#5F2BA0' }}
                >
                  {currentDraftId ? 'Draft Mode' : 'New Post'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto flex flex-col bg-gradient-to-b from-white to-gray-50">
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: '#5F2BA0' }}
              >
                Title <span style={{ color: '#6F32BB' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter your post title..."
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 text-lg font-medium"
                style={{
                  borderColor: title ? '#8043CC' : '#DAC9F0',
                  backgroundColor: 'white',
                  color: '#374151',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6F32BB';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(111, 50, 187, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = title ? '#8043CC' : '#DAC9F0';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div
                className="text-xs mt-2 px-3 py-1 rounded-full inline-block font-medium"
                style={{
                  backgroundColor: '#DAC9F0',
                  color: '#5F2BA0',
                }}
              >
                {title.length}/100 characters
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: '#5F2BA0' }}
              >
                Featured Image{' '}
                <span className="text-xs font-normal opacity-75">
                  (Optional)
                </span>
              </label>

              {!imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-solid ${
                    isImageUploading ? 'pointer-events-none opacity-75' : ''
                  }`}
                  style={{
                    borderColor: '#DAC9F0',
                    backgroundColor: 'white',
                  }}
                  onClick={() =>
                    !isImageUploading && fileInputRef.current?.click()
                  }
                  onMouseEnter={(e) => {
                    if (!isImageUploading) {
                      e.currentTarget.style.borderColor = '#8043CC';
                      e.currentTarget.style.backgroundColor = '#F8F6FE';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isImageUploading) {
                      e.currentTarget.style.borderColor = '#DAC9F0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="p-4 rounded-full"
                      style={{ backgroundColor: '#DAC9F0' }}
                    >
                      {isImageUploading ? (
                        <Loader2
                          className="w-8 h-8 animate-spin"
                          style={{ color: '#6F32BB' }}
                        />
                      ) : (
                        <Upload
                          className="w-8 h-8"
                          style={{ color: '#6F32BB' }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-medium text-lg"
                        style={{ color: '#5F2BA0' }}
                      >
                        {isImageUploading
                          ? 'Uploading image...'
                          : 'Click to upload image'}
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: '#8043CC' }}
                      >
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isImageUploading}
                  />
                </div>
              ) : (
                <div
                  className="border-2 rounded-xl overflow-hidden shadow-lg"
                  style={{ borderColor: '#8043CC' }}
                >
                  <div className="relative">
                    <Img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    {!isImageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={handleRemoveImage}
                          className="opacity-0 hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ backgroundColor: '#F8F6FE' }}
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon
                        className="w-5 h-5"
                        style={{ color: '#6F32BB' }}
                      />
                      <div>
                        <p
                          className="font-medium text-sm"
                          style={{ color: '#5F2BA0' }}
                        >
                          Featured Image
                        </p>
                        <div className="flex items-center gap-2">
                          {getImageUploadStatusIcon()}
                          <p
                            className="text-xs"
                            style={{ color: '#8043CC' }}
                          >
                            {getImageUploadStatusText() || 'Image ready'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!isImageUploading && (
                      <button
                        onClick={handleRemoveImage}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        style={{ color: '#DC2626' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: '#5F2BA0' }}
              >
                Content <span style={{ color: '#6F32BB' }}>*</span>
              </label>
              <div
                className="border-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{
                  borderColor: '#DAC9F0',
                  background: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8043CC';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DAC9F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <CKEditor
                  editor={ClassicEditor as any}
                  data={content}
                  onChange={(_, editor) => {
                    setContent(editor.getData());
                    setHasUnsavedChanges(true);
                  }}
                  config={{
                    toolbar: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      'underline',
                      'strikethrough',
                      '|',
                      'fontColor',
                      'highlight',
                      '|',
                      'link',
                      'blockQuote',
                      '|',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'insertTable',
                      'horizontalLine',
                      '|',
                      'undo',
                      'redo',
                    ],
                    placeholder: 'Start typing your content here...',
                    heading: {
                      options: [
                        {
                          model: 'paragraph',
                          title: 'Paragraph',
                          class: 'ck-heading_paragraph',
                        },
                        {
                          model: 'heading1',
                          view: 'h1',
                          title: 'Heading 1',
                          class: 'ck-heading_heading1',
                        },
                        {
                          model: 'heading2',
                          view: 'h2',
                          title: 'Heading 2',
                          class: 'ck-heading_heading2',
                        },
                        {
                          model: 'heading3',
                          view: 'h3',
                          title: 'Heading 3',
                          class: 'ck-heading_heading3',
                        },
                      ],
                    },
                  }}
                  onReady={(editor) => {
                    const editingView = editor.editing.view;
                    editingView.change((writer) => {
                      const root = editingView.document.getRoot();
                      if (root) {
                        writer.setStyle('min-height', '300px', root);
                      }
                    });
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <p
                  className="text-xs flex items-center gap-2"
                  style={{ color: '#8043CC' }}
                >
                  Use the toolbar above to format your content
                </p>
                <div
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: '#DAC9F0',
                    color: '#5F2BA0',
                  }}
                >
                  {content.replace(/<[^>]*>/g, '').length} characters
                </div>
              </div>
            </div>
          </div>

          <div
            className="px-6 py-5 border-t"
            style={{
              borderColor: '#DAC9F0',
              background: `linear-gradient(135deg, #DAC9F0 0%, #B3B9DA 100%)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full shadow-sm ${
                    autoSaveStatus === 'saving' ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor:
                      autoSaveStatus === 'error' ? '#DC2626' : '#8043CC',
                  }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: '#5F2BA0' }}
                >
                  {getAutoSaveText()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 font-medium border-2 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: '#B3B9DA',
                    color: '#5F2BA0',
                    backgroundColor: 'white',
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  disabled={!title.trim() || !content.trim() || isLoading}
                  className="px-8 py-2.5 font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: isLoading
                      ? '#B3B9DA'
                      : `linear-gradient(135deg, #6F32BB 0%, #8043CC 100%)`,
                    color: 'white',
                    border: 'none',
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing Magic...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <style
        jsx
        global
      >{`
        .ck-editor__editable {
          border: none !important;
          box-shadow: none !important;
          padding: 2rem !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
          color: #374151 !important;
        }

        .ck-editor__editable:focus {
          outline: none !important;
        }

        .ck-editor__editable.ck-focused {
          background: #fefefe !important;
        }

        .ck-toolbar {
          border: none !important;
          border-bottom: 2px solid #dac9f0 !important;
          background: linear-gradient(
            135deg,
            #dac9f0 0%,
            #b3b9da 100%
          ) !important;
          padding: 1rem 1.5rem !important;
          border-radius: 0 !important;
        }

        .ck-button {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          margin: 0 2px !important;
        }

        .ck-button:hover {
          background: #8043cc !important;
          color: white !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(111, 50, 187, 0.3) !important;
        }

        .ck-button.ck-on {
          background: #6f32bb !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(111, 50, 187, 0.4) !important;
        }

        .ck-dropdown__button:hover {
          background: #8043cc !important;
          color: white !important;
        }

        .ck-dropdown__button.ck-on {
          background: #6f32bb !important;
          color: white !important;
        }

        .ck-editor__main {
          max-height: 350px !important;
          overflow-y: auto !important;
        }

        /* Beautiful Purple Scrollbar */
        .ck-editor__main::-webkit-scrollbar {
          width: 8px;
        }

        .ck-editor__main::-webkit-scrollbar-track {
          background: #dac9f0;
          border-radius: 10px;
        }

        .ck-editor__main::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6f32bb 0%, #8043cc 100%);
          border-radius: 10px;
          box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.3);
        }

        .ck-editor__main::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5f2ba0 0%, #6f32bb 100%);
        }

        /* Dropdown panels */
        .ck-dropdown__panel {
          border: 2px solid #dac9f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(111, 50, 187, 0.15) !important;
        }

        /* List items in dropdowns */
        .ck-list__item {
          border-radius: 6px !important;
          margin: 2px !important;
        }

        .ck-list__item:hover {
          background: #dac9f0 !important;
        }

        /* Placeholder text styling */
        .ck-placeholder::before {
          color: #8043cc !important;
          font-style: italic !important;
        }

        /* Table styling */
        .ck-editor__editable table {
          border: 2px solid #dac9f0 !important;
          border-radius: 8px !important;
        }

        .ck-editor__editable table td,
        .ck-editor__editable table th {
          border: 1px solid #b3b9da !important;
          padding: 0.75rem !important;
        }

        .ck-editor__editable table th {
          background: #dac9f0 !important;
          color: #5f2ba0 !important;
          font-weight: 600 !important;
        }

        /* Link styling */
        .ck-editor__editable a {
          color: #6f32bb !important;
          text-decoration: underline !important;
        }

        /* Blockquote styling */
        .ck-editor__editable blockquote {
          border-left: 4px solid #8043cc !important;
          background: #dac9f0 !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
          border-radius: 0 8px 8px 0 !important;
          font-style: italic !important;
        }

        /* Heading styles */
        .ck-editor__editable h1 {
          color: #5f2ba0 !important;
        }

        .ck-editor__editable h2 {
          color: #6f32bb !important;
        }

        .ck-editor__editable h3 {
          color: #8043cc !important;
        }
      `}</style>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onDiscard={handleConfirmDiscard}
        onSaveDraft={handleConfirmSave}
        isLoading={isLoading}
      />
    </>
  );
}
