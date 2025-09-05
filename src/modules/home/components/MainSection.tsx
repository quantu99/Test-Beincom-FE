'use client';

import { Button, CSBooks, CSFilter, CSNews, CSPen, Img } from '@/components';
import { VARIABLE_CONSTANT } from '@/constants';
import { useAuthStore } from '@/store/zustand/authStore';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from 'react-query';

const MENU_SECTION = [
  {
    value: 'explore',
    title: 'Explore',
  },
  {
    value: 'following',
    title: 'Following',
  },
  {
    value: 'saved',
    title: 'Saved',
  },
];

export function MainSection() {
  const [currentSection, setCurrentSection] = useState('following');
  return (
    <section
      className="min-w-[524px] max-w-[672px] flex-1 pt-6 "
      id="newsfeed "
    >
      {/* POST CONTAINER */}
      <PostContainer />
      {/* EVENT */}
      <Link
        href="#"
        className="h-auto w-full rounded-lg"
      >
        <Img
          src={VARIABLE_CONSTANT.EVENT_BANNER_3}
          alt="event"
          className="w-full h-full rounded-lg"
          fit="cover"
        />
      </Link>
      {/* FILTER */}
      <div className="flex justify-between items-center py-4">
        <div className="h-full items-center justify-center rounded-md flex gap-3 p-0">
          {MENU_SECTION.map((ms) => (
            <div
              key={ms.value}
              className="relative"
            >
              <Button
                onClick={() => setCurrentSection(ms.value)}
                className={`${
                  currentSection === ms.value
                    ? '!text-customPurple-1 font-semibold'
                    : '!text-customBlue-4 font-normal'
                } !pt-2 !pb-3 !px-4 bg-transparent hover:!bg-transparent text-sm focus:ring-0 focus:ring-offset-0 focus:outline-none`}
              >
                {ms.title}
              </Button>

              {currentSection === ms.value && (
                <span className="absolute bottom-0 w-full left-0 z-10 h-1  rounded-t-md transition-all bg-customPurple-1" />
              )}
            </div>
          ))}
        </div>
        <Button className="flex items-center gap-2 !bg-transparent hover:!bg-transparent !px-3 !py-2">
          <div className="size-5 [&>svg>path]:fill-neutral-40">
            <CSFilter />
          </div>
          <span className="text-sm font-medium text-neutral-60">Filter</span>
        </Button>
      </div>
    </section>
  );
}

function PostContainer() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postType, setPostType] = useState<'quick' | 'article'>('quick');
  const [currentDraft, setCurrentDraft] = useState(null);

  // Mutation để tạo draft
  const createDraftMutation = useMutation({
    mutationFn: postAPI.createDraft,
    onSuccess: (draft) => {
      setCurrentDraft(draft);
      setIsModalOpen(true);
    },
    onError: (error) => {
      toast.error('Failed to create draft');
      console.error('Create draft error:', error);
    },
  });

  const handleQuickPost = () => {
    setPostType('quick');
    createDraftMutation.mutate({
      title: 'Untitled Post',
      content: '',
    });
  };

  const handleWriteArticle = () => {
    setPostType('article');
    createDraftMutation.mutate({
      title: 'Untitled Article',
      content: '',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDraft(null);
  };

  const handleCreateSeries = () => {
    // TODO: Implement series creation
    toast.info('Series creation coming soon!');
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
            disabled={createDraftMutation.isPending}
            className="!py-3 !px-4 min-h-6 !text-customBlue-3 text-sm font-medium flex items-center !justify-start hover:text-neutral-70 space-x-4 rounded-xl bg-neutral-1 hover:bg-neutral-2 disabled:opacity-50"
          >
            <div className="size-6 [&>svg>path]:fill-customBlue-1">
              <CSPen />
            </div>
            <span>
              {createDraftMutation.isPending && postType === 'quick'
                ? 'Creating...'
                : 'Quick Post'}
            </span>
          </Button>
          <Button
            onClick={handleWriteArticle}
            disabled={createDraftMutation.isPending}
            className="!py-3 !px-4 min-h-6 !text-customBlue-3 text-sm font-medium flex items-center !justify-start hover:text-neutral-70 space-x-4 rounded-xl bg-neutral-1 hover:bg-neutral-2 disabled:opacity-50"
          >
            <div className="size-6 [&>svg>path]:fill-customOrange-1">
              <CSNews />
            </div>
            <span>
              {createDraftMutation.isPending && postType === 'article'
                ? 'Creating...'
                : 'Write Article'}
            </span>
          </Button>
          <Button
            onClick={handleCreateSeries}
            className="!py-3 !px-4 min-h-6 !text-customBlue-3 text-sm font-medium flex items-center !justify-start hover:text-neutral-70 space-x-4 rounded-xl bg-neutral-1 hover:bg-neutral-2"
          >
            <div className="size-6 [&>svg>path]:fill-customGreen-1">
              <CSBooks />
            </div>
            <span>Create Series</span>
          </Button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        draft={currentDraft}
        postType={postType}
      />
    </>
  );
}
