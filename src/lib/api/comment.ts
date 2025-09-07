import { Comment, CreateCommentDto, UpdateCommentDto } from "@/types";
import { apiClient } from "./client";

export const commentsApi = {
  create: async (postId: string, data: CreateCommentDto): Promise<Comment> => {
    return apiClient.post(`/comments/posts/${postId}`, data);
  },

  getByPost: async (postId: string): Promise<Comment[]> => {
    return apiClient.get(`/comments/posts/${postId}`);
  },

  getById: async (id: string): Promise<Comment> => {
    return apiClient.get(`/comments/${id}`);
  },

  update: async (id: string, data: UpdateCommentDto): Promise<Comment> => {
    return apiClient.patch(`/comments/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/comments/${id}`);
  },

  getRecent: async (limit?: number): Promise<Comment[]> => {
    const url = limit ? `/comments/recent?limit=${limit}` : '/comments/recent';
    return apiClient.get(url);
  },

  getByUser: async (userId: string): Promise<Comment[]> => {
    return apiClient.get(`/comments/user/${userId}`);
  },
};
