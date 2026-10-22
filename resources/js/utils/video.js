import { appUrl } from './url';

/**
 * Utility functions for video parsing and thumbnail extraction.
 */

export function parseVideoUrl(url) {
    if (!url || typeof url !== 'string') {
        return { type: 'unknown', embedUrl: '', id: null, thumbnailUrl: null, fallbackThumbnailUrl: null };
    }

    const trimmed = url.trim();

    // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
        const id = ytMatch[1];
        return {
            type: 'youtube',
            id,
            embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
            thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
            fallbackThumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
    }

    // Vimeo: vimeo.com/ID
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
        const id = vimeoMatch[3];
        return {
            type: 'vimeo',
            id,
            embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
            thumbnailUrl: null,
            fallbackThumbnailUrl: null,
        };
    }

    return {
        type: 'direct',
        embedUrl: trimmed,
        id: null,
        thumbnailUrl: null,
        fallbackThumbnailUrl: null,
    };
}

export function isDirectVideo(url) {
    if (!url) return false;
    const parsed = parseVideoUrl(url);
    return parsed.type === 'direct';
}

export function getFilmThumbnail(film) {
    if (!film) return null;

    // 1. If user uploaded a custom thumbnail file or provided a custom local/data image
    if (film.thumbnail_url && typeof film.thumbnail_url === 'string') {
        const trimmed = film.thumbnail_url.trim();
        if (trimmed.startsWith('/uploads/') || trimmed.startsWith('/storage/')) {
            return appUrl(trimmed);
        }
        if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
            return trimmed;
        }
        // If it's a custom URL and not the stock Unsplash placeholder, return it
        if (!trimmed.includes('unsplash.com') && trimmed !== '') {
            return appUrl(trimmed);
        }
    }

    // 2. Automatically derive thumbnail from video URL (e.g. YouTube maxresdefault)
    if (film.video_url) {
        const parsed = parseVideoUrl(film.video_url);
        if (parsed.type === 'youtube' && parsed.thumbnailUrl) {
            return parsed.thumbnailUrl;
        }
    }

    // 3. Fallback to existing thumbnail_url (even if placeholder) or null
    return film.thumbnail_url ? appUrl(film.thumbnail_url) : null;
}
