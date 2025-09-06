'use client';

import { Button, CSFilter, Img } from '@/components';
import { VARIABLE_CONSTANT } from '@/constants';
import Link from 'next/link';
import { useState } from 'react';
import { PostContainer } from './PostContainer';
import { postsApi } from '@/lib/api/post';
import { PostsQueryDto } from '@/types/post';
import { useQuery } from '@tanstack/react-query';
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
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const queryParams: PostsQueryDto = {
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: filters.limit,
        page: 1,
      };

      if (filters.sortBy === 'popular') {
        return postsApi.getPopular(filters.limit).then((posts) => ({
          posts,
          total: posts.length,
          page: 1,
          limit: filters.limit,
          totalPages: 1,
        }));
      }

      return postsApi.getAll(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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
        <div className="relative">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilterDropdown(!showFilterDropdown);
            }}
            className="flex items-center gap-2 !bg-transparent hover:!bg-transparent !px-3 !py-2"
          >
            <div className="size-5 [&>svg>path]:fill-neutral-40">
              <CSFilter />
            </div>
            <span className="text-sm font-medium text-neutral-60">Filter</span>
          </Button>
          <FilterDropdown
            isOpen={showFilterDropdown}
            onClose={() => setShowFilterDropdown(false)}
            filters={filters}
            onApply={handleFilterApply}
            onReset={handleFilterReset}
          />
        </div>
      </div>
      {/* NEWSFEED SECTION */}
      <Newsfeed
        posts={postsData?.posts || []}
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
}
