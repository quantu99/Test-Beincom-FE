'use client';

import { Button, CSFilter } from '@/components';
import { useState, useRef, useEffect } from 'react';
import { PostContainer } from './PostContainer';
import { postsApi } from '@/lib/api/post';
import { PostsQueryDto } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FilterDropdown } from './FilterDropdown';
import { Newsfeed } from './NewsFeed';

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

export interface FilterOptions {
  sortBy:
    | 'createdAt'
    | 'title'
    | 'views'
    | 'likes'
    | 'comments'
    | 'publishedAt'
    | 'popular';
  sortOrder: 'ASC' | 'DESC';
  limit: number;
}

export function MainSection() {
  const [currentSection, setCurrentSection] = useState('following');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: 10,
  });

  const filterRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams: PostsQueryDto = {
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: filters.limit,
        page: pageParam,
      };

      if (filters.sortBy === 'popular') {
        const posts = await postsApi.getPopular(filters.limit * pageParam);
        const startIndex = (pageParam - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const paginatedPosts = posts.slice(startIndex, endIndex);

        return {
          posts: paginatedPosts,
          total: posts.length,
          page: pageParam,
          limit: filters.limit,
          totalPages: Math.ceil(posts.length / filters.limit),
          hasMore: endIndex < posts.length,
        };
      }

      const result = await postsApi.getAll(queryParams);
      return {
        ...result,
        hasMore: result.page < result.totalPages,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilterDropdown(false);
  };

  const handleFilterReset = () => {
    const defaultFilters: FilterOptions = {
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      limit: 10,
    };
    setFilters(defaultFilters);
  };

  const handleFilterToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterClose = () => {
    setShowFilterDropdown(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      role="main"
      className="min-w-[524px] max-w-[672px] flex-1 pt-6 px-10 lg:px-0 mt-[3.75rem]"
      id="newsfeed"
    >
      <PostContainer />
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
        <div
          className="relative"
          ref={filterRef}
        >
          <Button
            onClick={handleFilterToggle}
            className={`flex items-center gap-2 !bg-transparent hover:!bg-transparent !px-3 !py-2 ${
              showFilterDropdown ? 'ring-2 ring-customPurple-1/20' : ''
            }`}
          >
            <div className="size-5 [&>svg>path]:fill-neutral-40">
              <CSFilter />
            </div>
            <span className="text-sm font-medium text-neutral-60">Filter</span>
          </Button>
          <FilterDropdown
            isOpen={showFilterDropdown}
            onClose={handleFilterClose}
            filters={filters}
            onApply={handleFilterApply}
            onReset={handleFilterReset}
          />
        </div>
      </div>
      <Newsfeed
        posts={allPosts}
        isLoading={isLoading}
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
}
