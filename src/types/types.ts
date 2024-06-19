export interface User {
  user_id: number | null,
  username: string | null,
  email: string | null,
  role: string 
}

export interface Post {
  post_id: number | null,
  title: string | null,
  content: string | null,
  user_id: number | null,
}