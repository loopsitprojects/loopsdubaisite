import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, CheckCircle, Sparkles, Loader2, Calendar } from 'lucide-react';

export default function BookCallModal({ isOpen, onClose }) {
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company: '',
        service_type: 'AI Commercial Video',
        preferred_timeline: 'Within 2-4 weeks',
        message: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/book-call', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setTimeout(() => {
                    setSubmitted(false);
                    onClose();
                }, 3000);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-[#0f1013] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                {submitted ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/30 flex items-center justify-center text-[#14f1d9]">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Creative Call Requested!</h3>
                        <p className="text-neutral-400 text-sm max-w-md mx-auto">
                            Thank you for reaching out to Loops Integrated. Our creative direction team will review your project and get in touch within 24 hours.
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14f1d9]/10 text-[#14f1d9] text-xs font-semibold mb-3">
                                <Sparkles size={12} />
                                <span>Direct Creative Access</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Book a Creative Call
                            </h2>
                            <p className="text-neutral-400 text-sm mt-1">
                                Discuss your vision, timeline, and AI-accelerated video production with our creative directors.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Alex Mercer"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                    />
                                    {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                        Work Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="alex@company.com"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                    />
                                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                        Company / Brand
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                        placeholder="Acme Studios"
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                        Project Type
                                    </label>
                                    <select
                                        value={data.service_type}
                                        onChange={(e) => setData('service_type', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition cursor-pointer"
                                    >
                                        <option value="AI Commercial Video">AI Commercial Video</option>
                                        <option value="Brand Narrative Film">Brand Narrative Film</option>
                                        <option value="Social Campaign Suite">Social Campaign Suite</option>
                                        <option value="Product Showcase & 3D">Product Showcase & 3D</option>
                                        <option value="Other / Bespoke Production">Other / Bespoke Production</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                    Project Goals & Vision
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Tell us about the project, expected deliverables, or target launch date..."
                                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-neutral-200 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Confirming Request...</span>
                                    </>
                                ) : (
                                    <span>Confirm Creative Call</span>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
