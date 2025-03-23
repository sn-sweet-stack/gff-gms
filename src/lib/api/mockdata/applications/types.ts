import type { Address, Applicant } from "../applicants/types";
import type { BankingCredential } from "../bankingCredentials/types";

export type ApplicationStatus =
  "pending"
  | "submitted"
  | "needs-resubmitting"
  | "accepted"
  | "rejected"
  | "board-voted"
  | "resubmitted"

export type ApplicationType = "renewal" | "new-grant"

// Simple revision history entry for applications
export interface RevisionHistoryEntry {
  status: ApplicationStatus;
  author_name: string;
  created_at: string;
  notes: string | null;
}

export interface Application {
  id: string;
  type: ApplicationType;
  year: string;
  status: ApplicationStatus;
  application_enabled: number;
  completing_person: string | null;
  opening_at: string;
  closing_at: string;
  submitted_at: string | null;
  // Applicant data fully or partially included in the application response
  applicant?: Partial<Applicant>;
  // Revision history for the application
  revisions?: RevisionHistoryEntry[];
  // Banking credential associated with the application
  banking_credential?: BankingCredential;
  payload: {
    applicant_info?: {
      organization_phone_country_code?: string
      phone_country_code?: string
      phone_number?: string | null
      email?: string
      mailing_address?: Partial<Address>
      address_of_operations?: Partial<Address> & {
        is_same_as_mailing_address?: boolean
      }
      organization_phone_number?: string
      website?: string
      name?: string
      title?: string
      additional_contacts?: Array<{
        name: string
        title: string
        phone_country_code: string
        phone_number: string
        email: string
      }>
    }
    public_charity_qualification?: {
      country_of_operations?: string
      local_currency?: string
      exchange_rate?: number
      country?: string
      financial_year_end?: string
      financial_data?: {
        [year: string]: {
          donations: number
          membership_fees: number
          mission_related_revenue: number
          investment_income: number
          non_mission_income: number
          government_services: number
        }
      }
      minor_donors?: {
        [year: string]: number
      }
      major_donors?: {
        [year: string]: Array<{
          name: string
          amount: number
          exempted: boolean
        }>
      }
    }
    foreign_entity_affidavit?: {
      country_of_operations?: string
    }
    non_profit_status?: {
      is_organization_US_entity?: boolean
    }
    general_operating_funding?: {
      has_amount_changed_from_last_year?: boolean
      amount?: number
      explanation?: string
    }
    project_funding?: {
      has_received_funding?: boolean
      was_completed?: boolean
      status?: string
    }
    new_project_funding?: {
      is_requesting?: boolean
      name?: string
      amount?: number
      description?: string
    }
    administrative_expenses?: Array<{
      name: string
      amount: number
    }>
    bank_info?: {
      has_changed?: boolean
      bank_name?: string
      bank_country?: string
      bank_address?: string
      account_number?: string
      swift_bic_code?: string
    }
    additional_info?: {
      wants_to_provide?: boolean
      notes?: string
    }
  };
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  applicant_id: string;
  banking_credential_id: string;
  last_revision_id: string | null;
}

export interface ApplicationsResponse {
  data: Application[];
}

export interface ApplicationResponse {
  data: Application;
}
