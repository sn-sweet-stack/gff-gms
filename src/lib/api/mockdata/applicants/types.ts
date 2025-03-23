export interface MailingAddress {
  street_address_1: string;
  street_address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface AddressOfOperations {
  is_same_as_mailing_address?: boolean;
  street_address_1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface Applicant {
  id: string;
  gff_id: string;
  organization_name: string;
  organization_phone_country_code: string;
  name: string | null;
  title: string | null;
  phone_number: string | null;
  phone_country_code: string;
  additional_phones: string[] | null;
  email: string;
  additional_emails: string[] | null;
  website: string | null;
  mailing_address: MailingAddress;
  address_of_operations: AddressOfOperations | null;
  normalized_organization_name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicantsResponse {
  data: Applicant[];
}

export interface ApplicantResponse {
  data: Applicant;
}
