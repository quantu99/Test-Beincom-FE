export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}
