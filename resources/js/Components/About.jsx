import React, { useEffect, useRef, useState } from 'react';
import { appUrl } from '../utils/url';

// Touch screens never fire hover, so there a card shows its hover look while it
// crosses the middle of the viewport, or after it is tapped.
function useTouchActive() {
    const ref = useRef(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!window.matchMedia('(hover: none)').matches) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setActive(entry.isIntersecting),
            { rootMargin: '-35% 0px -35% 0px' }
        );
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    const activate = () => {
        if (window.matchMedia('(hover: none)').matches) setActive(true);
    };

    return { ref, active, activate };
}

function TeamCard({ member }) {
    const { ref, active, activate } = useTouchActive();

    return (
        <div ref={ref} onPointerDown={activate} className="group flex flex-col">
            {/* Photo Container */}
            <div className={`w-full aspect-[4/5] rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                member.photo_url
                    ? `border bg-gradient-to-b from-white/[0.05] to-white/[0.01] group-hover:border-white/25 shadow-lg ${active ? 'border-white/25' : 'border-white/10'}`
                    : `border border-dashed group-hover:bg-white/[0.04] group-hover:border-white/30 p-4 ${active ? 'bg-white/[0.04] border-white/30' : 'bg-white/[0.02] border-white/15'}`
            }`}>
                {member.photo_url ? (
                    <img
                        src={appUrl(member.photo_url)}
                        alt={member.name || '[Name]'}
                        className={`w-full h-full object-cover object-top filter group-hover:grayscale-0 group-hover:scale-105 transition duration-500 ${active ? 'grayscale-0 scale-105' : 'grayscale'}`}
                        loading="lazy"
                    />
                ) : (
                    <span className={`text-xs sm:text-sm font-medium group-hover:text-neutral-200 transition-colors ${active ? 'text-neutral-200' : 'text-neutral-400'}`}>
                        [Photo]
                    </span>
                )}
            </div>

            {/* Name & Role */}
            <div className="mt-3.5">
                <h3 className={`text-sm sm:text-base font-bold group-hover:text-[#14f1d9] transition-colors ${active ? 'text-[#14f1d9]' : 'text-white'}`}>
                    {member.name || '[Name]'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                    {member.role || '[Role]'}
                </p>
            </div>
        </div>
    );
}

export default function About({ about, teamMembers }) {
    const tag = about?.tag || 'ABOUT';
    const headline = about?.headline || 'Built for global brands.';
    const description = about?.description || "[Two to three sentences on the team's international experience, the markets you have worked in and why creative direction stays human.]";

    // Team members or fallback 4 default placeholder cards matching exact design
    const members = teamMembers && teamMembers.length > 0 ? teamMembers : [
        { id: 1, name: '[Name]', role: '[Role]', photo_url: null },
        { id: 2, name: '[Name]', role: '[Role]', photo_url: null },
        { id: 3, name: '[Name]', role: '[Role]', photo_url: null },
        { id: 4, name: '[Name]', role: '[Role]', photo_url: null },
    ];

    return (
        <section id="about" className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header & Description */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10 mb-12 sm:mb-16">
                    <div className="max-w-2xl">
                        {/* Amber/Orange Category Tag: ABOUT */}
                        <span className="block text-xs font-bold tracking-[0.2em] text-[#f7a838] uppercase mb-4">
                            {tag}
                        </span>

                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold sm:font-black tracking-tight text-white leading-[1.08]">
                            {headline}
                        </h2>
                    </div>

                    {/* Description Paragraph */}
                    <div className="max-w-xl">
                        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Horizontal Single Line of All 4 Team Members */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {members.map((member, index) => (
                        <TeamCard key={member.id || index} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
