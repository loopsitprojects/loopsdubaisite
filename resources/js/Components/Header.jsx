import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { appUrl } from '../utils/url';

export default function Header({ onBookCall, activePage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url, props } = usePage();
    const company = props?.company;
    const isWorkActive = activePage === 'work' || url.includes('/work') || url.includes('/our-work');
    const isContactActive = activePage === 'contact' || url.includes('/contact');

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#0b0c0e]/85 backdrop-blur-md border-b border-white/[0.05] transition-all select-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href={appUrl('/')} className="group flex items-center gap-1.5 text-xl font-bold tracking-tight text-white focus:outline-none">
                    {company?.logo_type === 'image' && company?.logo_image_url ? (
                        <img 
                            src={appUrl(company.logo_image_url)} 
                            alt={company.company_name || 'Logo'} 
                            className="h-10 sm:h-12 w-auto max-w-[200px] object-contain group-hover:opacity-90 transition" 
                        />
                    ) : (
                        <>
                            <span className="text-white group-hover:text-gray-200 transition">
                                {company?.logo_text_prefix ?? 'Loops'}
                            </span>
                            <span className="text-[#14f1d9] group-hover:opacity-90 transition">
                                {company?.logo_text_suffix ?? 'Integrated'}
                            </span>
                        </>
                    )}
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 lg:gap-10">
                    <Link
                        href={appUrl('/work')}
                        className={`text-sm font-medium transition-colors duration-200 ${
                            isWorkActive ? 'text-[#14f1d9] font-semibold' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        Work
                    </Link>
                    <a
                        href={appUrl('/#how-it-works')}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        How it works
                    </a>
                    <a
                        href={appUrl('/#about')}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        About
                    </a>
                    <a
                        href={appUrl('/#services')}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Our other services
                    </a>
                    <Link
                        href={appUrl('/contact')}
                        className={`text-sm font-medium transition-colors duration-200 ${
                            isContactActive
                                ? 'text-[#14f1d9] font-semibold'
                                : 'text-gray-300 hover:text-white'
                        }`}
                    >
                        Contact
                    </Link>
                </nav>

                {/* Right Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href={appUrl('/contact')}
                        id="header-book-call-btn"
                        className="cursor-pointer bg-white text-black hover:bg-neutral-100 font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Book a creative call
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        type="button"
                        className="text-gray-300 hover:text-white p-2 rounded-lg focus:outline-none cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0c0d10] border-b border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col space-y-3">
                        <Link
                            href={appUrl('/work')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-base py-2 transition-colors ${
                                isWorkActive ? 'text-[#14f1d9] font-semibold' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Work
                        </Link>
                        <a
                            href={appUrl('/#how-it-works')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-base text-gray-300 hover:text-white py-2 transition-colors"
                        >
                            How it works
                        </a>
                        <a
                            href={appUrl('/#about')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-base text-gray-300 hover:text-white py-2 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href={appUrl('/#services')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-base text-gray-300 hover:text-white py-2 transition-colors"
                        >
                            Our other services
                        </a>
                        <Link
                            href={appUrl('/contact')}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-base py-2 transition-colors ${
                                isContactActive
                                    ? 'text-[#14f1d9] font-semibold'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Contact
                        </Link>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                        <Link
                            href={appUrl('/contact')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full bg-white text-black font-semibold text-center py-3 rounded-full hover:bg-neutral-200 transition cursor-pointer"
                        >
                            Book a creative call
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
