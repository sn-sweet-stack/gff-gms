import media from './media.json'
import singleMedia from './single-media.json'
import type { MockResponse } from '../../types'
import type { Media, MediasResponse, MediaResponse } from './types'

// Helper function to filter media based on query parameters
// @ts-ignore
function filterMedia(params?: Record<string, string>): Media[] {
  let filteredMedia = media as unknown as Media[];

  // If application_id is provided, return media for a specific application
  return filteredMedia.filter(item =>
    item.model_type === "App\\Models\\Application" &&
    item.model_id === "9e800a92-9b21-48f8-b33e-9213948f769b"
  );
}

// GET /media - Get all media with optional filtering
const getMedia: MockResponse<MediasResponse> = {
  status: 200,
  handler: (params?: Record<string, string>) => ({
    status: 200,
    data: { data: filterMedia(params) }
  })
}

// GET /media/:id - Get a single media by ID
const getMediaById: MockResponse<MediaResponse> = {
  status: 200,
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const id = urlParams?.[0];
    const mediaItem = (singleMedia as unknown as Media[]).find(item => item.id === id) ||
                     (media as unknown as Media[]).find(item => item.id === id);

    if (mediaItem) {
      return {
        status: 200,
        data: { data: mediaItem }
      };
    }

    return {
      status: 404,
      data: { error: 'Media not found' } as any
    };
  }
}

// GET /applications/:id/media - Get media for a specific application
const getApplicationMedia: MockResponse<MediasResponse> = {
  status: 200,
  // @ts-ignore
  handler: (params?: Record<string, string>, urlParams?: string[]) => {
    const applicationId = urlParams?.[0];
    const applicationMedia = (media as unknown as Media[]).filter(
      item => item.model_type === 'App\\Models\\Application' && item.model_id === applicationId
    );

    return {
      status: 200,
      data: { data: applicationMedia }
    };
  }
}

export const mediaMockData = {
  'media': {
    'GET': getMedia
  },
  'media/:id': {
    'GET': getMediaById
  },
  'applications/:id/media': {
    'GET': getApplicationMedia
  }
};
