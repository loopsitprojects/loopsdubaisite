import React from 'react';

export default function CtaBanner({ onBookCall, showSubtitle = true }) {
    return (
        <section className="relative z-10 bg-[#f4f1ea] py-14 sm:py-18 select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    {/* Left: Headline & Offer Terms */}
                    <div className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold sm:font-black tracking-tight text-[#0a0a0a] leading-[1.1]">
                            <span className="block">Send a brief. Get a storyboard concept in [72]</span>
                            <span className="block">hours.</span>
                        </h2>
                        {showSubtitle && (
                            <p className="text-xs sm:text-sm text-neutral-600 font-normal mt-2.5">
                                [Offer terms to confirm before launch.]
                            </p>
                        )}
                    </div>

                    {/* Right: Black Pill Action Button */}
                    <div className="shrink-0">
                        <button
                            onClick={onBookCall}
                            type="button"
                            className="cursor-pointer bg-black text-white hover:bg-neutral-800 font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Book a creative call
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
