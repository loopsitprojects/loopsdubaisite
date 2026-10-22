/**
 * Safely resolves a URL path against the application base path.
 * When the app is deployed in a subdirectory (e.g. /loopsdubai),
 * this prefixes the path so navigation and asset references stay within the subfolder.
 */
export function appUrl(path = '') {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;

    const metaAppUrl = typeof document !== 'undefined'
        ? (document.querySelector('meta[name="app-url"]')?.getAttribute('content') || '')
        : '';

    let basePath = '';
    if (metaAppUrl) {
        try {
            basePath = new URL(metaAppUrl).pathname.replace(/\/+$/, '');
        } catch {
            basePath = '';
        }
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (basePath && cleanPath.startsWith(basePath)) {
        return cleanPath;
    }

    return basePath ? `${basePath}${cleanPath}` : path;
}
