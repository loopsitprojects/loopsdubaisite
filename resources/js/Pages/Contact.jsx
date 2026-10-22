import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { 
    Clock, 
    Mail, 
    MapPin, 
    Phone,
    CheckCircle2, 
    ArrowRight
} from 'lucide-react';

export default function Contact({ contactSetting }) {
    const { flash, company } = usePage().props;
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_type: 'AI Video Production',
        message: '',
    });

    const sectors = ['Real estate', 'Consumer', 'Tech', 'Auto', 'Other'];
    const serviceTypes = [
        'AI Video Production',
        'Concept & Scripting',
        'VFX & Finishing',
        'Full Brand Campaign'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/book-call', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#14f1d9] selection:text-black">
            <Head>
                <title>{`Contact Us — ${contactSetting?.form_title || 'Book a Creative Call'} | ${company?.company_name || 'Loops Integrated'}`}</title>
                <meta
                    name="description"
                    content={contactSetting?.subtitle || "Book a creative call or send a brief. Get a customized storyboard concept in 72 hours from Loops Integrated."}
                />
            </Head>

            {/* 1. Navbar Header */}
            <Header activePage="contact" />

            {/* Main Content */}
            <main className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Hero Headline Section */}
                    <div className="max-w-3xl mb-14 sm:mb-18">
                        {/* Cyan Tag */}
                        {contactSetting?.tag && (
                            <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                                {contactSetting.tag}
                            </span>
                        )}

                        {/* Large Headline */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold sm:font-black tracking-tight text-[#f2eee5] leading-[1.05] mb-5">
                            {contactSetting?.headline_prefix && <span>{contactSetting.headline_prefix} </span>}
                            {contactSetting?.headline_highlight && (
                                <span className="text-[#f7a838]">{contactSetting.headline_highlight}</span>
                            )}
                        </h1>

                        {/* Subtitle */}
                        {contactSetting?.subtitle && (
                            <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl whitespace-pre-line">
                                {contactSetting.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Main Two-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
                        {/* LEFT COLUMN: Studio Information */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* Direct Studio Channels */}
                            <div className="space-y-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#0e0f13] border border-white/10 text-neutral-300">
                                    <Mail size={18} className="text-[#14f1d9] shrink-0" />
                                    <div>
                                        <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Direct Studio Email</div>
                                        <a href={`mailto:${company?.email || 'hello@loopsdubai.com'}`} className="text-white hover:text-[#14f1d9] transition font-medium">
                                            {company?.email || 'hello@loopsdubai.com'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#0e0f13] border border-white/10 text-neutral-300">
                                    <Phone size={18} className="text-[#14f1d9] shrink-0" />
                                    <div>
                                        <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Studio Phone</div>
                                        <a href={`tel:${company?.phone || '+971 4 000 0000'}`} className="text-white hover:text-[#14f1d9] transition font-medium">
                                            {company?.phone || '+971 4 000 0000'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#0e0f13] border border-white/10 text-neutral-300">
                                    <MapPin size={18} className="text-[#ff7a18] shrink-0" />
                                    <div>
                                        <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Headquarters</div>
                                        <span className="text-white font-medium">
                                            {company?.address || 'Dubai Media City, Building 4, Dubai, UAE'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#0e0f13] border border-white/10 text-neutral-300">
                                    <Clock size={18} className="text-cyan-400 shrink-0" />
                                    <div>
                                        <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Working Hours</div>
                                        <span className="text-white font-medium">
                                            {company?.working_hours || 'Mon — Fri, 9:00 AM — 6:00 PM GST'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Interactive Booking Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#0e0f13] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-[#14f1d9]/5 rounded-full blur-3xl pointer-events-none" />

                                {submitted ? (
                                    <div className="py-12 sm:py-16 text-center space-y-5">
                                        <div className="w-16 h-16 rounded-full bg-[#14f1d9]/20 border border-[#14f1d9]/30 text-[#14f1d9] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(20,241,217,0.3)]">
                                            <CheckCircle2 size={32} />
                                        </div>

                                        <h3 className="text-2xl font-bold text-white">
                                            {contactSetting?.success_title || 'Creative Brief Received!'}
                                        </h3>

                                        <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed whitespace-pre-line">
                                            {contactSetting?.success_message || 'Thank you for reaching out. One of our creative directors will review your brief and get back to you within 24 hours with next steps.'}
                                        </p>

                                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                type="button"
                                                className="px-6 py-2.5 rounded-full border border-white/20 text-neutral-300 hover:text-white text-xs font-semibold hover:border-white/40 transition cursor-pointer"
                                            >
                                                Send Another Message
                                            </button>
                                            <Link
                                                href="/work"
                                                className="px-6 py-2.5 rounded-full bg-[#14f1d9] text-black text-xs font-bold hover:bg-[#12dac4] transition shadow-[0_0_15px_rgba(20,241,217,0.3)]"
                                            >
                                                Explore Curated Films →
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {contactSetting?.form_title || 'Book a creative call'}
                                            </h3>
                                            <p className="text-xs text-neutral-400 mt-1 whitespace-pre-line">
                                                {contactSetting?.form_subtitle || "Fill in your details below and we'll reach out to schedule our session."}
                                            </p>
                                        </div>

                                        {/* Contact Name & Work Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                                    Your Name <span className="text-[#ff7a18]">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                                    Work Email <span className="text-[#ff7a18]">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="john@brand.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {/* Phone Number & Company Name */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+971 50 123 4567"
                                                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                                    Company / Brand Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.company}
                                                    onChange={(e) => setData('company', e.target.value)}
                                                    placeholder="e.g. Apex Global Dynamics"
                                                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                            </div>
                                        </div>

                                        {/* Service Needed Pill Selector */}
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-300 mb-2">
                                                Service You Are Looking For
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {serviceTypes.map((service) => {
                                                    const isSelected = data.service_type === service;
                                                    return (
                                                        <button
                                                            key={service}
                                                            type="button"
                                                            onClick={() => setData('service_type', service)}
                                                            className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium transition-all ${
                                                                isSelected
                                                                    ? 'bg-[#14f1d9] text-black font-semibold shadow-[0_0_12px_rgba(20,241,217,0.3)]'
                                                                    : 'bg-neutral-900 border border-white/10 text-neutral-300 hover:border-white/30 hover:text-white'
                                                            }`}
                                                        >
                                                            {service}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Message / Brief Details */}
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                                Brief Details or Project Ambition
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Tell us about your brand, creative references, target format, or specific visual requirements..."
                                                className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full cursor-pointer bg-white text-black hover:bg-neutral-100 font-bold text-sm sm:text-base py-4 px-8 rounded-full transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <span>Submitting Brief...</span>
                                            ) : (
                                                <>
                                                    <span>Book a creative call</span>
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-[11px] text-neutral-500 text-center">
                                            We respect your privacy. No spam. A response guaranteed within 24 hours.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 3. Minimalist Footer */}
            <Footer />
        </div>
    );
}
