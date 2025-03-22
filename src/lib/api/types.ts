// API response and request types
export interface User {
  id: string
  username: string
  email: string
  token?: string
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
}

export interface MockConfig {
  [endpoint: string]: {
    [method: string]: MockResponse
  }
}
