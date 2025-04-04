import type { MockConfig } from '../../types'

export const authMockData: MockConfig = {
  'auth/login': {
    POST: {
      data: {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'admin',
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
  'appstate': {
    GET: {
      data: {
        loggedIn: true,
        user: {
          id: '1',
          username: 'Sergio Neskodi',
          email: 'test@example.com',
          role: 'admin'
        }
      },
      status: 200
    }
  }
}
