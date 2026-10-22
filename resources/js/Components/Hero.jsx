import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Sparkles } from 'lucide-react';

export default function Hero({ hero, onBookCall, onWatchWork }) {
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);

    const toggleSound = () => {
        if (videoRef.current) {
            const nextMuted = !videoRef.current.muted;
            videoRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
            if (!nextMuted && videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
            }
        } else {
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative min-h-screen pt-32 pb-24 md:pt-44 md:pb-36 flex items-center justify-center overflow-hidden hero-diagonal-pattern select-none">
            {/* Background Ambient Video / Reel Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30 mix-blend-screen">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
                >
                    <source
                        src={hero?.reel_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4'}
                        type="video/mp4"
                    />
                </video>
                {/* Subtle dark vignette overlay so text pops with ultra clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-transparent to-[#080808]/90" />
            </div>

            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 pointer-events-none hero-glow z-0" />

            {/* Top Right Tag matching the screenshot watermark */}
            <div className="absolute top-24 right-6 sm:right-10 md:top-28 md:right-14 z-20 pointer-events-none">
                <span className="font-mono text-[11px] sm:text-xs tracking-wider text-cyan-400/60 uppercase">
                    {hero?.reel_placeholder_text || '[HERO REEL PLACEHOLDER - 4G-008 - MUTED AUTOPLAY]'}
                </span>
            </div>

            {/* Main Hero Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="max-w-4xl lg:max-w-5xl">
                    {/* Status Pill Badge: "AI-generated · Human-directed" */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium mb-8 text-neutral-300 shadow-lg transition-all duration-300 hover:border-white/20">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]" />
                            <span>{hero?.badge_tag_1 || 'AI-generated'}</span>
                        </span>
                        <span className="text-neutral-500 font-bold">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#ff7a18] shadow-[0_0_8px_#ff7a18]" />
                            <span>{hero?.badge_tag_2 || 'Human-directed'}</span>
                        </span>
                    </div>

                    {/* Main Headline matching Image 2 */}
                    <h1 className="hero-title text-[2.65rem] sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[5.85rem] font-extrabold sm:font-black tracking-[-0.042em] leading-[0.98] mb-7">
                        <span className="block text-[#f2eee5] whitespace-normal sm:whitespace-nowrap">
                            {hero?.headline_1 || 'AI-powered video.'}
                        </span>
                        <span className="block text-[#f2eee5] whitespace-normal sm:whitespace-nowrap mt-1 sm:mt-1.5">
                            <span className="text-[#f7a838]">Human-led</span>{' '}
                            <span>creative.</span>
                        </span>
                    </h1>

                    {/* Subtitle Paragraph */}
                    <p className="text-base sm:text-lg md:text-xl text-neutral-400 font-normal leading-relaxed max-w-2xl mb-10">
                        {hero?.subtitle || 'Concept, script, direction and finishing by experienced creatives. Production accelerated by AI. Made for global brands.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                        <button
                            onClick={onWatchWork}
                            id="hero-watch-work-btn"
                            type="button"
                            className="cursor-pointer bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                        >
                            <span>{hero?.primary_cta_text || 'Watch our work'}</span>
                        </button>

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

            {/* Bottom Right: Interactive Sound Toggle Pill */}
            <div className="absolute bottom-8 right-6 sm:right-10 md:bottom-12 md:right-14 z-20">
                <button
                    onClick={toggleSound}
                    type="button"
                    className="cursor-pointer group flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-white/30 text-xs sm:text-sm text-neutral-300 hover:text-white transition-all duration-200 shadow-xl"
                    title={isMuted ? 'Turn sound on' : 'Mute sound'}
                >
                    {isMuted ? (
                        <VolumeX size={16} className="text-neutral-400 group-hover:text-white transition" />
                    ) : (
                        <div className="flex items-center gap-1">
                            <Volume2 size={16} className="text-[#14f1d9]" />
                            <span className="flex gap-0.5 items-end h-3">
                                <span className="w-0.5 h-1.5 bg-[#14f1d9] animate-pulse" />
                                <span className="w-0.5 h-3 bg-[#14f1d9] animate-pulse delay-75" />
                                <span className="w-0.5 h-2 bg-[#14f1d9] animate-pulse delay-150" />
                            </span>
                        </div>
                    )}
                    <span className="font-medium tracking-wide">
                        {isMuted ? 'Tap for sound' : 'Sound active'}
                    </span>
                </button>
            </div>
        </section>
    );
}
