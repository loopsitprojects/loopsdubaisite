import React from 'react';
import { Link } from '@inertiajs/react';
import { Play, ArrowRight } from 'lucide-react';
import { getFilmThumbnail, isDirectVideo } from '../utils/video';

export default function FeaturedFilms({ portfolio, onFilmClick, onEnterCreativeWorld }) {
    // Default fallback films matching the exact screenshot layout
    const films = portfolio && portfolio.length > 0 ? portfolio : [
        {
            id: 1,
            title: '[Brand name]',
            film_subtitle: '[Film title] · Created for [Brand]',
            category: 'Auto',
            duration: '[0:45]',
            thumbnail_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-road-in-the-city-at-night-42861-large.mp4',
        },
        {
            id: 2,
            title: '[Brand name]',
            film_subtitle: '[Film title] · Created for [Brand]',
            category: 'Consumer',
            duration: '[0:20]',
            thumbnail_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
        },
        {
            id: 3,
            title: '[Brand name]',
            film_subtitle: '[Film title] · Created for [Brand]',
            category: 'Tech',
            duration: '[1:00]',
            thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-41135-large.mp4',
        },
        {
            id: 4,
            title: '[Brand name]',
            film_subtitle: '[Film title] · Created for [Brand]',
            category: 'Real estate',
            duration: '[0:15]',
            thumbnail_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4',
        },
    ];

    return (
        <section id="work" className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                    <div>
                        {/* Category Label: FEATURED FILMS in Cyan */}
                        <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-3">
                            FEATURED FILMS
                        </span>

                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold sm:font-black tracking-tight text-white leading-[1.08] max-w-xl">
                            Our best work, for brands you know.
                        </h2>
                    </div>

                    {/* Right CTA Button: "Enter our AI creative world →" */}
                    <div className="shrink-0">
                        <Link
                            href="/work"
                            className="cursor-pointer inline-flex items-center gap-2 bg-[#14f1d9] hover:bg-[#12dac4] text-black font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-[0_0_24px_rgba(20,241,217,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>Enter our AI creative world</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* 2x2 Grid of Film Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {films.slice(0, 4).map((film, index) => {
                        const thumb = getFilmThumbnail(film);
                        const isDirect = isDirectVideo(film.video_url);

                        return (
                            <div
                                key={film.id || index}
                                onClick={() => onFilmClick(film)}
                                className="group cursor-pointer flex flex-col space-y-3.5"
                            >
                                {/* Video Screen Container */}
                                <div className="relative aspect-video w-full rounded-2xl bg-[#111215] border border-white/10 overflow-hidden group-hover:border-white/25 transition-all duration-300 shadow-xl flex items-center justify-center">
                                    {/* Ambient Background Video / Poster */}
                                    <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                                        {thumb && (
                                            <img
                                                src={thumb}
                                                alt={film.title || 'Film thumbnail'}
                                                loading="lazy"
                                                onError={(e) => {
                                                    if (e.currentTarget.src && e.currentTarget.src.includes('maxresdefault.jpg')) {
                                                        e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500"
                                            />
                                        )}
                                        {isDirect && (
                                            <video
                                                muted
                                                loop
                                                playsInline
                                                poster={thumb || undefined}
                                                onMouseEnter={(e) => e.target.play().catch(() => {})}
                                                onMouseLeave={(e) => e.target.pause()}
                                                className={`w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500 ${
                                                    thumb ? 'relative z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''
                                                }`}
                                                src={film.video_url}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />
                                    </div>

                                {/* Top Right Duration Tag */}
                                <div className="absolute top-3.5 right-4 z-10 pointer-events-none">
                                    <span className="font-mono text-xs sm:text-sm text-neutral-400 group-hover:text-white transition">
                                        {film.duration || '[0:30]'}
                                    </span>
                                </div>

                                {/* Center Play Button */}
                                <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white group-hover:bg-[#14f1d9] group-hover:text-black transition-all duration-300 shadow-2xl">
                                    <Play size={20} className="ml-1 fill-current" />
                                </div>
                            </div>

                            {/* Card Metadata (Below Video Container) */}
                            <div className="flex items-center justify-between gap-4 pt-1">
                                <div className="space-y-0.5 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#14f1d9] transition-colors truncate">
                                        {film.title || '[Brand name]'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-400 truncate">
                                        {film.film_subtitle || '[Film title] · Created for [Brand]'}
                                    </p>
                                </div>

                                {/* Right Category Tag Pill */}
                                {film.category && film.category.toLowerCase() !== 'none' && (
                                    <div className="shrink-0">
                                        <span className="inline-block px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] text-xs font-medium text-neutral-300 group-hover:border-white/30 transition">
                                            {film.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </section>
    );
}
