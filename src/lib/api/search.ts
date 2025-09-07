import { apiClient } from './client';
import { SearchQuery, SearchResponse, SearchSuggestion } from '@/types/search';

const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const searchApi = {
  getSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];
    return apiClient.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  search: async (params: SearchQuery): Promise<SearchResponse> => {
    const queryString = buildQueryString(params);
    return apiClient.get(`/search?${queryString}`);
  },

  quickSearch: async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];
    return apiClient.get(
      `/search/quick?q=${encodeURIComponent(query)}&limit=5`,
    );
  },
};
