import React from 'react';

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Title & Description */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Amber/Orange Category Tag: ABOUT */}
                        <span className="block text-xs font-bold tracking-[0.2em] text-[#f7a838] uppercase mb-4">
                            {tag}
                        </span>

                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold sm:font-black tracking-tight text-white leading-[1.08] mb-6">
                            {headline}
                        </h2>

                        {/* Description Paragraph */}
                        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-md whitespace-pre-line">
                            {description}
                        </p>
                    </div>

                    {/* Right Column: 2x2 Grid of Team / Leadership Cards */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {members.map((member, index) => (
                                <div key={member.id || index} className="group flex flex-col">
                                    {/* Photo Container */}
                                    <div className="w-full aspect-[4/5] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] group-hover:bg-white/[0.04] group-hover:border-white/30 flex items-center justify-center transition-all duration-300 p-4 overflow-hidden">
                                        {member.photo_url ? (
                                            <img
                                                src={member.photo_url}
                                                alt={member.name || '[Name]'}
                                                className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs sm:text-sm font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                                [Photo]
                                            </span>
                                        )}
                                    </div>

                                    {/* Name & Role */}
                                    <div className="mt-3">
                                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#14f1d9] transition-colors">
                                            {member.name || '[Name]'}
                                        </h3>
                                        <p className="text-xs text-neutral-400 mt-0.5">
                                            {member.role || '[Role]'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
