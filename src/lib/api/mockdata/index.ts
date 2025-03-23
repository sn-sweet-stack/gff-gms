import { authMockData } from './auth/authMockData.ts'
import { applicationMockData } from './applications/applicationMockData.ts'
import { applicantMockData } from './applicants/applicantMockData.ts'
import { revisionMockData } from './revisions/revisionMockData.ts'
import { bankingCredentialMockData } from './bankingCredentials/bankingCredentialMockData.ts'
import type { MockConfig } from '../types'

// Combine all mock data
export const mockData: MockConfig = {
  ...authMockData,
  ...applicationMockData,
  ...applicantMockData,
  ...revisionMockData,
  ...bankingCredentialMockData,
}
