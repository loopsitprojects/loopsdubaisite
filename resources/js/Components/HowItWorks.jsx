import React from 'react';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            type: 'Human',
            typeColor: 'text-[#f7a838]',
            title: 'Brief and strategy',
            description: 'We start with your brand, audience and the story worth telling.',
            isAi: false,
        },
        {
            number: '02',
            type: 'Human',
            typeColor: 'text-[#f7a838]',
            title: 'Concept and script',
            description: 'Creative directors write, storyboard and set the look before anything is generated.',
            isAi: false,
        },
        {
            number: '03',
            type: 'AI',
            typeColor: 'text-[#14f1d9]',
            title: 'AI production',
            description: "Scenes, motion and visuals generated at a pace and scale traditional shoots can't match.",
            isAi: true,
        },
        {
            number: '04',
            type: 'Human',
            typeColor: 'text-[#f7a838]',
            title: 'Edit, sound and grade',
            description: 'Editors, sound designers and colourists finish every film by hand.',
            isAi: false,
        },
    ];

    return (
        <section id="how-it-works" className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header & Title */}
                <div className="max-w-3xl mb-12 sm:mb-16">
                    {/* Orange Category Tag: HOW IT WORKS */}
                    <span className="block text-xs font-bold tracking-[0.2em] text-[#f7a838] uppercase mb-4">
                        HOW IT WORKS
                    </span>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold sm:font-black tracking-tight text-white leading-[1.08] mb-5">
                        <span className="block">People decide. AI accelerates.</span>
                        <span className="block">People finish.</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-xl">
                        Every film starts and ends with an experienced creative team. AI does the heavy production in the middle.
                    </p>
                </div>

                {/* 4 Process Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 min-h-[220px] ${
                                step.isAi
                                    ? 'bg-[#0e1014] border-2 border-[#14f1d9] shadow-[0_0_30px_rgba(20,241,217,0.12)] hover:shadow-[0_0_40px_rgba(20,241,217,0.22)] hover:scale-[1.02]'
                                    : 'bg-[#0d0e12] border border-white/10 hover:border-white/20 hover:scale-[1.01]'
                            }`}
                        >
                            <div>
                                {/* Step Label: e.g. "01 · Human" or "03 · AI" */}
                                <div className={`text-xs font-semibold mb-4 flex items-center gap-1.5 ${step.typeColor}`}>
                                    <span>{step.number}</span>
                                    <span>·</span>
                                    <span>{step.type}</span>
                                </div>

                                {/* Step Title */}
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-tight">
                                    {step.title}
                                </h3>

                                {/* Step Description */}
                                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
