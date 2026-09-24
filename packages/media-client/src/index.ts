export type MediaStatus =
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'awaiting_poster'
  | 'ready'
  | 'failed';

export type RemoteImageReference = {
  source: 'r2';
  id: string;
  alt: string;
  width: number;
  height: number;
  delivery: 'responsive-webp' | 'passthrough';
  extension?: 'gif' | 'svg';
};

export type RemoteVideoReference = {
  source: 'r2';
  id: string;
  width: number;
  height: number;
  durationSeconds: number;
  poster: RemoteImageReference;
};

export type MediaItem = {
  id: string;
  kind: 'image' | 'video';
  title: string;
  defaultAlt: string;
  filename: string;
  status: MediaStatus;
  width: number;
  height: number;
  durationSeconds: number;
  delivery: 'responsive-webp' | 'passthrough' | 'mp4' | '';
  extension: string;
  warning: string;
  error: string;
  urls: Record<string, string>;
  poster?: MediaItem;
};

export type UploadDescriptor = {
  uploadId: string;
  mediaId: string;
  mode: 'single' | 'multipart';
  url?: string;
  parts?: Array<{ partNumber: number; url: string; size: number }>;
};

export type CreateUploadInput = {
  kind: 'image' | 'video';
  filename: string;
  contentType: string;
  size: number;
  title?: string;
  defaultAlt?: string;
  parentId?: string;
  slot?: string;
};

export class MediaAPIError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'MediaAPIError';
  }
}

export type MediaClientOptions = {
  basePath?: string;
  fetch?: typeof globalThis.fetch;
};

export function imageReference(item: MediaItem, alt = item.defaultAlt): RemoteImageReference {
  return {
    source: 'r2',
    id: item.id,
    alt,
    width: item.width,
    height: item.height,
    delivery: item.delivery === 'passthrough' ? 'passthrough' : 'responsive-webp',
    ...(item.delivery === 'passthrough' && (item.extension === 'gif' || item.extension === 'svg')
      ? { extension: item.extension }
      : {}),
  };
}

export function videoReference(item: MediaItem): RemoteVideoReference | null {
  if (!item.poster) return null;
  return {
    source: 'r2',
    id: item.id,
    width: item.width,
    height: item.height,
    durationSeconds: item.durationSeconds,
    poster: imageReference(item.poster),
  };
}

export function createMediaClient({ basePath = '/api/media', fetch: fetcher = globalThis.fetch }: MediaClientOptions = {}) {
  if (!fetcher) throw new Error('A fetch implementation is required to create a media client.');

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetcher(`${basePath}${path}`, {
      credentials: 'same-origin',
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: string };
      throw new MediaAPIError(body.error || `Media API request failed (${response.status}).`, response.status);
    }
    return response.status === 204 ? undefined as T : response.json() as Promise<T>;
  }

  return {
    list(query = '') {
      return request<{ items: MediaItem[] }>(query ? `?${query}` : '');
    },
    get(id: string) {
      return request<MediaItem>(`/${encodeURIComponent(id)}`);
    },
    createUpload(input: CreateUploadInput) {
      return request<UploadDescriptor>('/uploads', { method: 'POST', body: JSON.stringify(input) });
    },
    completeUpload(uploadId: string, parts?: Array<{ partNumber: number; etag: string }>) {
      return request<{ mediaId: string; status: MediaStatus }>(`/uploads/${encodeURIComponent(uploadId)}/complete`, {
        method: 'POST', body: JSON.stringify({ parts }),
      });
    },
    setPoster(videoId: string, imageId: string) {
      return request<{ ok: true }>(`/${encodeURIComponent(videoId)}/poster`, {
        method: 'POST', body: JSON.stringify({ imageId }),
      });
    },
    retry(id: string) {
      return request<{ mediaId: string; status: MediaStatus }>(`/${encodeURIComponent(id)}/retry`, { method: 'POST' });
    },
    archive(id: string) {
      return request<void>(`/${encodeURIComponent(id)}/archive`, { method: 'POST' });
    },
  };
}
