import React from 'react';

export default function WorkHero({ workSetting }) {
    const tag = workSetting?.tag || 'OUR WORK';
    const prefix = workSetting?.headline_prefix !== undefined ? workSetting.headline_prefix : 'Our';
    const highlight = workSetting?.headline_highlight !== undefined ? workSetting.headline_highlight : 'AI creative';
    const suffix = workSetting?.headline_suffix !== undefined ? workSetting.headline_suffix : 'world.';
    const subtitle = workSetting?.subtitle || 'Choose a sector. Every film is AI-generated and human-directed.';
    const badgeTag1 = workSetting?.badge_tag_1 || 'AI-generated';
    const badgeTag2 = workSetting?.badge_tag_2 || 'Human-directed';

    return (
        <section className="relative z-10 pt-36 pb-8 md:pt-44 md:pb-10 bg-[#080808] select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-4xl">
                    {/* Category Tag */}
                    {tag && (
                        <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                            {tag}
                        </span>
                    )}

                    {/* Headline: "Our AI creative world." */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-extrabold sm:font-black tracking-tight text-[#f2eee5] leading-[1.05] mb-5">
                        {prefix && <span>{prefix} </span>}
                        {highlight && <span className="text-[#f7a838]">{highlight} </span>}
                        {suffix && <span>{suffix}</span>}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl mb-8 whitespace-pre-line">
                            {subtitle}
                        </p>
                    )}

                    {/* Status Pill Badge: AI-generated · Human-directed */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium text-neutral-300 shadow-md">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]" />
                            <span>{badgeTag1}</span>
                        </span>
                        <span className="text-neutral-500 font-bold">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#ff7a18] shadow-[0_0_8px_#ff7a18]" />
                            <span>{badgeTag2}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
