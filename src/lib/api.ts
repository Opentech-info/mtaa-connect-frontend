import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/auth";

const API_BASE_URL =
  (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "http://127.0.0.1:8000";

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type RefreshResponse = {
  access: string;
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const parseJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    return null as T;
  }
  return JSON.parse(text) as T;
};

const formatValidationErrors = (data: Record<string, unknown>) => {
  const entries = Object.entries(data);
  if (!entries.length) {
    return "Request failed.";
  }

  return entries
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ");
      if (Array.isArray(value)) {
        return `${label}: ${value.join(" ")}`;
      }
      if (typeof value === "string") {
        return `${label}: ${value}`;
      }
      return `${label}: Invalid value.`;
    })
    .join(" ");
};

const parseErrorMessage = (text: string) => {
  if (!text) {
    return "Request failed.";
  }
  if (text.trim().startsWith("<")) {
    return "Server error. Please try again.";
  }
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (typeof data === "string") {
      return data;
    }
    if (data.detail && typeof data.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data.non_field_errors)) {
      return data.non_field_errors.join(" ");
    }
    return formatValidationErrors(data);
  } catch {
    return text;
  }
};

const buildHeaders = (headers?: HeadersInit, accessToken?: string) => {
  const authToken = accessToken ?? getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };
};

const request = async (path: string, options: ApiOptions, accessToken?: string) => {
  const { body, headers, ...rest } = options;
  return fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    ...rest,
    headers: buildHeaders(headers, accessToken),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
      .then(async (response) => {
        if (!response.ok) {
          clearTokens();
          return null;
        }
        const data = await parseJson<RefreshResponse>(response);
        if (!data?.access) {
          clearTokens();
          return null;
        }
        setTokens({ access: data.access, refresh });
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  let response = await request(path, options);

  if (response.status === 401) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      response = await request(path, options, newAccess);
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(parseErrorMessage(errorText) || `Request failed with status ${response.status}`);
  }

  return parseJson<T>(response);
};

export const getHealth = () => apiFetch<{ status: string }>("/api/health/");

export const downloadRequestPdf = async (requestId: number) => {
  const response = await request(`/api/requests/${requestId}/download/`, { method: "GET" });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(parseErrorMessage(errorText));
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mtaa-letter-${requestId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
