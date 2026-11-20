import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Sparkles, Globe } from 'lucide-react';
import LoopsMap from './LoopsMap';

// Static, self-contained office dataset with accurate geographic coordinates
export const STATIC_OFFICES = [
    {
        id: 1,
        city: 'Colombo',
        country: 'Sri Lanka',
        role: 'Global Headquarters',
        is_headquarters: true,
        lat: 6.9147,
        lng: 79.8484,
        description: 'The foundation of Loops Integrated. Colombo drives our core creative direction, AI video workflows, and international strategy.',
        phone: '+94 11 259 0880',
        email: 'colombo@loopsintegrated.com',
        address: 'Loops Integrated HQ, Colombo 03, Sri Lanka',
    },
    {
        id: 2,
        city: 'Dubai',
        country: 'UAE',
        role: 'Middle East & Africa',
        is_headquarters: false,
        lat: 25.1972,
        lng: 55.2744,
        description: 'Our regional hub in Dubai Media City, producing AI-accelerated high-craft video campaigns and brand storytelling for premier Middle Eastern brands.',
        phone: '+971 4 000 0000',
        email: 'hello@loopsdubai.com',
        address: 'Dubai Media City, Building 4, Dubai, UAE',
    },
    {
        id: 3,
        city: 'Doha',
        country: 'Qatar',
        role: 'Gulf Region',
        is_headquarters: false,
        lat: 25.2854,
        lng: 51.5310,
        description: 'Empowering leading regional enterprises with world-class digital performance, creative campaigns, and high-impact media.',
        phone: '+974 4400 0000',
        email: 'doha@loopsintegrated.com',
        address: 'West Bay, Doha, Qatar',
    },
    {
        id: 4,
        city: 'London',
        country: 'United Kingdom',
        role: 'UK & Europe',
        is_headquarters: false,
        lat: 51.5144,
        lng: -0.0803,
        description: 'Connecting European enterprises with borderless creative talent, rapid AI video turnarounds, and cross-cultural campaign strategy.',
        phone: '+44 20 7946 0912',
        email: 'london@loopsintegrated.com',
        address: '128 City Road, London, EC1V 2NX, United Kingdom',
    },
    {
        id: 5,
        city: 'Singapore',
        country: 'Singapore',
        role: 'Southeast Asia',
        is_headquarters: false,
        lat: 1.2838,
        lng: 103.8516,
        description: 'Powering Southeast Asian markets with forward-leaning AI direction, social-first video production, and agile brand communications.',
        phone: '+65 6789 0123',
        email: 'singapore@loopsintegrated.com',
        address: 'Marina Bay Financial Centre, Singapore',
    },
    {
        id: 6,
        city: 'Sydney',
        country: 'Australia',
        role: 'Oceania',
        is_headquarters: false,
        lat: -33.8688,
        lng: 151.2093,
        description: 'Crafting brand campaigns and experiential creative for Australian and Kiwi audiences with human emotion and AI velocity.',
        phone: '+61 2 9876 5432',
        email: 'sydney@loopsintegrated.com',
        address: 'Barangaroo, Sydney NSW 2000, Australia',
    },
    {
        id: 7,
        city: 'Suva',
        country: 'Fiji',
        role: 'Pacific Hub',
        is_headquarters: false,
        lat: -18.1248,
        lng: 178.4501,
        description: 'Leading creative design, media strategy, and digital campaigns across the South Pacific.',
        phone: '+679 330 0000',
        email: 'fiji@loopsintegrated.com',
        address: 'Victoria Parade, Suva, Fiji',
    },
];

export default function GlobalOffices({ offices = STATIC_OFFICES }) {
    const [activeOffice, setActiveOffice] = useState(0);
    const sectionRef = useRef(null);

    const officesList = offices && offices.length > 0 ? offices : STATIC_OFFICES;
    const current = officesList[activeOffice] || officesList[0] || {};

    useEffect(() => {
        if (activeOffice >= officesList.length && officesList.length > 0) {
            setActiveOffice(0);
        }
    }, [officesList.length, activeOffice]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top 75%',
                onEnter: () => {
                    gsap.from('.global-office-copy', {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        clearProps: 'transform,opacity',
                    });
                    gsap.from('.global-office-card', {
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power3.out',
                        clearProps: 'transform,opacity',
                    });
                    gsap.from('.global-office-map', {
                        y: 30,
                        opacity: 0,
                        duration: 1,
                        delay: 0.35,
                        ease: 'power3.out',
                        clearProps: 'transform,opacity',
                    });
                },
                once: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="global-offices"
            ref={sectionRef}
            className="relative z-10 bg-[#080808] py-20 sm:py-28 select-none border-t border-white/[0.04] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header & Office Detail Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12 sm:mb-16">
                    {/* Left Column: Heading, Subtitle & City Tabs */}
                    <div className="lg:col-span-7 global-office-copy">
                        {/* Category Tag */}
                        <span className="block text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                            GLOBAL PRESENCE
                        </span>

                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold sm:font-black tracking-tight text-white leading-[1.08] mb-6">
                            Sri Lankan roots.{' '}
                            <span className="text-[#14f1d9] block sm:inline">Global reach.</span>
                        </h2>

                        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                            What started as a bold idea in Colombo has grown into an international creative agency.
                            With offices across Asia, the Middle East, Europe, and Oceania, we combine local market expertise
                            with seamless global execution.
                        </p>

                        {/* Office Selector Tabs */}
                        <div className="flex flex-wrap gap-2.5">
                            {officesList.map((office, idx) => {
                                const isActive = activeOffice === idx;
                                const label = office.city || office.country;
                                return (
                                    <button
                                        key={office.id || office.city || idx}
                                        type="button"
                                        onClick={() => setActiveOffice(idx)}
                                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
                                            isActive
                                                ? 'bg-[#14f1d9] text-black border-[#14f1d9] shadow-lg shadow-[#14f1d9]/25 scale-[1.02]'
                                                : 'bg-[#0d0e12] text-neutral-300 border-white/10 hover:bg-white/[0.06] hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                                                isActive ? 'bg-black scale-125' : 'bg-neutral-500'
                                            }`}
                                        />
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Selected Office Showcase Card */}
                    <div className="lg:col-span-5 w-full global-office-card">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id || current.city || activeOffice}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="bg-[#0d0e12] border border-white/10 hover:border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300"
                            >
                                {/* Subtle radial accent glow */}
                                <div
                                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-20 filter blur-3xl transition-all duration-500"
                                    style={{
                                        background: activeOffice % 2 === 0 ? '#14f1d9' : '#f7a838',
                                    }}
                                />

                                <div className="relative z-10">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-white/[0.08]">
                                        <div>
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                                    {current.city}
                                                </h3>
                                                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 border border-white/10">
                                                    {current.country}
                                                </span>
                                                {current.is_headquarters && (
                                                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#14f1d9]/20 text-[#14f1d9] border border-[#14f1d9]/40 font-bold">
                                                        HQ
                                                    </span>
                                                )}
                                            </div>

                                            {current.role && (
                                                <p className="text-[#14f1d9] font-mono text-xs font-semibold uppercase tracking-wider mt-2 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#14f1d9] shadow-[0_0_6px_#14f1d9]" />
                                                    {current.role}
                                                </p>
                                            )}
                                        </div>

                                        {/* Office Counter */}
                                        <div className="flex items-center gap-1.5 font-mono text-neutral-400 text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#14f1d9] animate-pulse" />
                                            <span>
                                                {String(activeOffice + 1).padStart(2, '0')} /{' '}
                                                {String(officesList.length).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {current.description && (
                                        <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                                            {current.description}
                                        </p>
                                    )}

                                    {/* Contact Buttons */}
                                    {(current.phone || current.email) && (
                                        <div className="flex flex-wrap items-center gap-2.5 mb-5 text-xs font-sans">
                                            {current.phone && (
                                                <a
                                                    href={`tel:${current.phone}`}
                                                    className="inline-flex items-center gap-2 text-neutral-200 hover:text-[#14f1d9] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                                                >
                                                    <Phone size={13} className="text-[#14f1d9]" />
                                                    <span className="font-medium whitespace-nowrap">{current.phone}</span>
                                                </a>
                                            )}

                                            {current.email && (
                                                <a
                                                    href={`mailto:${current.email}`}
                                                    className="inline-flex items-center gap-2 text-neutral-200 hover:text-[#14f1d9] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                                                >
                                                    <Mail size={13} className="text-[#14f1d9]" />
                                                    <span className="font-medium whitespace-nowrap">{current.email}</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Physical Address */}
                                    {current.address && (
                                        <div className="pt-4 border-t border-white/[0.08] flex items-start gap-2.5 text-xs text-neutral-400">
                                            <MapPin size={14} className="text-[#14f1d9] shrink-0 mt-0.5" />
                                            <p className="leading-relaxed font-medium">{current.address}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* World Map Section (Desktop Interactive Display) */}
                <div className="global-office-map hidden md:block rounded-3xl bg-[#0b0c10] border border-white/[0.08] p-2 relative overflow-hidden shadow-2xl">
                    {/* Top ambient bar indicator */}
                    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs text-neutral-400">
                        <div className="flex items-center gap-2 font-mono">
                            <Globe size={14} className="text-[#14f1d9]" />
                            <span>INTERACTIVE GLOBAL NETWORK</span>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-500">
                            Click any node or city below to inspect
                        </span>
                    </div>

                    <LoopsMap
                        height={460}
                        activeIndex={activeOffice}
                        onOfficeClick={setActiveOffice}
                        offices={officesList}
                    />
                </div>

                {/* Office pills below map */}
                <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mt-6">
                    {officesList.map((office, idx) => {
                        const isActive = activeOffice === idx;
                        const label = office.city || office.country;
                        const colors = ['#14f1d9', '#f7a838', '#a78bfa', '#38bdf8', '#34d399', '#f43f5e', '#fbbf24'];
                        const dotColor = colors[idx % colors.length];

                        return (
                            <button
                                key={office.id || office.city || idx}
                                type="button"
                                onClick={() => setActiveOffice(idx)}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer border text-xs font-mono font-medium ${
                                    isActive
                                        ? 'bg-white/10 text-white border-white/30 shadow-md scale-105'
                                        : 'bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.06] border-white/5'
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full transition-transform ${
                                        isActive ? 'scale-125' : ''
                                    }`}
                                    style={{
                                        backgroundColor: dotColor,
                                        boxShadow: isActive ? `0 0 8px ${dotColor}` : 'none',
                                    }}
                                />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
