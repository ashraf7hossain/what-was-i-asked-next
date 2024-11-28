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
  user_id: string
  user_name: string;
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  id: string;
  body: string;
  user_id: string;
  user_name: string;
  post_id: string;
  // votes: number;
}