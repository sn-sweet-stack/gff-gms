import applications from './applications.json'
import applicants from '../applicants/applicants.json'
import type { MockResponse } from '../../types'
import type { Application, ApplicationsResponse, ApplicationResponse } from './types'

// Helper function to enrich applications with applicant data
function enrichApplicationsWithApplicantData(apps: Application[]): Application[] {
  return apps.map(app => {
    const applicant = (applicants as any[]).find(a => a.id === app.applicant_id);
    return {
      ...app,
      applicant: applicant ? {
        gff_id: applicant.gff_id || '',
        organization_name: applicant.organization_name || ''
      } : undefined
    };
  });
}

// Helper function to filter applications based on query parameters
function filterApplications(params?: Record<string, string>): Application[] {
  let filteredApps = applications as Application[];
  
  if (params) {
    filteredApps = filteredApps.filter(app => {
      // Filter by each parameter if it exists
      for (const [key, value] of Object.entries(params)) {
        if (key === 'status' && app.status !== value) return false
        if (key === 'year' && app.year !== value) return false
        if (key === 'type' && app.type !== value) return false
      }
      return true
    });
  }
  
  // Enrich with applicant data after filtering
  return enrichApplicationsWithApplicantData(filteredApps);
}

// GET /applications - Get all applications with optional filtering
const getApplications: MockResponse<ApplicationsResponse> = {
  status: 200,
  data: { data: enrichApplicationsWithApplicantData(applications as Application[]) },
  // This handler will be called by the modified mockHttpClient
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterApplications(params) }
  })
}

// GET /applications/:id - Get a single application by ID
const getApplicationById: MockResponse<ApplicationResponse> = {
  status: 200,
  data: { data: enrichApplicationsWithApplicantData([applications[0] as Application])[0] },
  // This handler will be called by the modified mockHttpClient
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0]
    const application = (applications as Application[]).find(app => app.id === id)

    if (application) {
      // Enrich with applicant data
      const enrichedApplication = enrichApplicationsWithApplicantData([application])[0];
      return {
        status: 200,
        data: { data: enrichedApplication }
      }
    }

    return {
      status: 404,
      data: { error: 'Application not found' } as any
    }
  }
}

export const applicationMockData = {
  'applications': {
    'GET': getApplications
  },
  'applications/:id': {
    'GET': getApplicationById
  }
}
