import React from 'react';

export default function CreatedFor({ logos }) {
    // Default to 6 items if not provided or empty
    const items = logos && logos.length > 0 ? logos : [
        { id: 1, name: '[Brand logo]' },
        { id: 2, name: '[Brand logo]' },
        { id: 3, name: '[Brand logo]' },
        { id: 4, name: '[Brand logo]' },
        { id: 5, name: '[Brand logo]' },
        { id: 6, name: '[Brand logo]' },
    ];

    return (
        <section className="relative z-10 bg-[#07080a] border-y border-white/[0.06] py-8 sm:py-10 overflow-hidden select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10">
                    {/* Left Title: "CREATED FOR" */}
                    <div className="shrink-0">
                        <span className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                            CREATED FOR
                        </span>
                    </div>

                    {/* Horizontal Row of 6 Brand Logo Cards */}
                    <div className="flex-1 flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {items.slice(0, 6).map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group shrink-0 w-[130px] sm:w-[150px] lg:w-[160px] h-[62px] sm:h-[68px] rounded-xl sm:rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 flex items-center justify-center transition-all duration-200"
                            >
                                {item.logo_url ? (
                                    <img
                                        src={item.logo_url}
                                        alt={item.name}
                                        className="max-h-8 max-w-[80%] object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition"
                                    />
                                ) : (
                                    <span className="text-xs sm:text-sm font-normal text-neutral-400 group-hover:text-neutral-200 transition-colors tracking-tight">
                                        {item.name || '[Brand logo]'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
