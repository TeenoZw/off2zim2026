export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("off2zim_token");
}

export function getAuthHeaders(
  initHeaders?: HeadersInit,
  includeJsonContentType = false
) {
  const headers = new Headers(initHeaders);
  const token = getStoredToken();

  if (includeJsonContentType && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const headers = getAuthHeaders(init.headers, !!init.body && !isFormData);

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload as T;
}
