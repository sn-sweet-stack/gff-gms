import { HttpClient } from './httpClient'

// Type for mock response data
export interface MockResponse<T = any> {
  data: T
  status: number
  delay?: number
}

// Type for mock data configuration
export interface MockConfig {
  [endpoint: string]: {
    [method: string]: MockResponse
  }
}

export class MockHttpClient implements HttpClient {
  private mockData: MockConfig
  private baseURL: string

  constructor(baseURL: string, mockData: MockConfig = {}) {
    this.baseURL = baseURL
    this.mockData = mockData
  }

  private async mockResponse<T>(
    method: string,
    url: string,
  ): Promise<T> {
    // Normalize URL by removing leading slash if present
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url
    
    // Check if we have mock data for this endpoint and method
    if (this.mockData[normalizedUrl] && this.mockData[normalizedUrl][method]) {
      const mockResponse = this.mockData[normalizedUrl][method]
      
      // Simulate network delay if specified
      if (mockResponse.delay) {
        await new Promise(resolve => setTimeout(resolve, mockResponse.delay))
      }
      
      // If status is not 2xx, throw an error
      if (mockResponse.status < 200 || mockResponse.status >= 300) {
        throw new Error(`Mock API error: ${mockResponse.status}`)
      }
      
      return mockResponse.data as T
    }
    
    console.warn(`No mock data found for ${method} ${url}`)
    throw new Error(`No mock data found for ${method} ${url}`)
  }

  async get<T>(url: string): Promise<T> {
    return this.mockResponse<T>('GET', url)
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('POST', url)
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('PUT', url)
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('PATCH', url)
  }

  async delete<T>(url: string): Promise<T> {
    return this.mockResponse<T>('DELETE', url)
  }
}
