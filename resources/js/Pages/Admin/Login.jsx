import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Lock, Mail, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { appUrl } from '../../utils/url';

export default function Login() {
    const { props } = usePage();
    const company = props?.company;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(appUrl('/admin/login'));
    };

    const fillDemoAdmin = () => {
        setData({
            email: 'admin@loopsdubai.com',
            password: 'password123',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#090a0d] text-white flex flex-col justify-center items-center p-6 selection:bg-[#14f1d9] selection:text-black">
            <Head title="Admin Login — Loops Integrated" />

            <div className="w-full max-w-md">
                {/* Back to website */}
                <div className="mb-6">
                    <Link
                        href={appUrl('/')}
                        className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to public site</span>
                    </Link>
                </div>

                <div className="bg-[#101217] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        {company?.logo_type === 'image' && company?.logo_image_url ? (
                            <div className="flex justify-center mb-3">
                                <img 
                                    src={appUrl(company.logo_image_url)} 
                                    alt={company.company_name || 'Loops Integrated'} 
                                    className="h-12 w-auto max-w-[200px] object-contain" 
                                />
                            </div>
                        ) : (
                            <>
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#14f1d9]/10 text-[#14f1d9] border border-[#14f1d9]/20 mb-3">
                                    <ShieldCheck size={24} />
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    {company?.company_name || 'Loops Integrated'}
                                </h1>
                            </>
                        )}
                        <p className="text-neutral-400 text-xs mt-1">
                            Administrator Control Center
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-3 text-neutral-500" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@loopsdubai.com"
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-3 text-neutral-500" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/20 bg-neutral-900 text-[#14f1d9] focus:ring-0"
                                />
                                <span>Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={fillDemoAdmin}
                                className="text-[#14f1d9] hover:underline cursor-pointer"
                            >
                                Fill Default Admin
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-neutral-200 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In to Dashboard</span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6 text-xs text-neutral-500">
                    Default credentials: <span className="text-neutral-300 font-mono">admin@loopsdubai.com</span> / <span className="text-neutral-300 font-mono">password123</span>
                </div>
            </div>
        </div>
    );
}
