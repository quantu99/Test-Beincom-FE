import { ReadonlyURLSearchParams } from 'next/navigation';

export type RouterChangeType = 'both' | 'params' | 'path';

export interface RouterInfo {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}

export interface CurrentUrl {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  getQuery: () => Record<string, string>;
  getUrl: () => string;
  setUrl: (params?: Record<string, string>) => string;
}
