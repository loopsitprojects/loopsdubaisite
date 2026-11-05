import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { appUrl } from '../utils/url';
import { parseVideoUrl } from '../utils/video';
import { LILY_LANKA_STORYBOARD } from '../data/storyboard';

/**
 * Continuous Automatic Storyboard Slider for the Human Concept section.
 */
function StoryboardSlider({ frames = LILY_LANKA_STORYBOARD }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = frames.length;

    // Continuously auto-advance every 2.8 seconds
    useEffect(() => {
        if (total <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 2800);
        return () => clearInterval(timer);
    }, [total]);

    const prevSlide = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const nextSlide = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    const goToSlide = (idx, e) => {
        e?.stopPropagation();
        setCurrentIndex(idx);
    };

    const current = frames[currentIndex] || frames[0];

    return (
        <div className="group/slider relative w-full aspect-video rounded-2xl border border-white/10 bg-[#101217] shadow-xl overflow-hidden select-none">
            {/* Storyboard Frames with smooth crossfade */}
            {frames.map((frame, idx) => (
                <div
                    key={frame.shot || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentIndex
                            ? 'opacity-100 z-10 pointer-events-auto'
                            : 'opacity-0 z-0 pointer-events-none'
                    }`}
                >
                    <img
                        src={appUrl(frame.url)}
                        alt={frame.title || `Storyboard Frame ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}

            {/* Subtle top & bottom edge gradients for badge and dots visibility */}
            <div className="absolute inset-x-0 top-0 h-16 z-20 pointer-events-none bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-12 z-20 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />

            {/* Top Bar: Storyboard badge and live shot counter */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold text-[#f7a838]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f7a838] animate-pulse" />
                    <span>STORYBOARD</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300 tracking-wider">
                    Shot {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
            </div>

            {/* Navigation Arrows */}
            <button
                type="button"
                onClick={prevSlide}
                className="cursor-pointer absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition opacity-75 group-hover/slider:opacity-100 hover:scale-105 active:scale-95"
                aria-label="Previous shot"
            >
                <ChevronLeft size={18} />
            </button>

            <button
                type="button"
                onClick={nextSlide}
                className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition opacity-75 group-hover/slider:opacity-100 hover:scale-105 active:scale-95"
                aria-label="Next shot"
            >
                <ChevronRight size={18} />
            </button>

            {/* Scrubber Dots (Centered at bottom) */}
            <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1 sm:gap-1.5 pointer-events-auto px-4">
                {frames.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={(e) => goToSlide(idx, e)}
                        className={`cursor-pointer transition-all duration-300 rounded-full ${
                            idx === currentIndex
                                ? 'w-5 sm:w-6 h-1.5 bg-[#f7a838] shadow-[0_0_8px_#f7a838]'
                                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to shot ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * General Media Renderer for Video or Image.
 */
function MediaCard({ url, label, placeholder, isStoryboard = false }) {
    if (isStoryboard || !url || url.includes('storyboard') || url.includes('lily-lanka')) {
        return <StoryboardSlider />;
    }

    const parsed = parseVideoUrl(url);

    if (parsed.type === 'youtube') {
        return (
            <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden group-hover:border-white/25 transition-all duration-300">
                <iframe
                    src={`https://www.youtube.com/embed/${parsed.id}?rel=0`}
                    title={label}
                    className="w-full h-full border-0 rounded-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        );
    }

    if (parsed.type === 'vimeo') {
        return (
            <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden group-hover:border-white/25 transition-all duration-300">
                <iframe
                    src={`https://player.vimeo.com/video/${parsed.id}`}
                    title={label}
                    className="w-full h-full border-0 rounded-2xl"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        );
    }

    const clean = url.split('?')[0].toLowerCase();
    const isDirectVideo = ['.mp4', '.webm', '.ogg', '.mov'].some((ext) => clean.endsWith(ext));
    if (isDirectVideo) {
        return (
            <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden group-hover:border-white/25 transition-all duration-300">
                <video
                    src={appUrl(url)}
                    controls
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-white/[0.02] shadow-xl overflow-hidden group-hover:border-white/25 transition-all duration-300">
            <img
                src={appUrl(url)}
                alt={label}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />
        </div>
    );
}

export default function BehindTheFilm({ setting }) {
    const tag = setting?.tag || 'BEHIND THE FILM';
    const titleLine1 = setting?.title_line_1 || 'From human sketch to finished';
    const titleLine2 = setting?.title_line_2 !== undefined ? setting?.title_line_2 : 'film.';
    const conceptLabel = setting?.concept_label || 'Human concept';
    const conceptPlaceholder = setting?.concept_placeholder_text || '[Storyboard / reference frames]';
    const conceptImage = setting?.concept_image_url;
    const finishLabel = setting?.finish_label || 'AI production, human finish';
    const finishPlaceholder = setting?.finish_placeholder_text || '[Final film frame]';
    const finishImage = setting?.finish_image_url;

    // Check if concept uses the storyboard slider (default when set to storyboard or empty)
    const isConceptStoryboard =
        !conceptImage ||
        conceptImage === '/images/storyboard/lily-lanka' ||
        conceptImage.includes('storyboard') ||
        conceptImage.includes('lily-lanka');

    return (
        <section className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header & Title */}
                <div className="max-w-3xl mb-12 sm:mb-16">
                    {/* Cyan Category Tag: BEHIND THE FILM */}
                    <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                        {tag}
                    </span>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold sm:font-black tracking-tight text-white leading-[1.08]">
                        <span className="block">{titleLine1}</span>
                        {titleLine2 && <span className="block">{titleLine2}</span>}
                    </h2>
                </div>

                {/* Dual Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left Card: Human Concept (Storyboard Slider) */}
                    <div className="flex flex-col group">
                        {isConceptStoryboard ? (
                            <StoryboardSlider />
                        ) : (
                            <MediaCard
                                url={conceptImage}
                                label={conceptLabel}
                                placeholder={conceptPlaceholder}
                            />
                        )}
                        {/* Label: Human concept in Orange */}
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-semibold text-[#f7a838] tracking-tight">
                                {conceptLabel}
                            </span>
                            {isConceptStoryboard && (
                                <span className="text-[11px] text-neutral-500 font-mono">
                                    17 storyboard frames
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Card: AI Production, Human Finish (Finished Film) */}
                    <div className="flex flex-col group">
                        <MediaCard
                            url={finishImage}
                            label={finishLabel}
                            placeholder={finishPlaceholder}
                        />
                        {/* Label: AI production, human finish in Cyan */}
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-semibold text-[#14f1d9] tracking-tight">
                                {finishLabel}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                                Finished commercial
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
