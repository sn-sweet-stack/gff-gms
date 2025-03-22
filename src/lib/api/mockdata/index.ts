import { authMockData } from './auth'
import type { MockConfig } from '../types'

// Combine all mock data
export const mockData: MockConfig = {
  ...authMockData,
}
