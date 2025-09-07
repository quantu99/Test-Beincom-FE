export interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  excerpt?: string;
  avatar?: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes?: number;
  views?: number;
}

export interface SearchSuggestion {
  id: string;
  type: 'user' | 'post';
  title: string;
  avatar?: string;
}

export interface SearchQuery {
  q: string;
  type?: 'all' | 'user' | 'post';
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'likes';
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchResponse {
  results: SearchResult[];
  suggestions?: SearchSuggestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}