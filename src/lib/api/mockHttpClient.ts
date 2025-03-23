import type { HttpClient, RequestConfig } from './httpClient'
import type { MockConfig, MockResponse } from './types'

export class MockHttpClient implements HttpClient {
  private mockData: MockConfig
  // @ts-ignore
  private baseURL: string

  constructor(baseURL: string, mockData: MockConfig = {}) {
    this.baseURL = baseURL
    this.mockData = mockData
  }

  private async mockResponse<T>(
    method: string,
    url: string,
    config?: RequestConfig
  ): Promise<T> {
    // Normalize URL by removing leading slash if present
    let normalizedUrl = url.startsWith('/') ? url.substring(1) : url
    
    // Extract query parameters
    const queryParams: Record<string, string> = {}
    const urlParts = normalizedUrl.split('?')
    if (urlParts.length > 1) {
      normalizedUrl = urlParts[0]
      const searchParams = new URLSearchParams(urlParts[1])
      searchParams.forEach((value, key) => {
        queryParams[key] = value
      })
    }
    
    // Also include any params from the config
    if (config?.params) {
      Object.assign(queryParams, config.params)
    }
    
    // Check for dynamic path parameters (e.g., /applications/:id)
    let matchedEndpoint = normalizedUrl
    let urlParams: string[] = []
    
    // If exact match not found, try to match a dynamic route pattern
    if (!this.mockData[normalizedUrl] || !this.mockData[normalizedUrl][method]) {
      const urlSegments = normalizedUrl.split('/')
      
      // Find a matching route pattern
      for (const endpoint in this.mockData) {
        const endpointSegments = endpoint.split('/')
        
        // Skip if segment count doesn't match
        if (urlSegments.length !== endpointSegments.length) continue
        
        let isMatch = true
        const extractedParams: string[] = []
        
        for (let i = 0; i < endpointSegments.length; i++) {
          // If segment is a parameter placeholder (starts with :)
          if (endpointSegments[i].startsWith(':')) {
            extractedParams.push(urlSegments[i])
          } 
          // Otherwise, segments must match exactly
          else if (endpointSegments[i] !== urlSegments[i]) {
            isMatch = false
            break
          }
        }
        
        if (isMatch) {
          matchedEndpoint = endpoint
          urlParams = extractedParams
          break
        }
      }
    }

    // Check if we have mock data for this endpoint and method
    if (this.mockData[matchedEndpoint] && this.mockData[matchedEndpoint][method]) {
      const mockResponse = this.mockData[matchedEndpoint][method]
      
      // Use handler function if available to process dynamic responses
      let responseData: MockResponse
      if (mockResponse.handler && typeof mockResponse.handler === 'function') {
        responseData = mockResponse.handler(queryParams, urlParams)
      } else {
        responseData = mockResponse
      }

      // Simulate network delay if specified
      if (responseData.delay) {
        await new Promise(resolve => setTimeout(resolve, responseData.delay))
      }

      // If status is not 2xx, throw an error
      if (responseData.status < 200 || responseData.status >= 300) {
        throw new Error(`Mock API error: ${responseData.status}`)
      }

      return responseData.data as T
    }

    console.warn(`No mock data found for ${method} ${url}`)
    throw new Error(`No mock data found for ${method} ${url}`)
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.mockResponse<T>('GET', url, config)
  }

  // @ts-ignore
  async post<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('POST', url)
  }

  // @ts-ignore
  async put<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('PUT', url)
  }

  // @ts-ignore
  async patch<T>(url: string, data?: any): Promise<T> {
    return this.mockResponse<T>('PATCH', url)
  }

  async delete<T>(url: string): Promise<T> {
    return this.mockResponse<T>('DELETE', url)
  }
}
