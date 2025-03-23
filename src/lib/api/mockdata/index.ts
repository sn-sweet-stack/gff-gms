import { authMockData } from './auth'
import { applicationMockData } from './applicationMockData'
import type { MockConfig } from '../types'

// Combine all mock data
export const mockData: MockConfig = {
  ...authMockData,
  ...applicationMockData,
}
