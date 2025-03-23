// Re-export auth types for backward compatibility
export * from './mockdata/auth/types'

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
