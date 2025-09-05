import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI } from '../../api/postAPI';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EditorJS } from '../editor/EditorJS';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { X, Save, Send, AlertTriangle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: any;
  postType: 'quick' | 'article';
}

export function CreatePostModal({ isOpen, onClose, draft, postType }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'discard' | 'save' | null>(null);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  // Mutations
  const updateDraftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      postAPI.updateDraft(id, data),
    onSuccess: () => {
      setIsUnsaved(false);
      toast.success('Draft saved!', { duration: 2000 });
    },
    onError: (error) => {
      toast.error('Failed to save draft');
      console.error('Update draft error:', error);
    },
  });

  const publishDraftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      postAPI.publishDraft(id, data),
    onSuccess: () => {
      toast.success('Post published successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      handleModalClose();
    },
    onError: (error) => {
      toast.error('Failed to publish post');
      console.error('Publish draft error:', error);
    },
  });

  const discardDraftMutation = useMutation({
    mutationFn: postAPI.discardDraft,
    onSuccess: () => {
      toast.success('Draft discarded');
      handleModalClose();
    },
    onError: (error) => {
      toast.error('Failed to discard draft');
      console.error('Discard draft error:', error);
    },
  });

  // Initialize form data when draft is loaded
  useEffect(() => {
    if (draft) {
      setTitle(draft.title || '');
      setContent(draft.content || '');
      setImage(draft.image || '');
      setIsUnsaved(false);
    }
  }, [draft]);

  // Auto-save functionality
  const debouncedSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (draft && isUnsaved) {
        updateDraftMutation.mutate({
          id: draft.id,
          data: { title, content, image }
        });
      }
    }, 2000); // Auto-save after 2 seconds of no changes
  }, [draft, title, content, image, isUnsaved, updateDraftMutation]);

  // Track changes
  useEffect(() => {
    if (draft) {
      const hasChanges = 
        title !== (draft.title || '') ||
        content !== (draft.content || '') ||
        image !== (draft.image || '');
      
      setIsUnsaved(hasChanges);
      
      if (hasChanges) {
        debouncedSave();
      }
    }
  }, [title, content, image, draft, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const handleModalClose = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    setTitle('');
    setContent('');
    setImage('');
    setIsUnsaved(false);
    setShowConfirmDialog(false);
    setConfirmAction(null);
    onClose();
  };

  const handleCloseAttempt = () => {
    if (isUnsaved) {
      setShowConfirmDialog(true);
    } else {
      handleModalClose();
    }
  };

  const handleSaveDraft = () => {
    if (draft && isUnsaved) {
      updateDraftMutation.mutate({
        id: draft.id,
        data: { title, content, image }
      });
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    if (draft) {
      publishDraftMutation.mutate({
        id: draft.id,
        data: { title, content, image }
      });
    }
  };

  const handleConfirmAction = () => {
    if (!draft) return;

    switch (confirmAction) {
      case 'discard':
        discardDraftMutation.mutate(draft.id);
        break;
      case 'save':
        if (isUnsaved) {
          updateDraftMutation.mutate({
            id: draft.id,
            data: { title, content, image }
          });
        }
        handleModalClose();
        break;
      default:
        handleModalClose();
    }
  };

  const isLoading = updateDraftMutation.isPending || 
                   publishDraftMutation.isPending || 
                   discardDraftMutation.isPending;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={`${postType === 'quick' ? 'Quick Post' : 'Write Article'}${isUnsaved ? ' (Unsaved)' : ''}`}
        size="large"
        className="max-w-4xl"
      >
        <div className="flex flex-col h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">
                {postType === 'quick' ? 'Quick Post' : 'Write Article'}
              </h2>
              {isUnsaved && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Auto-saving...
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseAttempt}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={postType === 'quick' ? 'What\'s on your mind?' : 'Article title...'}
                className="text-xl font-semibold border-none focus:ring-0 px-0 placeholder:text-neutral-40"
                disabled={isLoading}
              />
            </div>

            {postType === 'article' && (
              <div>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Cover image URL (optional)"
                  className="border-neutral-20 focus:ring-customBlue-1"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="flex-1 min-h-[300px]">
              <EditorJS
                value={content}
                onChange={setContent}
                placeholder={postType === 'quick' ? 'Share your thoughts...' : 'Write your article content...'}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-60">
                {isUnsaved ? 'Unsaved changes' : 'All changes saved'}
              </span>
              {updateDraftMutation.isPending && (
                <div className="w-4 h-4 border-2 border-customBlue-1 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!isUnsaved || updateDraftMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </Button>
              
              <Button
                onClick={handlePublish}
                disabled={isLoading || !title.trim() || !content.trim()}
                className="flex items-center space-x-2 bg-customBlue-1 hover:bg-customBlue-2"
              >
                <Send className="w-4 h-4" />
                <span>{publishDraftMutation.isPending ? 'Publishing...' : 'Publish'}</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. What would you like to do?"
        confirmText="Save & Close"
        cancelText="Discard"
        onConfirm={() => {
          setConfirmAction('save');
          handleConfirmAction();
        }}
        onCancel={() => {
          setConfirmAction('discard');
          handleConfirmAction();
        }}
        variant="warning"
        icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
        showThirdButton={true}
        thirdButtonText="Keep Editing"
        onThirdButton={() => setShowConfirmDialog(false)}
      />
    </>
  );
}