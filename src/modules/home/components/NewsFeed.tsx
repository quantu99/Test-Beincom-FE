'use client';

import {
  Button,
  CSComment,
  CSDonate,
  CSDot,
  CSDots,
  CSLike,
  CSSend,
  CSShare,
  Img,
} from '@/components';
import { VARIABLE_CONSTANT } from '@/constants';
import { commentsApi } from '@/lib/api/comment';
import { postsApi } from '@/lib/api/post';
import { useAuthStore } from '@/store/zustand/authStore';
import { Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef, useCallback } from 'react';

interface NewsfeedProps {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const ACTION_ARR = [
  {
    type: 'like',
    title: 'Like',
    icon: CSLike,
  },
  {
    type: 'comment',
    title: 'Comment',
    icon: CSComment,
  },
  {
    type: 'share',
    title: 'Share',
    icon: CSShare,
  },
  {
    type: 'donate',
    title: 'Donate',
    icon: CSDonate,
  },
];

const PostSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="flex items-center gap-4">
      <div className="h-8 bg-gray-200 rounded w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const LoadingMoreSkeleton = () => (
  <div className="space-y-4">
    {[...Array(2)].map((_, index) => (
      <PostSkeleton key={index} />
    ))}
  </div>
);

export function Newsfeed({
  posts,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: NewsfeedProps) {
  const observer = useRef<IntersectionObserver>();
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (isLoading) {
    return (
      <div className="space-y-4 mb-6">
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-red-800 font-medium mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-600 text-sm">
          Không thể tải bài viết. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium mb-2">Chưa có bài viết nào</h3>
        <p className="text-gray-500 text-sm">
          Hãy kiểm tra lại bộ lọc hoặc thử tạo bài viết mới.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div
              key={post.id}
              ref={lastPostElementRef}
            >
              <PostItem post={post} />
            </div>
          );
        } else {
          return (
            <PostItem
              key={post.id}
              post={post}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <div className="py-4">
          <LoadingMoreSkeleton />
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-8 h-px bg-gray-300"></div>
            <span>You have seen all the posts.</span>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PostItemProps {
  post: Post;
}

function PostItem({ post }: PostItemProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(post.likes);
  const [isLoadingLikeStatus, setIsLoadingLikeStatus] = useState(true);

  // Get like status when component mounts
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) {
        setIsLoadingLikeStatus(false);
        return;
      }

      try {
        const likeStatus = await postsApi.getLikeStatus(post.id);
        setIsLiked(likeStatus);
      } catch (error) {
        console.error('Failed to check like status:', error);
      } finally {
        setIsLoadingLikeStatus(false);
      }
    };

    checkLikeStatus();
  }, [post.id, user]);

  // Get comments for this post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => commentsApi.getByPost(post.id),
    select: (data) => data.slice(0, 1), // Limit to 1 comment (latest)
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: () => postsApi.toggleLike(post.id),
    onMutate: async () => {
      // Optimistic update
      const previousIsLiked = isLiked;
      const previousLikes = currentLikes;

      setIsLiked(!isLiked);
      setCurrentLikes((prev) => (isLiked ? prev - 1 : prev + 1));

      return { previousIsLiked, previousLikes };
    },
    onSuccess: (response) => {
      // Update with server response
      setIsLiked(response.isLiked);
      setCurrentLikes(response.post.likes);

      // Update the post in the cache
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: Post) =>
              p.id === post.id ? { ...p, likes: response.post.likes } : p,
            ),
          })),
        };
      });
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context) {
        setIsLiked(context.previousIsLiked);
        setCurrentLikes(context.previousLikes);
      }
      console.error('Toggle like failed:', error);
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      commentsApi.create(post.id, { content }),
    onSuccess: () => {
      // Refetch comments after successful comment creation
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
    },
    onError: (error) => {
      console.error('Comment failed:', error);
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} day ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week ago`;
    return date.toLocaleDateString('vi-VN');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleToggleLike = () => {
    if (!user) {
      // Handle unauthenticated user - maybe show login modal
      console.log('User must be logged in to like posts');
      return;
    }

    if (!toggleLikeMutation.isPending && !isLoadingLikeStatus) {
      toggleLikeMutation.mutate();
    }
  };

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'like':
        handleToggleLike();
        break;
      case 'comment':
        // Focus on comment input
        document.getElementById(`comment-input-${post.id}`)?.focus();
        break;
      case 'share':
        // Handle share functionality
        break;
      case 'donate':
        // Handle donate functionality
        break;
    }
  };

  const getLikeButtonText = () => {
    if (toggleLikeMutation.isPending) {
      return isLiked ? 'Unliking...' : 'Liking...';
    }
    return isLiked ? 'Unlike' : 'Like';
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3 mb-3">
          <div className="size-10 aspect-square">
            <Img
              src={post.author.avatar || VARIABLE_CONSTANT.NO_AVATAR}
              alt="avatar"
              className="w-full h-full rounded-full"
              fit="cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h4 className="truncate cursor-pointer hover:underline linear-text2">
                {post.author.name}
              </h4>
              <div className="w-[2px] h-[2px] [&>svg>path]:fill-neutral-40"></div>
              <span className="text-sm text-customBlue-3">
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
          </div>
          <div
            role="button"
            className="size-5 [&>svg>path]:fill-neutral-50"
          >
            <CSDots />
          </div>
        </div>

        <div className="mb-4">
          <div
            className="article-content-html"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      </div>

      {post.image && (
        <div className="px-4 pb-4 h-[520px]">
          <Img
            src={post.image}
            alt={post.title}
            className="w-auto h-full rounded-lg"
            fit="cover"
          />
        </div>
      )}

      <div className="flex flex-col mx-4">
        <div className="border-b pb-2 border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-2 text-customBlue-3 text-sm font-medium transition-colors">
            <div className="size-6 aspect-square">
              {isLiked ? (
                <Img
                  src={VARIABLE_CONSTANT.LIKE}
                  alt="liked"
                  className="w-full h-full"
                  fit="cover"
                />
              ) : (
                <div className="size-6 [&>svg>path]:fill-customBlue-3">
                  <CSLike />
                </div>
              )}
            </div>
            <span className="text-sm font-medium">
              {formatNumber(currentLikes)}
            </span>
          </div>
          <div className="w-[2px] h-[2px] [&>svg>path]:fill-neutral-40">
            <CSDot />
          </div>
          <div className="flex items-center gap-2 text-customBlue-3 text-sm font-medium transition-colors">
            <div className="size-5 [&>svg>path]:fill-neutral-40">
              <CSComment />
            </div>
            <span className="text-sm font-medium">
              {formatNumber(post.comments.length)}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center border-b py-3 border-gray-100">
          {ACTION_ARR.map((a) => {
            const Icon = a.icon;
            const isLikeAction = a.type === 'like';
            const isDisabled =
              isLikeAction &&
              (toggleLikeMutation.isPending || isLoadingLikeStatus);

            return (
              <Button
                key={a.type}
                onClick={() => handleAction(a.type)}
                disabled={isDisabled}
                className={`flex !text-sm font-medium !rounded justify-center lg:min-w-[125.5px] items-center gap-2 !px-4 !py-2 !bg-transparent hover:!bg-neutral-2 transition-colors ${
                  isLikeAction && isLiked
                    ? '!text-customBlue-3'
                    : '!text-customBlack-2'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div
                  className={`size-5 ${
                    isLikeAction && isLiked
                      ? ''
                      : '[&>svg>path]:fill-neutral-40'
                  }`}
                >
                  {isLikeAction && isLiked ? (
                    <Img
                      src={VARIABLE_CONSTANT.LIKE}
                      alt="liked"
                      className="w-full h-full"
                      fit="cover"
                    />
                  ) : (
                    <Icon />
                  )}
                </div>
                <span>{isLikeAction ? getLikeButtonText() : a.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Comments section */}
        <div className="flex flex-col">
          {/* Existing comments */}
          {commentsLoading ? (
            <div className="px-4 py-3">
              <div className="animate-pulse flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="px-4 py-3 border-b border-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 aspect-square">
                    <Img
                      src={comment.author.avatar || VARIABLE_CONSTANT.NO_AVATAR}
                      alt={comment.author.name}
                      className="w-full h-full rounded-full"
                      fit="cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <h5 className="text-sm font-medium text-customBlack-2 mb-1">
                        {comment.author.name}
                      </h5>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{formatDate(comment.createdAt)}</span>
                      <button className="hover:text-customBlue-3">Like</button>
                      <button className="hover:text-customBlue-3">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Comment input */}
          <div className="flex items-center gap-x-2 p-4">
            <div className="w-10 h-10 aspect-square">
              <Img
                src={user?.avatar || VARIABLE_CONSTANT.NO_AVATAR}
                alt="avatar"
                className="w-full h-full rounded-full"
                fit="cover"
              />
            </div>
            <CommentInput
              postId={post.id}
              onSubmit={commentMutation.mutate}
              isSubmitting={commentMutation.isPending}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

interface CommentInputProps {
  postId: string;
  onSubmit: (data: { content: string }) => void;
  isSubmitting: boolean;
}

function CommentInput({ postId, onSubmit, isSubmitting }: CommentInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim() && !isSubmitting) {
      onSubmit({ content: content.trim() });
      setContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-md w-full flex items-center relative min-h-[51px] px-3 py-2 border border-neutral-5">
      <input
        id={`comment-input-${postId}`}
        className="flex w-full text-base font-normal text-neutral-60 bg-transparent outline-none pr-12"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isSubmitting}
      />
      <div className="flex items-center gap-2 absolute top-1/2 -translate-y-1/2 right-2">
        <div className="w-px h-3 bg-customGray-1" />
        <div
          role="button"
          onClick={handleSubmit}
          className={`size-5 ${
            content.trim() && !isSubmitting
              ? 'cursor-pointer [&>svg>path]:fill-customBlue-3'
              : 'cursor-not-allowed [&>svg>path]:fill-neutral-20'
          }`}
        >
          <CSSend />
        </div>
      </div>
    </div>
  );
}
