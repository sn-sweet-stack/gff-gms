import revisions from './application_revisions.json'
import type { MockResponse } from '../../types'
import type { Revision, RevisionsResponse, RevisionResponse } from './types'

// Helper function to filter revisions based on query parameters
function filterRevisions(params?: Record<string, string>): Revision[] {
  let filteredRevisions = revisions as unknown as Revision[];

  if (params) {
    filteredRevisions = filteredRevisions.filter(revision => {
      // Filter by each parameter if it exists
      for (const [key, value] of Object.entries(params)) {
        if (key === 'application_id' && revision.application_id !== value) return false;
        if (key === 'change_type' && revision.change_type !== value) return false;
      }
      return true;
    });
  }

  return filteredRevisions;
}

// GET /revisions - Get all revisions with optional filtering
const getRevisions: MockResponse<RevisionsResponse> = {
  status: 200,
  // This handler will be called by the modified mockHttpClient
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterRevisions(params) }
  })
}

// GET /revisions/:id - Get a single revision by ID
const getRevisionById: MockResponse<RevisionResponse> = {
  status: 200,
  // This handler will be called by the modified mockHttpClient
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0];
    const revision = (revisions as unknown as Revision[]).find(rev => rev.id === id);

    if (revision) {
      return {
        status: 200,
        data: { data: revision }
      };
    }

    return {
      status: 404,
      data: { error: 'Revision not found' } as any
    };
  }
}

// GET /applications/:id/revisions - Get revisions for a specific application
const getApplicationRevisions: MockResponse<RevisionsResponse> = {
  status: 200,
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const applicationId = urlParams?.[0];
    const applicationRevisions = (revisions as unknown as Revision[]).filter(
      rev => rev.application_id === applicationId
    );

    return {
      status: 200,
      data: { data: applicationRevisions }
    };
  }
}

export const revisionMockData = {
  'revisions': {
    'GET': getRevisions
  },
  'revisions/:id': {
    'GET': getRevisionById
  },
  'applications/:id/revisions': {
    'GET': getApplicationRevisions
  }
};
