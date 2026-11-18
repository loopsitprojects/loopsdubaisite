/**
 * LoopsMap — interactive animated world map.
 * Shows Loops Integrated office locations with pulsing markers and
 * arc connections. Supports activeIndex highlight + click callback.
 */
import React, { useEffect, useRef, useMemo, useState } from 'react';
import worldData from '../data/world.json';

const DEFAULT_COLORS = [
    '#14f1d9', // Brand Cyan
    '#f7a838', // Brand Orange
    '#a78bfa', // Electric Purple
    '#38bdf8', // Vibrant Sky Blue
    '#34d399', // Emerald
    '#f43f5e', // Rose
    '#fbbf24', // Amber
];

function getLabelDir(city = '') {
    const c = city.toLowerCase();
    if (c.includes('london')) return 'top-left';
    if (c.includes('adliswil') || c.includes('switzerland')) return 'bottom-left';
    if (c.includes('dubai')) return 'top-right';
    if (c.includes('qatar') || c.includes('doha')) return 'bottom-left';
    if (c.includes('colombo')) return 'bottom-left';
    if (c.includes('singapore')) return 'bottom-right';
    if (c.includes('sydney') || c.includes('nsw') || c.includes('australia')) return 'top-left';
    if (c.includes('suva') || c.includes('fiji')) return 'top-left';
    return 'top-right';
}

// Dynamic bounding box mapping covering full 360° world presence
function getMapBounds(W) {
    if (W < 640) {
        return {
            lngMin: -165,
            lngMax: 198,
            latMin: -54,
            latMax: 74,
        };
    }
    return {
        lngMin: -168,
        lngMax: 198,
        latMin: -54,
        latMax: 74,
    };
}

// Full-bleed edge-to-edge projection function
function project(lat, lng, W, H) {
    const bounds = getMapBounds(W);
    const lngRange = bounds.lngMax - bounds.lngMin;
    const latRange = bounds.latMax - bounds.latMin;

    return {
        x: ((lng - bounds.lngMin) / lngRange) * W,
        y: ((bounds.latMax - lat) / latRange) * H,
    };
}

function bezier(ax, ay, bx, by, t) {
    const lift = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2) * 0.28;
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2 - lift;
    return [
        (1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t ** 2 * bx,
        (1 - t) ** 2 * ay + 2 * (1 - t) * t * my + t ** 2 * by,
    ];
}

function rgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
}

function getCustomTransform(city = '', labelDir) {
    const c = city.toLowerCase();
    if (c.includes('qatar') || c.includes('doha')) {
        return 'translate(-108%, 14px)';
    }
    if (c.includes('dubai')) {
        return 'translate(10px, calc(-100% - 10px))';
    }
    if (c.includes('adliswil') || c.includes('switzerland')) {
        return 'translate(-100%, 14px)';
    }
    if (c.includes('london')) {
        return 'translate(-100%, calc(-100% - 10px))';
    }
    if (c.includes('colombo')) {
        return 'translate(-100%, 14px)';
    }
    if (c.includes('singapore')) {
        return 'translate(10px, 10px)';
    }
    if (c.includes('sydney') || c.includes('nsw') || c.includes('australia')) {
        return 'translate(-100%, 12px)';
    }
    if (c.includes('suva') || c.includes('fiji')) {
        return 'translate(-85%, 14px)';
    }

    return labelDir === 'top-left'   ? 'translate(-100%, calc(-100% - 6px))' :
           labelDir === 'top-right'  ? 'translate(6px, calc(-100% - 6px))' :
           labelDir === 'bottom-left' ? 'translate(-100%, 6px)' :
           labelDir === 'bottom-right'? 'translate(6px, 6px)' :
           labelDir === 'bottom'     ? 'translate(-50%, 6px)' :
                                       'translate(-50%, calc(-100% - 6px))';
}

export default function LoopsMap({
    height = 460,
    className = '',
    activeIndex = 0,
    onOfficeClick,
    offices = [],
}) {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const activeRef = useRef(activeIndex);

    const [dims, setDims] = useState({ w: 800, h: 400 });

    useEffect(() => {
        activeRef.current = activeIndex;
    }, [activeIndex]);

    const mappedOffices = useMemo(() => {
        const list = offices && offices.length ? offices : [
            { city: 'Colombo', country: 'Sri Lanka', role: 'Headquarters', lat: 6.9147, lng: 79.8484, is_headquarters: true },
            { city: 'Dubai', country: 'UAE', role: 'Middle East & Africa', lat: 25.1972, lng: 55.2744, is_headquarters: false },
            { city: 'London', country: 'UK', role: 'Europe', lat: 51.5144, lng: -0.0803, is_headquarters: false },
            { city: 'Singapore', country: 'Singapore', role: 'Southeast Asia', lat: 1.2838, lng: 103.8516, is_headquarters: false },
        ];
        return list.map((o, idx) => ({
            name: o.city || o.country || o.role || `Office ${idx + 1}`,
            role: o.role || o.country || '',
            lat: o.lat ?? 0,
            lng: o.lng ?? 0,
            color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
            labelDir: getLabelDir(o.city || o.country || ''),
            is_headquarters: !!o.is_headquarters,
        }));
    }, [offices]);

    const arcs = useMemo(() => {
        const hqIdx = mappedOffices.findIndex((o) => o.is_headquarters);
        const hqIndex = hqIdx !== -1 ? hqIdx : 0;
        const list = [];
        mappedOffices.forEach((o, i) => {
            if (i !== hqIndex) {
                list.push([hqIndex, i]);
            }
        });
        return list;
    }, [mappedOffices]);

    const labels = useMemo(() => {
        const W = dims.w;
        const H = dims.h;

        return mappedOffices.map((o) => {
            const { x, y } = project(o.lat, o.lng, W, H);
            const xp = Math.max(4, Math.min(95, (x / W) * 100));
            const yp = Math.max(8, Math.min(88, (y / H) * 100));
            return {
                ...o,
                xp,
                yp,
            };
        });
    }, [mappedOffices, dims]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId;
        let t = 0;
        let staticCanvas = null;

        const setup = () => {
            const W = wrap.clientWidth;
            const H = wrap.clientHeight;
            if (W <= 0 || H <= 0) return;

            canvas.width = W;
            canvas.height = H;
            setDims({ w: W, h: H });

            staticCanvas = document.createElement('canvas');
            staticCanvas.width = W;
            staticCanvas.height = H;
            const staticCtx = staticCanvas.getContext('2d');
            if (staticCtx) {
                staticCtx.fillStyle = 'rgba(255,255,255,0.005)';
                staticCtx.fillRect(0, 0, W, H);

                // Dot grid
                staticCtx.fillStyle = 'rgba(255,255,255,0.035)';
                for (let gx = 0; gx <= W; gx += 22) {
                    for (let gy = 0; gy <= H; gy += 22) {
                        staticCtx.beginPath();
                        staticCtx.arc(gx, gy, 0.65, 0, Math.PI * 2);
                        staticCtx.fill();
                    }
                }

                // GeoJSON world boundaries
                staticCtx.fillStyle = 'rgba(255,255,255,0.07)';
                staticCtx.strokeStyle = 'rgba(255,255,255,0.2)';
                staticCtx.lineWidth = 0.5;

                const drawRing = (ring) => {
                    if (ring.length < 3) return;
                    const first = project(ring[0][1], ring[0][0], W, H);
                    staticCtx.moveTo(first.x, first.y);
                    for (let i = 1; i < ring.length; i++) {
                        const p = project(ring[i][1], ring[i][0], W, H);
                        staticCtx.lineTo(p.x, p.y);
                    }
                };

                if (worldData && Array.isArray(worldData.features)) {
                    worldData.features.forEach((feature) => {
                        const geom = feature.geometry;
                        if (!geom) return;
                        staticCtx.beginPath();
                        if (geom.type === 'Polygon') {
                            geom.coordinates.forEach((ring) => {
                                drawRing(ring);
                            });
                        } else if (geom.type === 'MultiPolygon') {
                            geom.coordinates.forEach((polygon) => {
                                polygon.forEach((ring) => {
                                    drawRing(ring);
                                });
                            });
                        }
                        staticCtx.fill();
                        staticCtx.stroke();
                    });
                }
            }
        };

        setup();
        const ro = new ResizeObserver(setup);
        ro.observe(wrap);

        const handleClick = (e) => {
            if (!onOfficeClick) return;
            const rect = canvas.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
            const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
            const W = canvas.width;
            const H = canvas.height;
            let nearest = -1;
            let minDist = 32;
            mappedOffices.forEach((o, i) => {
                const { x, y } = project(o.lat, o.lng, W, H);
                const d = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
                if (d < minDist) {
                    minDist = d;
                    nearest = i;
                }
            });
            if (nearest >= 0) onOfficeClick(nearest);
        };
        canvas.addEventListener('click', handleClick);
        canvas.style.cursor = onOfficeClick ? 'pointer' : 'default';

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            if (W <= 0 || H <= 0) return;

            const act = activeRef.current;
            ctx.clearRect(0, 0, W, H);

            if (staticCanvas && staticCanvas.width > 0 && staticCanvas.height > 0) {
                ctx.drawImage(staticCanvas, 0, 0);
            }

            const pts = mappedOffices.map((o) => project(o.lat, o.lng, W, H));

            // Arc connections
            arcs.forEach(([ai, bi], idx) => {
                const a = pts[ai];
                const b = pts[bi];
                if (!a || !b) return;
                const isActive = act === ai || act === bi;
                const col = mappedOffices[bi]?.color || mappedOffices[ai]?.color || '#14f1d9';

                // Subtle glow arc
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                for (let s = 1; s <= 80; s++) {
                    const [bx, by] = bezier(a.x, a.y, b.x, b.y, s / 80);
                    ctx.lineTo(bx, by);
                }
                ctx.strokeStyle = rgba(col, isActive ? 0.35 : 0.12);
                ctx.lineWidth = isActive ? 2.5 : 1.5;
                ctx.stroke();

                // Dashed line
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                for (let s = 1; s <= 80; s++) {
                    const [bx, by] = bezier(a.x, a.y, b.x, b.y, s / 80);
                    ctx.lineTo(bx, by);
                }
                ctx.strokeStyle = rgba(col, isActive ? 0.6 : 0.28);
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 6]);
                ctx.stroke();
                ctx.restore();

                // Light pulse particle travelling along the arc
                [0, 0.5].forEach((offset) => {
                    const prog = (t * 0.14 + idx * 0.28 + offset) % 1;
                    const [px, py] = bezier(a.x, a.y, b.x, b.y, prog);
                    const radius = isActive ? 10 : 7;
                    const alpha = isActive ? 0.95 : 0.65;
                    const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
                    g.addColorStop(0, rgba(col, alpha));
                    g.addColorStop(0.4, rgba(col, alpha * 0.4));
                    g.addColorStop(1, rgba(col, 0));
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(px, py, radius, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            // Office markers
            mappedOffices.forEach((o, i) => {
                const pt = pts[i];
                if (!pt) return;
                const { x, y } = pt;
                const isActive = act === i;
                const phase = t * 1.6 + i * 1.3;

                // Pulse ring 1
                const p1 = (phase % (Math.PI * 2)) / (Math.PI * 2);
                ctx.strokeStyle = rgba(o.color, (1 - p1) * (isActive ? 0.85 : 0.5));
                ctx.lineWidth = isActive ? 2 : 1.5;
                ctx.beginPath();
                ctx.arc(x, y, (isActive ? 14 : 10) + p1 * (isActive ? 34 : 24), 0, Math.PI * 2);
                ctx.stroke();

                // Pulse ring 2
                const p2 = ((phase + Math.PI) % (Math.PI * 2)) / (Math.PI * 2);
                ctx.strokeStyle = rgba(o.color, (1 - p2) * (isActive ? 0.5 : 0.3));
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, (isActive ? 8 : 6) + p2 * (isActive ? 20 : 14), 0, Math.PI * 2);
                ctx.stroke();

                // Glow halo
                const hR = isActive ? 26 : 16;
                const halo = ctx.createRadialGradient(x, y, 0, x, y, hR);
                halo.addColorStop(0, rgba(o.color, isActive ? 0.6 : 0.35));
                halo.addColorStop(0.5, rgba(o.color, isActive ? 0.2 : 0.1));
                halo.addColorStop(1, rgba(o.color, 0));
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(x, y, hR, 0, Math.PI * 2);
                ctx.fill();

                // Static circle
                if (isActive) {
                    ctx.strokeStyle = rgba(o.color, 0.8);
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Centre dot
                ctx.fillStyle = o.color;
                ctx.beginPath();
                ctx.arc(x, y, isActive ? 5 : 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, isActive ? 2.2 : 1.6, 0, Math.PI * 2);
                ctx.fill();
            });

            t += 0.016;
        };

        const loop = () => {
            rafId = requestAnimationFrame(loop);
            draw();
        };
        loop();

        return () => {
            cancelAnimationFrame(rafId);
            canvas.removeEventListener('click', handleClick);
            ro.disconnect();
        };
    }, [mappedOffices, arcs, onOfficeClick]);

    return (
        <div ref={wrapRef} className={`relative select-none ${className}`} style={{ height }}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {labels.map((o) => {
                const transform = getCustomTransform(o.name, o.labelDir);

                return (
                    <div
                        key={o.name}
                        className="absolute pointer-events-none select-none z-20"
                        style={{ left: `${o.xp}%`, top: `${o.yp}%`, transform }}
                    >
                        <div
                            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#090a0d]/90 backdrop-blur-md border shadow-2xl text-left"
                            style={{
                                borderColor: `${o.color}77`,
                                boxShadow: `0 4px 16px rgba(0,0,0,0.8), 0 0 12px ${o.color}25`,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <p
                                className="text-white font-bold leading-none mb-1 tracking-tight text-[0.62rem] sm:text-[0.74rem]"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {o.name}
                            </p>
                            {Boolean(o.role?.trim()) && (
                                <p
                                    className="font-mono text-[0.46rem] sm:text-[0.56rem] font-semibold uppercase tracking-wider leading-none"
                                    style={{ color: '#E2E8F0' }}
                                >
                                    <span style={{ color: o.color, marginRight: 4 }}>●</span>
                                    {o.role}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
