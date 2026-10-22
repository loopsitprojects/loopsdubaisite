import React from 'react';
import { appUrl } from '../utils/url';

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
                    {/* Left Card: Human Concept */}
                    <div className="flex flex-col group">
                        <div className="relative w-full aspect-[16/10] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] group-hover:bg-white/[0.04] group-hover:border-white/30 flex items-center justify-center transition-all duration-300 overflow-hidden">
                            {conceptImage ? (
                                <img
                                    src={appUrl(conceptImage)}
                                    alt={conceptLabel}
                                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="p-6 text-xs sm:text-sm font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors text-center">
                                    {conceptPlaceholder}
                                </span>
                            )}
                        </div>
                        {/* Label: Human concept in Orange */}
                        <div className="mt-4">
                            <span className="text-xs sm:text-sm font-semibold text-[#f7a838] tracking-tight">
                                {conceptLabel}
                            </span>
                        </div>
                    </div>

                    {/* Right Card: AI Production, Human Finish */}
                    <div className="flex flex-col group">
                        <div className="relative w-full aspect-[16/10] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] group-hover:bg-white/[0.04] group-hover:border-white/30 flex items-center justify-center transition-all duration-300 overflow-hidden">
                            {finishImage ? (
                                <img
                                    src={appUrl(finishImage)}
                                    alt={finishLabel}
                                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="p-6 text-xs sm:text-sm font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors text-center">
                                    {finishPlaceholder}
                                </span>
                            )}
                        </div>
                        {/* Label: AI production, human finish in Cyan */}
                        <div className="mt-4">
                            <span className="text-xs sm:text-sm font-semibold text-[#14f1d9] tracking-tight">
                                {finishLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
