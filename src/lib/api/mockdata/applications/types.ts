export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'accepted'
export type ApplicationType = 'renewal' | 'grant' | 'loan' | 'scholarship'

export interface Application {
  id: string
  title: string
  description: string
  amount: number
  status: ApplicationStatus
  type: ApplicationType
  year: string
  applicantId: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationsResponse {
  data: Application[]
}

export interface ApplicationResponse {
  data: Application
}
