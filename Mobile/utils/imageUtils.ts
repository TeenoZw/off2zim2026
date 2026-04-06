import { getApiBaseUrl } from '@/lib/api';

const KNOWN_STORAGE_BUCKETS = [
  'content-images',
  'destinations',
  'stays',
  'events',
  'provider_galleries',
  'provider-content',
  'provider-documents',
] as const;

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const createBackendUrl = (path: string) => {
  const normalized = path.replace(/^\/+/, '');
  return `${getApiBaseUrl()}/${normalized}`;
};

const createAssetUrlFromStoragePath = (rawPath: string) => {
  const normalized = rawPath.replace(/^\/+/, '');

  if (normalized.startsWith('api/uploads/')) {
    return createBackendUrl(normalized);
  }

  for (const bucket of KNOWN_STORAGE_BUCKETS) {
    if (normalized.startsWith(`${bucket}/`)) {
      return createBackendUrl(`api/uploads/${normalized}`);
    }
  }

  return undefined;
};

export const normalizeStorageImageUrl = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (isHttpUrl(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/api/uploads/')) {
    return createBackendUrl(trimmed);
  }

  return createAssetUrlFromStoragePath(trimmed);
};

export const pickBestImageUrl = (
  primary?: string | null,
  additional?: Array<string | null | undefined>
) => {
  const candidates = [primary, ...(additional ?? [])];

  for (const candidate of candidates) {
    const resolved = normalizeStorageImageUrl(candidate ?? undefined);
    if (resolved) {
      return resolved;
    }
  }

  return undefined;
};
