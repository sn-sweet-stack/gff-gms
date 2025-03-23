export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'accepted'
export type ApplicationType = 'renewal' | 'grant' | 'loan' | 'scholarship'

export interface Application {
  id: string
  type: ApplicationType
  year: string
  status: ApplicationStatus
  application_enabled: number
  completing_person: string | null
  opening_at: string
  closing_at: string
  submitted_at: string | null
  // Applicant data included in the application response
  applicant?: {
    gff_id: string
    organization_name: string
  }
  payload: {
    applicant_info?: {
      organization_phone_country_code?: string
      phone_country_code?: string
      phone_number?: string | null
      email?: string
      mailing_address?: {
        street_address_1?: string
        street_address_2?: string
        city?: string
        state?: string
        postal_code?: string
        country?: string
      }
    }
    public_charity_qualification?: {
      country_of_operations?: string
    }
    foreign_entity_affidavit?: {
      country_of_operations?: string
    }
    general_operating_funding?: {
      has_amount_changed_from_last_year?: boolean
      amount?: number
      explanation?: string
    }
    new_project_funding?: {
      is_requesting?: boolean
    }
    funding?: {
      general_operating_funding?: number
      project_funding?: number
      total_funding?: number
      source?: string
    }
  }
  deleted_at: string | null
  created_at: string
  updated_at: string
  applicant_id: string
  banking_credential_id: string
  last_revision_id: string | null
}

export interface ApplicationsResponse {
  data: Application[]
}

export interface ApplicationResponse {
  data: Application
}
