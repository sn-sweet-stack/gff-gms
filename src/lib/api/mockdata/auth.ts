import type { MockConfig } from '../types'

export const authMockData: MockConfig = {
  'auth/login': {
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
  'auth/logout': {
    POST: {
      data: {},
      status: 200
    }
  },
  'users/me': {
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
