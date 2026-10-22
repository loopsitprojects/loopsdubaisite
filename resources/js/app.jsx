import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Auto-prefix Inertia visits when deployed in a subfolder (e.g. /loopsdubai)
router.on('before', (event) => {
    const metaAppUrl = typeof document !== 'undefined'
        ? document.querySelector('meta[name="app-url"]')?.getAttribute('content')
        : null;

    if (!metaAppUrl) return;

    try {
        const basePath = new URL(metaAppUrl).pathname.replace(/\/+$/, '');
        if (basePath && event.detail.visit.url.pathname && !event.detail.visit.url.pathname.startsWith(basePath)) {
            const cleanPath = event.detail.visit.url.pathname.startsWith('/')
                ? event.detail.visit.url.pathname
                : `/${event.detail.visit.url.pathname}`;
            event.detail.visit.url.pathname = `${basePath}${cleanPath}`;
        }
    } catch {
        // Fallback silently if URL parsing fails
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Loops Integrated';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#14f1d9',
    },
});
