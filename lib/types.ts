export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  user_id: string;
  user_name: string;
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  id: string;
  body: string;
  user_id: string;
  user_name: string | null | undefined;
  post_id: string;
  upvotes?: number;
  downvotes?: number;
  created_at: string;
  updated_at?: string;
  // votes: number;
}
