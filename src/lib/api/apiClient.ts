import { FetchHttpClient } from './httpClient'
import type { HttpClient } from './httpClient'
import { MockHttpClient } from './mockHttpClient'

// Define types for API responses
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

export class ApiClient {
  private httpClient: HttpClient

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

    // Use mock client if in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      this.httpClient = new MockHttpClient(baseURL, this.getMockData())
    } else {
      this.httpClient = new FetchHttpClient(baseURL)
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<User> {
    const response = await this.httpClient.post<LoginResponse>('/auth/login', credentials)

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
    }

    return response.user
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post<void>('/auth/logout')
    } finally {
      // Always clear local storage, even if the API call fails
      localStorage.removeItem('auth_token')
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.httpClient.get<User>('/users/me')
  }

  // Helper method to get mock data for testing
  private getMockData() {
    return {
      '/auth/login': {
        POST: {
          data: {
            user: {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
            },
            token: 'mock-jwt-token'
          },
          status: 200,
          delay: 500
        }
      },
      '/auth/logout': {
        POST: {
          data: {},
          status: 200
        }
      },
      '/users/me': {
        GET: {
          data: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
          },
          status: 200
        }
      }
    }
  }
}

// Export a singleton instance
export const api = new ApiClient()
