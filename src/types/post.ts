import { User } from './auth';
import { Comment } from './comment';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}



export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  views: number;
  likes: number;
  status: PostStatus;
  publishedAt?: string;
  author: User;
  authorId: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  image?: string;
  status?: PostStatus;
}

export interface CreateDraftDto {
  title: string;
  content: string;
  image?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  image?: string;
  status?: PostStatus;
}

export interface UpdateDraftDto {
  title?: string;
  content?: string;
  image?: string;
}

export interface PublishDraftDto {
  title?: string;
  content?: string;
  image?: string;
}

export interface PostsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?:
    | 'createdAt'
    | 'title'
    | 'views'
    | 'likes'
    | 'comments'
    | 'publishedAt'
    | 'popular';
  sortOrder?: 'ASC' | 'DESC';
  status?: PostStatus;
}

export interface DraftsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DraftsResponse {
  drafts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImageUploadResponse {
  message: string;
  imageUrl: string;
  filename: string;
  originalName: string;
  size: number;
  url: any;
}
