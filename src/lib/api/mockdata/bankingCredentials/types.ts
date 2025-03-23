export interface BankingCredential {
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
}

export interface BankingCredentialsResponse {
  data: BankingCredential[];
}

export interface BankingCredentialResponse {
  data: BankingCredential;
}
