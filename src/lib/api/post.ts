import {
  CreateDraftDto,
  CreatePostDto,
  DraftsQueryDto,
  DraftsResponse,
  ImageUploadResponse,
  Post,
  PostsQueryDto,
  PostsResponse,
  PublishDraftDto,
  UpdateDraftDto,
  UpdatePostDto,
} from '@/types';
import { apiClient } from './client';

const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const postsApi = {
  create: async (data: CreatePostDto): Promise<Post> => {
    return apiClient.post('/posts', data);
  },

  getAll: async (query?: PostsQueryDto): Promise<PostsResponse> => {
    const queryString = query ? buildQueryString(query) : '';
    const url = queryString ? `/posts?${queryString}` : '/posts';
    return apiClient.get(url);
  },

  getById: async (id: string): Promise<Post> => {
    return apiClient.get(`/posts/${id}`);
  },

  update: async (id: string, data: UpdatePostDto): Promise<Post> => {
    return apiClient.patch(`/posts/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/posts/${id}`);
  },

  like: async (id: string): Promise<Post> => {
    return apiClient.post(`/posts/${id}/like`);
  },

  getLikeStatus: async (id: string): Promise<boolean> => {
    return apiClient.get(`/posts/${id}/like-status`);
  },

  toggleLike: async (id: string): Promise<{ post: Post; isLiked: boolean }> => {
    return apiClient.post(`/posts/${id}/toggle-like`);
  },

  getPopular: async (limit?: number): Promise<Post[]> => {
    const url = limit ? `/posts/popular?limit=${limit}` : '/posts/popular';
    return apiClient.get(url);
  },

  getRecent: async (limit?: number): Promise<Post[]> => {
    const url = limit ? `/posts/recent?limit=${limit}` : '/posts/recent';
    return apiClient.get(url);
  },

  drafts: {
    create: async (data: CreateDraftDto): Promise<Post> => {
      return apiClient.post('/posts/drafts', data);
    },

    getAll: async (query?: DraftsQueryDto): Promise<DraftsResponse> => {
      const queryString = query ? buildQueryString(query) : '';
      const url = queryString
        ? `/posts/drafts?${queryString}`
        : '/posts/drafts';
      return apiClient.get(url);
    },

    getById: async (id: string): Promise<Post> => {
      return apiClient.get(`/posts/drafts/${id}`);
    },

    update: async (id: string, data: UpdateDraftDto): Promise<Post> => {
      return apiClient.patch(`/posts/drafts/${id}`, data);
    },

    publish: async (id: string, data?: PublishDraftDto): Promise<Post> => {
      return apiClient.post(`/posts/drafts/${id}/publish`, data || {});
    },

    discard: async (id: string): Promise<void> => {
      return apiClient.delete(`/posts/drafts/${id}`);
    },
  },

  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    return apiClient.post('/posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getImageUrl: (filename: string): string => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/images/${filename}`;
  },

  extractFilenameFromUrl: (imageUrl: string): string | null => {
    const parts = imageUrl.split('/');
    return parts[parts.length - 1] || null;
  },

  normalizeImageUrl: (imageUrlOrFilename: string): string => {
    if (
      imageUrlOrFilename.startsWith('http') ||
      imageUrlOrFilename.startsWith('/')
    ) {
      return imageUrlOrFilename;
    }
    return postsApi.getImageUrl(imageUrlOrFilename);
  },
};