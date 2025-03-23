import { authMockData } from './auth/authMockData.ts'
import { applicationMockData } from './applications/applicationMockData.ts'
import { applicantMockData } from './applicants/applicantMockData.ts'
import type { MockConfig } from '../types'

// Combine all mock data
export const mockData: MockConfig = {
  ...authMockData,
  ...applicationMockData,
  ...applicantMockData,
}
