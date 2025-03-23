import type { Application } from "../applications/types";
import type { Applicant } from "../applicants/types";

export type RevisionChangeType = "created" | "updated" | "deleted";
export type RevisionAuthorType = "App\\Models\\Applicant" | "App\\Models\\User";

export interface Revision {
  id: string;
  author_type: RevisionAuthorType;
  author_id: string;
  application_row: Application & {
    applicant: Applicant;
    banking_credential: {
      id: string;
      bank_name: string;
      bank_country: string;
      bank_address: string;
      account_number: string;
      ach: string;
      wire: string | null;
      swift_bic_code: string;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
      applicant_id: string;
    };
  };
  changed_fields: Record<string, any>;
  change_type: RevisionChangeType;
  status_notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  application_id: string;
}

export interface RevisionsResponse {
  data: Revision[];
}

export interface RevisionResponse {
  data: Revision;
}
