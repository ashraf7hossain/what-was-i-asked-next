// API configuration
export const API_BASE_URL = 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/register`,
  login: `${API_BASE_URL}/api/login`,
  posts: `${API_BASE_URL}/api/posts`,
  votes: `${API_BASE_URL}/api/votes`,
  comment: `${API_BASE_URL}/api/comments`,
  comment_vote: `${API_BASE_URL}/api/comments/votes`,
} as const;