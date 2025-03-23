import applicants from './applicants.json'
import type { MockResponse } from '../../types'
import type { Applicant, ApplicantsResponse, ApplicantResponse } from './types'

// Helper function to filter applicants based on query parameters
function filterApplicants(params?: Record<string, string>): Applicant[] {
  let filteredApplicants = applicants as unknown as Applicant[];

  if (params) {
    filteredApplicants = filteredApplicants.filter(applicant => {
      // Filter by each parameter if it exists
      for (const [key, value] of Object.entries(params)) {
        if (key === 'gff_id' && applicant.gff_id !== value) return false;
        if (key === 'organization_name' && !applicant.organization_name.toLowerCase().includes(value.toLowerCase())) return false;
      }
      return true;
    });
  }

  return filteredApplicants;
}

// GET /applicants - Get all applicants with optional filtering
const getApplicants: MockResponse<ApplicantsResponse> = {
  status: 200,
  // This handler will be called by the modified mockHttpClient
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterApplicants(params) }
  })
}

// GET /applicants/:id - Get a single applicant by ID
const getApplicantById: MockResponse<ApplicantResponse> = {
  status: 200,
  // This handler will be called by the modified mockHttpClient
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0];
    const applicant = (applicants as unknown as Applicant[]).find(app => app.id === id);

    if (applicant) {
      return {
        status: 200,
        data: { data: applicant }
      };
    }

    return {
      status: 404,
      data: { error: 'Applicant not found' } as any
    };
  }
}

export const applicantMockData = {
  'applicants': {
    'GET': getApplicants
  },
  'applicants/:id': {
    'GET': getApplicantById
  }
};
