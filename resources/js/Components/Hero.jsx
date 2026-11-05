import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Play, Sparkles } from 'lucide-react';
import { appUrl } from '../utils/url';

export default function Hero({ hero, onBookCall }) {
    const videoRef = useRef(null);

    return (
        <section className="relative min-h-screen pt-32 pb-12 md:pb-16 flex items-end justify-center overflow-hidden hero-diagonal-pattern select-none">
            {/* Background Ambient Video / Reel Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src={hero?.reel_video_url ? appUrl(hero.reel_video_url) : 'https://ai.loopsintegrated.co/loopsvideos/Showreel/Dubaisw.mp4'}
                        type="video/mp4"
                    />
                </video>
                {/* Dark fade along the bottom for the text, and a soft one under the nav */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 via-60% to-transparent to-90% md:via-[#080808]/75 md:via-40% md:to-75%" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080808]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/50 to-transparent to-60%" />
            </div>

            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 pointer-events-none hero-glow z-0" />

            {/* Main Hero Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="max-w-4xl lg:max-w-5xl">
                    {/* Main Headline matching Image 2 */}
                    <h1 className="hero-title text-[2.65rem] sm:text-5xl md:text-6xl xl:text-[4.25rem] font-extrabold sm:font-black tracking-[-0.042em] leading-[0.98] mb-5">
                        <span className="block text-[#f2eee5] whitespace-normal sm:whitespace-nowrap">
                            {hero?.headline_1 || 'AI-powered video.'}
                        </span>
                        <span className="block text-[#f2eee5] whitespace-normal sm:whitespace-nowrap mt-1 sm:mt-1.5">
                            <span className="text-[#f7a838]">Human-led</span>{' '}
                            <span>creative.</span>
                        </span>
                    </h1>

                    {/* Subtitle Paragraph */}
                    <p className="text-base md:text-lg text-neutral-200 font-normal leading-relaxed max-w-2xl mb-7">
                        {hero?.subtitle || 'Concept, script, direction and finishing by experienced creatives. Production accelerated by AI. Made for global brands.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                        <Link
                            href={appUrl('/work')}
                            id="hero-watch-work-btn"
                            className="cursor-pointer bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                        >
                            <span>{hero?.primary_cta_text || 'Watch our work'}</span>
                        </Link>

                        <button
                            onClick={onBookCall}
                            id="hero-book-call-btn"
                            type="button"
                            className="cursor-pointer bg-black/40 hover:bg-white/10 text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full border border-white/30 hover:border-white/60 transition-all duration-200 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {hero?.secondary_cta_text || 'Book a creative call'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
