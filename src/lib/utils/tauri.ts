declare global {
  interface Window {
    __TAURI__?: any;
  }
}

const isTauri = typeof window !== 'undefined' && !!window.__TAURI__;

export async function getAssetUrl(path: string): Promise<string> {
  if (isTauri) {
    const { resolveResource } = await import('@tauri-apps/api/path');
    const resourcePath = await resolveResource(`sounds/${path}`);
    return resourcePath;
  }
  return `/sounds/${path}`;
} 