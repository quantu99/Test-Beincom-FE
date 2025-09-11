'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchResult, SearchQuery } from '@/types/search';
import { Img, Button } from '@/components/common';
import { CSMagnifest } from '@/components/common/iconography';
import { searchApi } from '@/lib/api/search';
import { VARIABLE_CONSTANT } from '@/constants';
import { Filter, X } from 'lucide-react';

function SearchFilters({
  activeType,
  onTypeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  totalResults,
  isOpen,
  onClose,
}: {
  activeType: 'all' | 'user' | 'post';
  onTypeChange: (type: 'all' | 'user' | 'post') => void;
  sortBy: 'relevance' | 'date' | 'likes';
  onSortChange: (sort: 'relevance' | 'date' | 'likes') => void;
  sortOrder: 'ASC' | 'DESC';
  onSortOrderChange: (order: 'ASC' | 'DESC') => void;
  totalResults: number;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  const filterOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'user', label: 'Users' },
    { value: 'post', label: 'Posts' },
  ] as const;

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'likes', label: 'Popularity' },
  ] as const;

  const handleOptionSelect = (callback: () => void) => {
    callback();
    if (onClose) onClose();
  };

  return (
    <>
      <div className="hidden lg:block w-64 bg-white border-r border-neutral-5 h-full overflow-y-auto">
        <div className="p-4 xl:p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-60 mb-3">
              Filter by type
            </h3>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onTypeChange(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeType === option.value
                      ? '!bg-customPurple-4 !text-neutral-2'
                      : '!bg-neutral-2 !text-neutral-70 hover:!bg-customPurple-4 hover:!text-neutral-2'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-60 mb-3">Sort by</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    sortBy === option.value
                      ? '!bg-customPurple-4 !text-neutral-2'
                      : '!bg-neutral-2 !text-neutral-70 hover:!bg-customPurple-4 hover:!text-neutral-2'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {sortBy !== 'relevance' && (
            <div>
              <h3 className="font-semibold text-neutral-60 mb-3">Order</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onSortOrderChange('DESC')}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'DESC'
                      ? 'bg-customPurple-4 text-white'
                      : 'bg-neutral-2 text-neutral-60 hover:bg-neutral-5'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => onSortOrderChange('ASC')}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'ASC'
                      ? 'bg-customPurple-4 text-white'
                      : 'bg-neutral-2 text-neutral-60 hover:bg-neutral-5'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-5">
            <p className="text-sm text-neutral-40">
              {totalResults.toLocaleString()} results found
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-5 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-60">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-neutral-60 mb-3">
                  Filter by type
                </h3>
                <div className="space-y-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() =>
                        handleOptionSelect(() => onTypeChange(option.value))
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeType === option.value
                          ? '!bg-customPurple-4 !text-neutral-2'
                          : '!bg-neutral-2 !text-neutral-70'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-60 mb-3">Sort by</h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() =>
                        handleOptionSelect(() => onSortChange(option.value))
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        sortBy === option.value
                          ? '!bg-customPurple-4 !text-neutral-2'
                          : '!bg-neutral-2 !text-neutral-70'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {sortBy !== 'relevance' && (
                <div>
                  <h3 className="font-semibold text-neutral-60 mb-3">Order</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleOptionSelect(() => onSortOrderChange('DESC'))
                      }
                      className={`flex-1 p-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'DESC'
                          ? 'bg-customPurple-4 text-white'
                          : 'bg-neutral-2 text-neutral-60'
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() =>
                        handleOptionSelect(() => onSortOrderChange('ASC'))
                      }
                      className={`flex-1 p-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'ASC'
                          ? 'bg-customPurple-4 text-white'
                          : 'bg-neutral-2 text-neutral-60'
                      }`}
                    >
                      Oldest
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-5">
                <p className="text-sm text-neutral-40 text-center">
                  {totalResults.toLocaleString()} results found
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserResult({ result }: { result: SearchResult }) {
  return (
    <Link
      href="#"
      className="block p-4 sm:p-6 border-b border-neutral-5 hover:bg-neutral-2 transition-colors"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-5 overflow-hidden flex-shrink-0">
          <Img
            src={result.avatar || VARIABLE_CONSTANT.NO_AVATAR}
            className="w-full h-full"
            fit="cover"
            alt={result.title}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-60 mb-1 truncate">
            {result.title}
          </h3>
          <p className="text-sm text-neutral-40 line-clamp-2 sm:line-clamp-1">
            {result.excerpt}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-40">
              User
            </span>
            <span className="text-xs text-neutral-30">
              Joined {new Date(result.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostResult({ result }: { result: SearchResult }) {
  return (
    <Link
      href="#"
      className="block p-4 sm:p-6 border-b border-neutral-5 hover:bg-neutral-2 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {result.image && (
          <div className="w-full sm:w-20 h-48 sm:h-20 rounded-lg bg-neutral-5 overflow-hidden flex-shrink-0 order-1 sm:order-none">
            <Img
              src={result.image}
              className="w-full h-full"
              fit="cover"
              alt={result.title}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-60 mb-2 line-clamp-2 text-base sm:text-lg">
            {result.title}
          </h3>
          <div
            className="article-content-html text-sm text-neutral-50 line-clamp-3 mb-3"
            dangerouslySetInnerHTML={{ __html: result.excerpt ?? '' }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-5 overflow-hidden flex-shrink-0">
                {result.author?.avatar ? (
                  <Img
                    src={result.author.avatar}
                    className="w-full h-full"
                    fit="cover"
                    alt={result.author.name}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-customPurple-4 to-blue-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {result.author?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-neutral-40 truncate">
                {result.author?.name}
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-neutral-30">
              <span>{new Date(result.createdAt).toLocaleDateString()}</span>
              <span>{result.likes || 0} likes</span>
              <span className="hidden sm:inline">
                {result.views || 0} views
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const [windowWidth, setWindowWidth] = useState(1024);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = windowWidth < 640 ? 3 : 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-6 sm:py-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white border border-neutral-5 hover:bg-neutral-2 disabled:opacity-50"
      >
        <span className="sm:hidden">Prev</span>
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border min-w-[32px] sm:min-w-[36px] ${
            currentPage === page
              ? 'bg-customPurple-4 text-white border-customPurple-4'
              : 'bg-white border-neutral-5 hover:bg-neutral-2'
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white border border-neutral-5 hover:bg-neutral-2 disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="p-4 sm:p-6 border-b border-neutral-5"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-12 h-32 sm:h-12 bg-neutral-5 rounded-full sm:rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 sm:h-5 bg-neutral-5 rounded animate-pulse w-3/4" />
              <div className="h-3 sm:h-4 bg-neutral-5 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-neutral-5 rounded animate-pulse w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileFilterButton({
  activeType,
  sortBy,
  totalResults,
  onToggle,
}: {
  activeType: 'all' | 'user' | 'post';
  sortBy: 'relevance' | 'date' | 'likes';
  totalResults: number;
  onToggle: () => void;
}) {
  return (
    <div className="lg:hidden bg-white border-b border-neutral-5 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-40">
          {totalResults.toLocaleString()} results
        </p>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-2 hover:bg-neutral-5 rounded-lg text-sm font-medium text-neutral-60 transition-colors"
        >
          <Filter size={16} />
          Filter & Sort
        </button>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2">
        {activeType !== 'all' && (
          <span className="px-2 py-1 bg-purple-5 text-customPurple-4 rounded text-xs font-medium">
            {activeType === 'user' ? 'Users' : 'Posts'}
          </span>
        )}
        {sortBy !== 'relevance' && (
          <span className="px-2 py-1 bg-purple-5 text-customPurple-4 rounded text-xs font-medium">
            {sortBy === 'date' ? 'By Date' : 'By Popularity'}
          </span>
        )}
      </div>
    </div>
  );
}

export function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as 'all' | 'user' | 'post') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy =
    (searchParams.get('sortBy') as 'relevance' | 'date' | 'likes') ||
    'relevance';
  const sortOrder = (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const updateSearchParams = (params: Partial<SearchQuery>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/search?${newParams.toString()}`);
  };

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setSearchQuery(query);

      searchApi
        .search({
          q: query,
          type,
          page,
          sortBy,
          sortOrder,
          limit: 10,
        })
        .then((response) => {
          setResults(response.results);
          setTotalResults(response.total);
          setTotalPages(response.totalPages);
        })
        .catch((error) => {
          console.error('Search error:', error);
          setResults([]);
          setTotalResults(0);
          setTotalPages(1);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [query, type, page, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      updateSearchParams({ q: searchQuery.trim(), page: 1 });
    }
  };

  const handleTypeChange = (newType: 'all' | 'user' | 'post') => {
    updateSearchParams({ type: newType, page: 1 });
  };

  const handleSortChange = (newSort: 'relevance' | 'date' | 'likes') => {
    updateSearchParams({ sortBy: newSort, page: 1 });
  };

  const handleSortOrderChange = (newOrder: 'ASC' | 'DESC') => {
    updateSearchParams({ sortOrder: newOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-1 mt-[3.75rem]">
      <div className="bg-white border-b border-neutral-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {query && (
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-60">
                Search results for &quot;{query}&quot;
              </h1>
              <p className="text-neutral-40 mt-1 text-sm sm:text-base">
                <span className="sm:hidden">
                  {totalResults.toLocaleString()} results
                </span>
                <span className="hidden sm:inline">
                  {totalResults.toLocaleString()} results found
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <MobileFilterButton
        activeType={type}
        sortBy={sortBy}
        totalResults={totalResults}
        onToggle={() => setIsMobileFiltersOpen(true)}
      />

      <div className="max-w-7xl mx-auto flex">
        <SearchFilters
          activeType={type}
          onTypeChange={handleTypeChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          totalResults={totalResults}
          isOpen={isMobileFiltersOpen}
          onToggle={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        <div className="flex-1 bg-white min-h-screen">
          {isLoading ? (
            <SearchLoading />
          ) : results.length > 0 ? (
            <>
              <div>
                {results.map((result) =>
                  result.type === 'user' ? (
                    <UserResult
                      key={`user-${result.id}`}
                      result={result}
                    />
                  ) : (
                    <PostResult
                      key={`post-${result.id}`}
                      result={result}
                    />
                  ),
                )}
              </div>

              <SearchPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
              <CSMagnifest className="size-12 sm:size-16 text-neutral-20 mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-60 mb-2 text-center">
                No results found
              </h2>
              <p className="text-neutral-40 text-center max-w-md text-sm sm:text-base">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Try
                adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
              <CSMagnifest className="size-12 sm:size-16 text-neutral-20 mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-60 mb-2 text-center">
                Start your search
              </h2>
              <p className="text-neutral-40 text-center max-w-md text-sm sm:text-base">
                Enter a search term to find users and posts on the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
