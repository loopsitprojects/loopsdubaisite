import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { appUrl } from '../utils/url';

export default function Footer({ onContactClick }) {
    const { props } = usePage();
    const company = props?.company;

    return (
        <footer className="bg-[#050505] text-neutral-400 py-16 sm:py-20 select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left Branding */}
                    <div className="space-y-2">
                        <Link href={appUrl('/')} className="inline-block focus:outline-none group">
                            {company?.logo_type === 'image' && company?.logo_image_url ? (
                                <img 
                                    src={appUrl(company.logo_image_url)} 
                                    alt={company.company_name || 'Loops Integrated'} 
                                    className="h-10 sm:h-12 w-auto max-w-[200px] object-contain group-hover:opacity-90 transition mb-1" 
                                />
                            ) : (
                                <span className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-gray-200 transition">
                                    {company?.company_name || `${company?.logo_text_prefix || 'Loops'} ${company?.logo_text_suffix || 'Integrated'}`}
                                </span>
                            )}
                        </Link>
                        <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                            {company?.tagline || 'AI video production with human creative direction.'}
                        </p>
                    </div>

                    {/* Right Horizontal Navigation Links */}
                    <nav className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm pt-1 md:pt-1">
                        <a
                            href={appUrl('/#work')}
                            className="text-neutral-300 hover:text-white transition-colors duration-200"
                        >
                            Work
                        </a>
                        <a
                            href={appUrl('/#how-it-works')}
                            className="text-neutral-300 hover:text-white transition-colors duration-200"
                        >
                            How it works
                        </a>
                        <a
                            href={appUrl('/#about')}
                            className="text-neutral-300 hover:text-white transition-colors duration-200"
                        >
                            About
                        </a>
                        <a
                            href={appUrl('/#services')}
                            className="text-neutral-300 hover:text-white transition-colors duration-200"
                        >
                            Our other services
                        </a>
                        <Link
                            href={appUrl('/contact')}
                            className="cursor-pointer text-neutral-300 hover:text-white transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
