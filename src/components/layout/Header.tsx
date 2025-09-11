'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/zustand/authStore';
import { Button, Img, Input } from '../common';
import { MENU_ARR, VARIABLE_CONSTANT } from '@/constants';
import { SearchSuggestion } from '@/types/search';
import { CSBell, CSChatBubble, CSWallet } from '../common/iconography';
import { searchApi } from '@/lib/api/search';
import { LogOut, Menu, X, Search } from 'lucide-react';

const MENU_RIGHT = [
  { value: 'noti', label: 'Notifications', icon: CSBell },
  { value: 'chat', label: 'Go to BIC Chat', icon: CSChatBubble },
  { value: 'profile', label: 'Your Profile', icon: null },
];

function SearchDropdown({
  suggestions,
  isOpen,
  onClose,
  onSelect,
  query,
  isLoading,
}: {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  query: string;
  isLoading: boolean;
}) {
  const router = useRouter();
  if (!isOpen) return null;

  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-5 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
      {isLoading ? (
        <div className="p-4 text-center text-neutral-40">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-customPurple-4 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm">Searching...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                className="w-full p-3 hover:bg-neutral-2 flex items-center gap-3 text-left border-b border-neutral-5 last:border-b-0"
                onClick={() => onSelect(suggestion)}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Img
                    src={suggestion.avatar || VARIABLE_CONSTANT.NO_AVATAR}
                    className="w-full h-full rounded-full"
                    fit="cover"
                    alt={suggestion.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-60 truncate">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-neutral-40 capitalize">
                    {suggestion.type === 'user' ? 'User' : 'Post'}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {query.trim() && (
            <div className="p-3 border-t border-neutral-5">
              <button
                onClick={handleViewAllResults}
                className="w-full p-2 text-center text-customPurple-4 hover:bg-purple-5 rounded-md font-medium text-sm transition-colors"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </>
      ) : query.trim() ? (
        <div className="p-4">
          <p className="text-neutral-40 text-sm text-center mb-3">
            No results found for &quot;{query}&quot;
          </p>
          <button
            onClick={handleViewAllResults}
            className="w-full p-2 text-center text-custoborder-customPurple-4 hover:bg-purple-5 rounded-md font-medium text-sm transition-colors"
          >
            Search anyway
          </button>
        </div>
      ) : (
        <div className="p-4 text-center text-neutral-40">
          <p className="text-sm">Start typing to search...</p>
        </div>
      )}
    </div>
  );
}

function ProfileDropdown({
  isOpen,
  onClose,
  onLogout,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-neutral-5 rounded-lg shadow-lg min-w-[120px] z-50">
      <Button
        onClick={onLogout}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 p-3 text-left bg-neutral-2 font-semibold hover:bg-customPurple-4 text-sm !text-neutral-60 hover:!text-neutral-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
      >
        <LogOut size={14} />
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}

function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 lg:hidden">
      <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-1.5"
          >
            <div className="size-6 aspect-square">
              <Img
                src={VARIABLE_CONSTANT.SHORT_LOGO}
                fit="cover"
                alt="SHORT_LOGO"
              />
            </div>
            <div className="w-[80px]">
              <Img
                src={VARIABLE_CONSTANT.DARK_LOGO}
                fit="cover"
                alt="DARK_LOGO"
              />
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 pb-4">
          {MENU_ARR.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.label}
                href={menu.url}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-lg mb-1 ${
                  pathname === menu.url
                    ? 'bg-purple-5 text-customPurple-4'
                    : 'hover:bg-neutral-2'
                }`}
              >
                <div
                  className={
                    pathname === menu.url
                      ? '[&>svg>path]:fill-[#6f32bb]'
                      : '[&>svg>path]:fill-neutral-40'
                  }
                >
                  <Icon />
                </div>
                <span className="font-medium">{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4 border-t border-neutral-5 pt-4">
          <div className="flex items-center gap-3 mb-4">
            {MENU_RIGHT.slice(0, 2).map((mr) => {
              const Icon = mr.icon;
              return (
                <button
                  key={mr.value}
                  className="flex items-center gap-2 p-3 rounded-lg bg-neutral-2 hover:bg-neutral-5 flex-1"
                >
                  <div className="[&>svg>path]:fill-neutral-40">
                    {Icon && <Icon className="size-5" />}
                  </div>
                  <span className="text-sm font-medium text-neutral-60">
                    {mr.label}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 h-10 px-3 py-2 text-sm rounded-lg bg-neutral-2 text-neutral-60 hover:bg-neutral-5"
          >
            <div className="min-w-5 min-h-5 aspect-square [&>svg>path]:fill-neutral-40">
              <CSWallet />
            </div>
            <span className="whitespace-nowrap text-neutral-40">Wallet</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { user, logout, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearchLoading(true);
        try {
          const results = await searchApi.quickSearch(searchQuery.trim());
          setSuggestions(results);
        } catch (err) {
          setSuggestions([]);
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsSearchLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
      setIsMobileSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSuggestionSelect = (s: SearchSuggestion) => {
    router.push(s.type === 'user' ? `/users/${s.id}` : `/posts/${s.id}`);
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
    searchInputRef.current?.blur();
  };

  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <>
      <header className="h-[3.75rem] fixed top-0 z-[99] w-full bg-white border-b shadow-1">
        <div className="h-full px-3 sm:px-6 xl:px-12 xl:gap-x-12 w-screen flex items-center justify-between lg:justify-center gap-x-3 sm:gap-x-6">
          <div className="flex lg:hidden items-center">
            <button
              className="p-2 hover:bg-neutral-5 rounded-full"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden lg:flex min-w-custom-1 max-w-custom-1 items-center gap-2 xl:gap-4 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5"
            >
              <div className="size-6 xl:size-7 aspect-square">
                <Img
                  src={VARIABLE_CONSTANT.SHORT_LOGO}
                  fit="cover"
                  alt="SHORT_LOGO"
                />
              </div>
              <div className="w-20 xl:w-[110px]">
                <Img
                  src={VARIABLE_CONSTANT.DARK_LOGO}
                  fit="cover"
                  alt="DARK_LOGO"
                />
              </div>
            </Link>
            <div className="hidden xl:block w-32 xl:w-[160px]">
              <Img
                src={VARIABLE_CONSTANT.EVENT_BANNER}
                fit="cover"
                alt="event"
              />
            </div>
          </div>

          <div className="h-full min-w-0 flex-1 lg:min-w-custom-2 lg:max-w-custom-2 lg:grow gap-x-6 flex items-center justify-center">
            <Link
              href="/"
              className="lg:hidden flex items-center gap-1.5 flex-shrink-0"
            >
              <div className="size-5 sm:size-6 aspect-square">
                <Img
                  src={VARIABLE_CONSTANT.SHORT_LOGO}
                  fit="cover"
                  alt="SHORT_LOGO"
                />
              </div>
              <div className="w-14 sm:w-16">
                <Img
                  src={VARIABLE_CONSTANT.DARK_LOGO}
                  fit="cover"
                  alt="DARK_LOGO"
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center justify-center flex-1 gap-x-6">
              <nav className="flex h-12 items-end">
                {MENU_ARR.map((menu) => {
                  const Icon = menu.icon;
                  return (
                    <Link
                      key={menu.label}
                      href={menu.url}
                      className="group relative flex h-12 w-16 xl:w-20 flex-col justify-between rounded-t-lg hover:bg-neutral-2"
                    >
                      <span
                        className={`h-10 w-full flex items-center justify-center ${
                          pathname === menu.url
                            ? '[&>svg>path]:fill-[#6f32bb]'
                            : '[&>svg>path]:fill-neutral-40'
                        }`}
                      >
                        <Icon />
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 z-10 h-1 w-full rounded-t-md transition-all ${
                          pathname === menu.url
                            ? 'bg-[#6f32bb]'
                            : 'bg-transparent group-hover:bg-[#6f32bb]'
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-1 max-w-xs xl:max-w-[400px]">
                <div
                  ref={searchContainerRef}
                  className="relative w-full h-10 items-center justify-start gap-x-2 overflow-visible rounded-lg bg-white pr-2 flex focus-within:border-customPurple-4 focus-within:shadow-active hover:shadow-hover"
                >
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center w-full"
                  >
                    <Input
                      type="text"
                      variant="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search users, posts..."
                      containerClassName="w-full"
                    />
                  </form>

                  <SearchDropdown
                    suggestions={suggestions}
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    onSelect={handleSuggestionSelect}
                    query={searchQuery}
                    isLoading={isSearchLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center max-w-custom-1 min-w-0 lg:min-w-[320px] items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              className="lg:hidden p-2 hover:bg-neutral-5 rounded-full flex-shrink-0"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={16} />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {MENU_RIGHT.slice(0, 2).map((mr) => {
                const Icon = mr.icon;
                return (
                  <div
                    role="button"
                    className="relative h-8 w-8 flex rounded-full bg-neutral-2 justify-center items-center hover:bg-neutral-5"
                    key={mr.value}
                  >
                    <div className="[&>svg>path]:fill-neutral-40">
                      {Icon && <Icon className="size-5 sm:size-6" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              data-testid="profile-avatar"
              className="relative h-7 w-7 sm:h-8 sm:w-8 flex rounded-full bg-neutral-2 justify-center items-center hover:bg-neutral-5 cursor-pointer flex-shrink-0"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              ref={profileDropdownRef}
            >
              <Img
                src={user?.avatar || VARIABLE_CONSTANT.NO_AVATAR}
                className="w-full h-full rounded-full"
                fit="cover"
              />
              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                onLogout={handleLogout}
                isLoading={isLoading}
              />
            </div>

            <div className="hidden sm:flex items-center">
              <div className="w-px h-6 mx-2 shrink-0 bg-customGray-1" />
              <Button
                data-testid="wallet-button"
                type="button"
                className="flex items-center gap-2 h-8 px-2 lg:px-3 py-2 text-sm rounded-md bg-neutral-2 text-neutral-60 hover:bg-neutral-5"
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <div className="min-w-5 min-h-5 lg:min-w-6 lg:min-h-6 aspect-square [&>svg>path]:fill-neutral-40">
                    <CSWallet />
                  </div>
                  <span className="hidden lg:block whitespace-nowrap text-neutral-40">
                    Wallet
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-3 sm:p-4 z-50">
            <div className="flex items-center gap-3">
              <div
                ref={searchContainerRef}
                className="relative flex-1 h-10 items-center justify-start gap-x-2 overflow-visible rounded-lg bg-white pr-2 flex focus-within:border-customPurple-4"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center w-full"
                >
                  <Input
                    type="text"
                    variant="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search users, posts..."
                    autoFocus
                    containerClassName="w-full"
                  />
                </form>

                <SearchDropdown
                  suggestions={suggestions}
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  onSelect={handleSuggestionSelect}
                  query={searchQuery}
                  isLoading={isSearchLoading}
                />
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 hover:bg-neutral-5 rounded-full flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
