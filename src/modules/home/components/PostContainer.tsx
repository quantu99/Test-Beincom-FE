'use client';
import { Button, CreatePostModal, CSNews, CSPen, Img } from '@/components';
import { VARIABLE_CONSTANT } from '@/constants';
import { postsApi } from '@/lib/api/post';
import { useAuthStore } from '@/store/zustand/authStore';
import { CreateDraftDto, Post } from '@/types/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function PostContainer() {
  const { user } = useAuthStore();
  const [isShowModal, setIsShowModal] = useState(false);
  const queryClient = useQueryClient();

  const createQuickDraftMutation = useMutation({
    mutationFn: (data: CreateDraftDto) => postsApi.drafts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      setIsShowModal(true);
    },
    onError: (error) => {
      console.error('Failed to create quick draft:', error);
      alert('Có lỗi xảy ra khi tạo draft. Vui lòng thử lại.');
    },
  });

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  const handleQuickPost = async () => {
    try {
      await createQuickDraftMutation.mutateAsync({
        title: 'Untitled Draft',
        content: 'Untitled Content',
      });
    } catch (error) {
      console.error('Failed to create quick draft:', error);
    }
  };

  return (
    <>
      <div className="w-full rounded-lg bg-white p-4 flex flex-col gap-2 mb-4">
        <div className="flex w-full items-start gap-4">
          <div className="w-10 h-10 aspect-square">
            <Img
              src={user?.avatar || VARIABLE_CONSTANT.NO_AVATAR}
              className="w-full h-full rounded-full"
              fit="cover"
            />
          </div>
          <div className="flex w-full grow flex-col justify-center">
            <span className="font-normal text-sm text-neutral-80">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <span className="text-xs font-normal text-neutral-40">
              Share new ideas with your community!
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={handleQuickPost}
            disabled={createQuickDraftMutation.isPending}
            className="!py-3 !px-4 min-h-6 !text-customBlue-3 text-sm font-medium flex items-center !justify-start hover:text-neutral-70 space-x-4 rounded-xl bg-neutral-1 hover:bg-neutral-2 disabled:opacity-50"
          >
            <div className="size-6 [&>svg>path]:fill-customBlue-1">
              {createQuickDraftMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-customBlue-1 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CSPen />
              )}
            </div>
            <span className="whitespace-nowrap">
              {createQuickDraftMutation.isPending
                ? 'Creating...'
                : 'Quick Post'}
            </span>
          </Button>
          <Button
            onClick={handleQuickPost}
            className="!py-3 !px-4 min-h-6 !text-customBlue-3 text-sm font-medium flex items-center !justify-start hover:text-neutral-70 space-x-4 rounded-xl bg-neutral-1 hover:bg-neutral-2 disabled:opacity-50"
          >
            <div className="size-6 [&>svg>path]:fill-customOrange-1">
              {createQuickDraftMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-customBlue-1 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CSNews />
              )}
            </div>
            <span className="whitespace-nowrap">
              {' '}
              {createQuickDraftMutation.isPending
                ? 'Creating...'
                : 'Write Article'}
            </span>
          </Button>
        </div>
      </div>
      <CreatePostModal
        isOpen={isShowModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
