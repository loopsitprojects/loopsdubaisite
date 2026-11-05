import React from 'react';
import { appUrl } from '../utils/url';

// Each half of the marquee needs to be wider than the viewport for the loop to
// stay seamless, so short brand lists are repeated up to this many slots.
const MIN_SLOTS_PER_HALF = 16;
const SECONDS_PER_SLOT = 3;

export default function CreatedFor({ logos = [] }) {
    if (logos.length === 0) return null;

    const repeats = Math.ceil(MIN_SLOTS_PER_HALF / logos.length);
    const half = Array.from({ length: repeats }, () => logos).flat();
    const track = [...half, ...half];

    return (
        <section className="relative z-10 bg-[#07080a] border-y border-white/[0.06] py-8 sm:py-10 overflow-hidden select-none">
            <h2 className="px-6 text-center text-xs sm:text-sm font-normal text-neutral-400">
                Trusted by leading brands
            </h2>

            <div className="brand-marquee mt-6 sm:mt-7 overflow-hidden">
                <div
                    className="brand-marquee-track flex w-max items-center"
                    style={{ animationDuration: `${half.length * SECONDS_PER_SLOT}s` }}
                >
                    {track.map((item, index) => {
                        // Only the first copy of each brand is exposed to assistive tech.
                        const isDuplicate = index >= logos.length;

                        return (
                            <div
                                key={`${item.id}-${index}`}
                                aria-hidden={isDuplicate || undefined}
                                className="shrink-0 w-[140px] sm:w-[180px] lg:w-[220px] h-12 px-5 sm:px-8 flex items-center justify-center"
                            >
                                {item.logo_url ? (
                                    <img
                                        src={appUrl(item.logo_url)}
                                        alt={isDuplicate ? '' : item.name}
                                        loading="lazy"
                                        className="max-h-9 sm:max-h-10 max-w-full object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
                                    />
                                ) : (
                                    <span className="text-sm font-medium whitespace-nowrap text-neutral-400">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
