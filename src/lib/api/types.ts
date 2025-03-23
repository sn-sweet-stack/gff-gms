// API response and request types
export type UserRole = 'admin' | 'staff' | 'board' | 'trustee' | 'assignee' | 'cfo'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  token?: string
}

export interface AppState {
  loggedIn: boolean
  user: User | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// Mock data types
export interface MockResponse<T = any> {
  data: T
  status: number
  delay?: number
  handler?: (params?: Record<string, string>, urlParams?: string[]) => MockResponse
}

export interface MockConfig {
  [endpoint: string]: {
    [method: string]: MockResponse
  }
}
