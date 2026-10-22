import React from 'react';

export default function OtherServices({ setting, services }) {
    const tag = setting?.tag || 'OUR OTHER SERVICES';
    const headline1 = setting?.headline_1 || 'Beyond video, we support the wider';
    const headline2 = setting?.headline_2 !== undefined ? setting?.headline_2 : 'brand.';

    const items = services && services.length > 0 ? services : [
        {
            id: 1,
            title: 'Brand and creative strategy',
            description: '[Two-line description to confirm with the team.]',
        },
        {
            id: 2,
            title: 'Digital performance',
            description: '[Two-line description to confirm with the team.]',
        },
        {
            id: 3,
            title: 'Experiences and events',
            description: '[Two-line description to confirm with the team.]',
        },
    ];

    return (
        <section id="services" className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header & Title */}
                <div className="max-w-3xl mb-12 sm:mb-16">
                    {/* Category Tag: OUR OTHER SERVICES */}
                    <span className="block text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                        {tag}
                    </span>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold sm:font-black tracking-tight text-white leading-[1.08]">
                        <span className="block">{headline1}</span>
                        {headline2 && <span className="block">{headline2}</span>}
                    </h2>
                </div>

                {/* Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((service) => (
                        <div
                            key={service.id}
                            className="bg-[#0d0e12] border border-white/10 hover:border-white/20 rounded-2xl p-6 sm:p-7 min-h-[170px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] group"
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#14f1d9] transition-colors mb-2">
                                {service.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
