import { NativeModules, Platform } from 'react-native';
import Constants from 'expo-constants';
import { getAuthToken } from './firebaseClient';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const API_PORT = 4000;
const LOCALHOST_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function getDevServerBaseUrl(): string | null {
  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;

    if (scriptURL) {
      const url = new URL(scriptURL);
      const host = Platform.OS === 'android' && url.hostname === 'localhost' ? '10.0.2.2' : url.hostname;
      return `http://${host}:${API_PORT}`;
    }

    const hostUri =
      (Constants.expoConfig as any)?.hostUri ||
      (Constants.manifest as any)?.debuggerHost ||
      (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost;

    if (typeof hostUri === 'string' && hostUri.length > 0) {
      const host = hostUri.split(':')[0];
      if (host) {
        return `http://${host}:${API_PORT}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getPlatformFallbackBaseUrl(): string {
  return Platform.OS === 'android' ? `http://10.0.2.2:${API_PORT}` : `http://localhost:${API_PORT}`;
}

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function resolveApiBaseUrl(): string {
  const devServerBaseUrl = getDevServerBaseUrl();
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (!configured) {
    return stripTrailingSlash(devServerBaseUrl || getPlatformFallbackBaseUrl());
  }

  if (Platform.OS === 'web') {
    return stripTrailingSlash(configured);
  }

  try {
    const configuredUrl = new URL(configured);

    if (LOCALHOST_HOSTS.has(configuredUrl.hostname)) {
      if (devServerBaseUrl) {
        const devUrl = new URL(devServerBaseUrl);
        configuredUrl.hostname = devUrl.hostname;
        configuredUrl.port = configuredUrl.port || String(API_PORT);
        return stripTrailingSlash(configuredUrl.toString());
      }

      if (Platform.OS === 'android') {
        configuredUrl.hostname = '10.0.2.2';
        configuredUrl.port = configuredUrl.port || String(API_PORT);
      }
    }

    return stripTrailingSlash(configuredUrl.toString());
  } catch {
    return stripTrailingSlash(configured);
  }
}

export const API_BASE_URL = resolveApiBaseUrl();

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const token = await getAuthToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      `Network request failed. API base URL: ${API_BASE_URL}. If testing on a phone, set EXPO_PUBLIC_API_BASE_URL to your laptop IP (example: http://192.168.1.10:4000).`
    );
  }

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, 'GET');
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'POST', body);
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'PATCH', body);
}

export function apiDelete(path: string): Promise<void> {
  return request<void>(path, 'DELETE');
}
