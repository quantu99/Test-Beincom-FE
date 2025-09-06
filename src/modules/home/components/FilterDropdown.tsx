'use client';

import { Button } from '@/components';
import { useState, useEffect, useRef } from 'react';

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

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  {
    value: 'popular',
    label: 'Phổ biến nhất',
    description: 'Sắp xếp theo độ phổ biến',
  },
  {
    value: 'createdAt',
    label: 'Mới nhất',
    description: 'Sắp xếp theo thời gian tạo',
  },
  {
    value: 'publishedAt',
    label: 'Xuất bản mới nhất',
    description: 'Sắp xếp theo thời gian xuất bản',
  },
  {
    value: 'likes',
    label: 'Nhiều lượt thích',
    description: 'Sắp xếp theo số lượt thích',
  },
  {
    value: 'views',
    label: 'Nhiều lượt xem',
    description: 'Sắp xếp theo số lượt xem',
  },
  {
    value: 'comments',
    label: 'Nhiều bình luận',
    description: 'Sắp xếp theo số bình luận',
  },
  {
    value: 'title',
    label: 'Theo tiêu đề',
    description: 'Sắp xếp theo bảng chữ cái',
  },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: 'DESC', label: 'Giảm dần' },
  { value: 'ASC', label: 'Tăng dần' },
] as const;

const LIMIT_OPTIONS = [
  { value: 5, label: '5 bài viết' },
  { value: 10, label: '10 bài viết' },
  { value: 20, label: '20 bài viết' },
  { value: 50, label: '50 bài viết' },
] as const;

export function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterDropdownProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<
    'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  >('bottom-right');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      let newPosition: typeof position = 'bottom-right';

      if (rect.bottom > windowHeight - 20) {
        newPosition = rect.right > windowWidth / 2 ? 'top-right' : 'top-left';
      } else {
        newPosition =
          rect.right > windowWidth / 2 ? 'bottom-right' : 'bottom-left';
      }

      setPosition(newPosition);
    }
  }, [isOpen]);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      limit: 10,
    };
    setLocalFilters(defaultFilters);
    onReset();
  };

  if (!isOpen) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
      default:
        return 'top-full right-0 mt-2';
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 ${getPositionClasses()}`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Sắp xếp theo
          </h4>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={localFilters.sortBy === option.value}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      sortBy: e.target.value as FilterOptions['sortBy'],
                    })
                  }
                  className="mt-1 w-4 h-4 text-customPurple-1 border-gray-300 focus:ring-customPurple-1 focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {localFilters.sortBy !== 'popular' && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Thứ tự</h4>
            <div className="space-y-2">
              {SORT_ORDER_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <input
                    type="radio"
                    name="sortOrder"
                    value={option.value}
                    checked={localFilters.sortOrder === option.value}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        sortOrder: e.target.value as FilterOptions['sortOrder'],
                      })
                    }
                    className="w-4 h-4 text-customPurple-1 border-gray-300 focus:ring-customPurple-1 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Số lượng hiển thị
          </h4>
          <div className="space-y-2">
            {LIMIT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <input
                  type="radio"
                  name="limit"
                  value={option.value}
                  checked={localFilters.limit === option.value}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      limit: parseInt(e.target.value),
                    })
                  }
                  className="w-4 h-4 text-customPurple-1 border-gray-300 focus:ring-customPurple-1 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleReset}
            className="flex-1 !bg-gray-100 hover:!bg-gray-200 !text-gray-700 !py-2 !px-4 text-sm font-medium"
          >
            Đặt lại
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 !bg-customPurple-1 hover:!bg-customPurple-1/90 text-white !py-2 !px-4 text-sm font-medium"
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}
