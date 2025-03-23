import { FetchHttpClient } from './httpClient'
import type { HttpClient } from './httpClient'
import { MockHttpClient } from './mockHttpClient'
import { mockData } from './mockdata'
import type { User, LoginRequest, LoginResponse, AppState } from './mockdata/auth/types'
import type { Application, ApplicationsResponse, ApplicationResponse } from './mockdata/applications/types'
import type { Applicant, ApplicantsResponse, ApplicantResponse } from './mockdata/applicants/types'
import type { Revision, RevisionsResponse, RevisionResponse } from './mockdata/revisions/types'
import type { BankingCredential, BankingCredentialsResponse, BankingCredentialResponse } from './mockdata/bankingCredentials/types'

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

  // Revision methods
  async getRevisions(filters?: { application_id?: string; change_type?: string }): Promise<Revision[]> {
    const response = await this.httpClient.get<RevisionsResponse>('/revisions', { params: filters })
    return response.data
  }

  async getRevisionById(id: string): Promise<Revision> {
    const response = await this.httpClient.get<RevisionResponse>(`/revisions/${id}`)
    return response.data
  }

  async getApplicationRevisions(applicationId: string): Promise<Revision[]> {
    const response = await this.httpClient.get<RevisionsResponse>(`/applications/${applicationId}/revisions`)
    return response.data
  }

  // Banking Credential methods
  async getBankingCredentialById(id: string): Promise<BankingCredential> {
    const response = await this.httpClient.get<BankingCredentialResponse>(`/banking-credentials/${id}`)
    return response.data
  }

  async getApplicantBankingCredentials(applicantId: string): Promise<BankingCredential[]> {
    const response = await this.httpClient.get<BankingCredentialsResponse>(`/applicants/${applicantId}/banking-credentials`)
    return response.data
  }
}

// Export a singleton instance
export const api = new ApiClient()
