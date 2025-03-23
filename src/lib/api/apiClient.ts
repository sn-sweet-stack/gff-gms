import { FetchHttpClient } from './httpClient'
import type { HttpClient } from './httpClient'
import { MockHttpClient } from './mockHttpClient'
import { mockData } from './mockdata'
import type { User, LoginRequest, LoginResponse, AppState } from './mockdata/auth/types'
import type { Application, ApplicationsResponse, ApplicationResponse } from './mockdata/applications/types'
import type { Applicant, ApplicantsResponse, ApplicantResponse } from './mockdata/applicants/types'

export class ApiClient {
  private httpClient: HttpClient

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

    // Use mock client if in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      this.httpClient = new MockHttpClient(baseURL, mockData)
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

  async getAppState(): Promise<AppState> {
    return this.httpClient.get<AppState>('/appstate')
  }

  // Application methods
  async getApplications(filters?: { status?: string; year?: string; type?: string }): Promise<Application[]> {
    const response = await this.httpClient.get<ApplicationsResponse>('/applications', { params: filters })
    return response.data
  }

  async getApplicationById(id: string): Promise<Application> {
    const response = await this.httpClient.get<ApplicationResponse>(`/applications/${id}`)
    return response.data
  }

  // Applicant methods
  async getApplicants(filters?: { gff_id?: string; organization_name?: string }): Promise<Applicant[]> {
    const response = await this.httpClient.get<ApplicantsResponse>('/applicants', { params: filters })
    return response.data
  }

  async getApplicantById(id: string): Promise<Applicant> {
    const response = await this.httpClient.get<ApplicantResponse>(`/applicants/${id}`)
    return response.data
  }
}

// Export a singleton instance
export const api = new ApiClient()
