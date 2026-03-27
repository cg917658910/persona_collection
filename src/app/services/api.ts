type ApiEnvelope<T> = {
  code: number
  message: string
  data: T
  meta?: unknown
}

export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') || '/api/v1'

function resolveShareBase() {
  const configured = (import.meta.env.VITE_SHARE_BASE as string | undefined)?.replace(/\/$/, '')
  if (configured) {
    return configured
  }
  if (/^https?:\/\//.test(API_BASE)) {
    return API_BASE.replace(/\/api\/v1$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export const SHARE_BASE = resolveShareBase()

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

export function buildCharacterShareUrl(slug: string) {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  return `${SHARE_BASE}/share/character/${normalizedSlug}`
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  let payload: ApiEnvelope<T> | null = null
  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed: ${response.status}`)
  }

  return payload?.data as T
}
