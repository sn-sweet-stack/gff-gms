import applications from './applications.json'
import type { MockResponse } from '../../types'
import type { Application, ApplicationsResponse, ApplicationResponse } from './types'

// Helper function to filter applications based on query parameters
function filterApplications(params?: Record<string, string>): Application[] {
  if (!params) return applications

  return applications.filter(app => {
    // Filter by each parameter if it exists
    for (const [key, value] of Object.entries(params)) {
      if (key === 'status' && app.status !== value) return false
      if (key === 'year' && app.year !== value) return false
      if (key === 'type' && app.type !== value) return false
    }
    return true
  })
}

// GET /applications - Get all applications with optional filtering
const getApplications: MockResponse<ApplicationsResponse> = {
  status: 200,
  data: { data: applications },
  // This handler will be called by the modified mockHttpClient
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterApplications(params) }
  })
}

// GET /applications/:id - Get a single application by ID
const getApplicationById: MockResponse<ApplicationResponse> = {
  status: 200,
  data: { data: applications[0] },
  // This handler will be called by the modified mockHttpClient
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0]
    const application = applications.find(app => app.id === id)

    if (application) {
      return {
        status: 200,
        data: { data: application }
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
