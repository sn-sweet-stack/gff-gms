import bankingCredentials from './banking_credentials.json'
import singleBankingCredential from './single-banking-credential.json'
import type { MockResponse } from '../../types'
import type { BankingCredential, BankingCredentialsResponse, BankingCredentialResponse } from './types'

// GET /banking-credentials/:id - Get a single banking credential by ID
const getBankingCredentialById: MockResponse<BankingCredentialResponse> = {
  status: 200,
  data: { data: singleBankingCredential[0] as unknown as BankingCredential },
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0];
    const credential = (bankingCredentials as unknown as BankingCredential[]).find(cred => cred.id === id);

    if (credential) {
      return {
        status: 200,
        data: { data: credential }
      };
    }

    return {
      status: 404,
      data: { error: 'Banking credential not found' } as any
    };
  }
}

// GET /applicants/:id/banking-credentials - Get banking credentials for a specific applicant
const getApplicantBankingCredentials: MockResponse<BankingCredentialsResponse> = {
  status: 200,
  data: { data: [] },
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const applicantId = urlParams?.[0];
    const applicantCredentials = (bankingCredentials as unknown as BankingCredential[]).filter(
      cred => cred.applicant_id === applicantId
    );

    return {
      status: 200,
      data: { data: applicantCredentials }
    };
  }
}

export const bankingCredentialMockData = {
  'banking-credentials/:id': {
    'GET': getBankingCredentialById
  },
  'applicants/:id/banking-credentials': {
    'GET': getApplicantBankingCredentials
  }
};
