import { describe, expect, it } from 'vitest';
import { createMediaClient, imageReference, videoReference, type MediaItem } from './index';

const image: MediaItem = {
  id: 'image-1', kind: 'image', title: 'Hero', defaultAlt: 'Hero image', filename: 'hero.jpg',
  status: 'ready', width: 1200, height: 800, durationSeconds: 0, delivery: 'responsive-webp',
  extension: 'webp', warning: '', error: '', urls: {},
};

describe('media references', () => {
  it('serializes an image reference without project-specific fields', () => {
    expect(imageReference(image)).toEqual({
      source: 'r2', id: 'image-1', alt: 'Hero image', width: 1200, height: 800, delivery: 'responsive-webp',
    });
  });

  it('requires a poster for a video reference', () => {
    expect(videoReference({ ...image, kind: 'video', poster: undefined })).toBeNull();
  });

  it('uses the documented poster endpoint and payload', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher: typeof fetch = async (input, init) => {
      calls.push({ url: String(input), init });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    };
    const client = createMediaClient({ basePath: '/api/media', fetch: fetcher });

    await client.setPoster('video/1', 'image/1');

    expect(calls).toEqual([{
      url: '/api/media/video%2F1/poster',
      init: expect.objectContaining({ method: 'POST', body: JSON.stringify({ imageId: 'image/1' }) }),
    }]);
  });
});
