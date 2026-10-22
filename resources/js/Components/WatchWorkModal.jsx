import React, { useRef, useEffect } from 'react';
import { X, Play, Film, Sparkles } from 'lucide-react';
import { parseVideoUrl } from '../utils/video';
import { appUrl } from '../utils/url';

export default function WatchWorkModal({ isOpen, onClose, onBookCall, videoUrl }) {
    const videoRef = useRef(null);
    const parsed = parseVideoUrl(videoUrl);

    useEffect(() => {
        if (isOpen && parsed.type === 'direct' && videoRef.current) {
            videoRef.current.play().catch(() => {});
        } else if (!isOpen && parsed.type === 'direct' && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isOpen, videoUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-[#0d0e12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090a0d]">
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Film size={16} className="text-[#14f1d9]" />
                        <span className="font-semibold text-white">Loops Creative Showcase Reel</span>
                        <span className="text-neutral-500 font-mono text-xs">[2026 Director's Cut]</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
                        aria-label="Close video reel"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {parsed.type === 'youtube' ? (
                        <iframe
                            className="w-full h-full border-0"
                            src={parsed.embedUrl}
                            title="Loops Film Reel"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    ) : parsed.type === 'vimeo' ? (
                        <iframe
                            className="w-full h-full border-0"
                            src={parsed.embedUrl}
                            title="Loops Film Reel"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            src={videoUrl ? appUrl(videoUrl) : 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4'}
                        />
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-4 bg-[#090a0d] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-400 text-center sm:text-left">
                        Crafted with custom generative AI pipelines and directed by experienced commercial filmmakers.
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                onBookCall();
                            }}
                            className="bg-white text-black font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-200 transition shadow"
                        >
                            Book a creative call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
