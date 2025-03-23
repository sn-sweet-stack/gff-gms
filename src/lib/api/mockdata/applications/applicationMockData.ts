import applications from './applications.json'
import applicants from '../applicants/applicants.json'
import revisions from '../revisions/application_revisions.json'
import bankingCredentials from '../bankingCredentials/banking_credentials.json'
import type { MockResponse } from '../../types'
import type { Application, ApplicationsResponse, ApplicationResponse, RevisionHistoryEntry } from './types'
import type { BankingCredential } from '../bankingCredentials/types'

// Helper function to get simplified revision history for an application
function getRevisionHistory(applicationId: string): RevisionHistoryEntry[] {
  return (revisions as any[])
    .filter(rev => rev.application_id === applicationId)
    .map(rev => ({
      status: rev.application_row?.status || 'unknown',
      author_name: rev.author_type === 'App\\Models\\Applicant'
        ? rev.application_row?.payload?.applicant_info?.name || 'Applicant'
        : 'Staff Member',
      created_at: rev.created_at,
      notes: rev.status_notes
    }))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

// Helper function to enrich a single application with full details
function enrichApplication(app: Application): Application {
  const applicant = (applicants as any[]).find(a => a.id === app.applicant_id);
  const bankingCredential = (bankingCredentials as unknown as BankingCredential[]).find(
    bc => bc.id === app.banking_credential_id
  );
  
  return {
    ...app,
    applicant: applicant ? {
      gff_id: applicant.gff_id || '',
      organization_name: applicant.organization_name || ''
    } : undefined,
    revisions: getRevisionHistory(app.id),
    banking_credential: bankingCredential
  };
}

// Helper function to enrich multiple applications with minimal applicant data
function enrichApplicationsWithBasicInfo(apps: Application[]): Application[] {
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
  let filteredApps = applications as unknown as Application[];

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

  // Enrich with basic applicant data after filtering
  return enrichApplicationsWithBasicInfo(filteredApps);
}

// GET /applications - Get all applications with optional filtering
const getApplications: MockResponse<ApplicationsResponse> = {
  status: 200,
  // Only need the handler for dynamic responses
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterApplications(params) }
  })
}

// GET /applications/:id - Get a single application by ID
const getApplicationById: MockResponse<ApplicationResponse> = {
  status: 200,
  // Only need the handler for dynamic responses
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0]
    const application = (applications as unknown as Application[]).find(app => app.id === id)

    if (application) {
      // Enrich with full details including applicant data, banking credentials, and revision history
      const enrichedApplication = enrichApplication(application);
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
