/* eslint-disable react-hooks/exhaustive-deps */
import { CurrentUrl, RouterChangeType, RouterInfo } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useCurrentUrl(): CurrentUrl {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    pathname,
    searchParams,
    getQuery: () => Object.fromEntries(searchParams.entries()),
    getUrl: () =>
      searchParams.size > 0
        ? `${pathname}?${searchParams.toString()}`
        : pathname,
    setUrl: (params = {}) => {
      const query = new URLSearchParams(params);
      return query.size > 0 ? `${pathname}?${query.toString()}` : pathname;
    },
  };
}

/**
 * Bắt sự kiện thay đổi url
 *
 * @param callback - Hàm callback, có thể return cleanup function
 * @param type - Loại theo dõi: both | params | path (mặc định: both)
 */
export function useEffectRouter(
  callback: (info: RouterInfo) => void | (() => void),
  type: RouterChangeType = 'both'
) {
  const { pathname, searchParams } = useCurrentUrl();

  const deps: string[] = [];
  if (type === 'both') {
    deps.push(pathname, searchParams.toString());
  } else if (type === 'params') {
    deps.push(searchParams.toString());
  } else if (type === 'path') {
    deps.push(pathname);
  }

  useEffect(() => {
    const res = callback({ pathname, searchParams });
    if (typeof res === 'function') return res;
  }, deps);
}
