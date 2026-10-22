import React, { useState, useRef } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import Header from '../Components/Header';
import WorkHero from '../Components/WorkHero';
import CtaBanner from '../Components/CtaBanner';
import Footer from '../Components/Footer';
import BookCallModal from '../Components/BookCallModal';
import WatchWorkModal from '../Components/WatchWorkModal';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFilmThumbnail, isDirectVideo } from '../utils/video';
import { appUrl } from '../utils/url';

export default function Work({ portfolio, workSetting }) {
    const { flash } = usePage().props;
    const [bookModalOpen, setBookModalOpen] = useState(false);
    const [watchModalOpen, setWatchModalOpen] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [selectedSector, setSelectedSector] = useState('All');

    // Real Curated Films matching database
    const films = portfolio && portfolio.length > 0 ? portfolio : [
        {
            id: 1,
            title: 'Asian Paints Causeway — Royal Infinity | Film by Loops Integrated',
            film_subtitle: "We created this commercial film for Asian Paints Causeway's Royal Infinity paint, showcased at a special event celebrating a life shaped by personal expression and refined taste.",
            category: 'Consumer',
            duration: '[1:21]',
            thumbnail_url: 'https://img.youtube.com/vi/NZBRpXRW4V0/maxresdefault.jpg',
            video_url: 'https://www.youtube.com/watch?v=NZBRpXRW4V0&list=PLbgYKilHGIbE',
        },
        {
            id: 2,
            title: 'Elyndra Life | Belong Beautifully | Brand Film by Loops Integrated',
            film_subtitle: 'Belong beautifully.We produced this brand film for Elyndra Life, capturing a sense of belonging found in a place of rare beauty near Yala.',
            category: 'Real estate',
            duration: '[1:47]',
            thumbnail_url: 'https://img.youtube.com/vi/MfDawFyD2H0/maxresdefault.jpg',
            video_url: 'https://youtu.be/MfDawFyD2H0?si=e5Gx4xoXKbBKl8ji',
        },
        {
            id: 3,
            title: 'Moov | Animated Film by Loops Integrated',
            film_subtitle: 'We created this 15-second animated film for Moov, following a cricket moment where their pain relief spray keeps players moving through the game, without missing a beat.',
            category: 'Consumer',
            duration: '[0:19]',
            thumbnail_url: 'https://img.youtube.com/vi/dfgQZC8rrpI/maxresdefault.jpg',
            video_url: 'https://youtu.be/dfgQZC8rrpI?si=SyVPSp0zX6Xle4Se',
        },
        {
            id: 4,
            title: 'Moov',
            film_subtitle: 'We created this 15-second animated film for Moov, following a gym moment where their pain relief spray keeps you moving through your workout, without missing a beat.',
            category: 'Consumer',
            duration: '[0:19]',
            thumbnail_url: 'https://img.youtube.com/vi/3i8EHmXjVGE/maxresdefault.jpg',
            video_url: 'https://youtu.be/3i8EHmXjVGE?si=rkKs1yfQCic3lT6J',
        },
        {
            id: 5,
            title: 'Moov',
            film_subtitle: 'We created this 15-second animated film for Moov, following a futsal moment where their pain relief spray keeps players moving through the game, without missing a beat.',
            category: 'Tech',
            duration: '[0:19]',
            thumbnail_url: 'https://img.youtube.com/vi/SCvM_xxix04/maxresdefault.jpg',
            video_url: 'https://youtu.be/SCvM_xxix04?si=PqV8-eRO3Wc92SjD',
        },
        {
            id: 6,
            title: 'LilyLanka | AI Film by Loops Integrated',
            film_subtitle: "We created this AI-produced film for LilyLanka, showcasing the beauty of Sri Lanka's destinations and experiences for tourism.",
            category: 'Tech',
            duration: '[1:30]',
            thumbnail_url: 'https://img.youtube.com/vi/ZJ3pMniorko/maxresdefault.jpg',
            video_url: 'https://youtu.be/ZJ3pMniorko?si=Mc8P32w8epy6Whf7',
        },
        {
            id: 7,
            title: 'Elephant House Wonder | Ice Cream Day Special by Loops Integrated',
            film_subtitle: 'TV commercial produced by Loops Integrated for Elephant House Wonder ice cream, celebrating Ice Cream Day',
            category: 'Auto',
            duration: '[1:36]',
            thumbnail_url: 'https://img.youtube.com/vi/hL_OjUWdDRg/maxresdefault.jpg',
            video_url: 'https://youtu.be/hL_OjUWdDRg?si=jJeG3L8NY5OGMo90',
        },
        {
            id: 8,
            title: 'Elephant House "Wonder Blast" | Fully AI Produced Film by Loops Integrated',
            film_subtitle: 'We created this fully AI-produced video for Elephant House Wonder Blast ice cream generated from concept to final frame using AI video production, bringing the fun and flavor of Wonder Blast to life.',
            category: 'Auto',
            duration: '[0:34]',
            thumbnail_url: 'https://img.youtube.com/vi/0YRnuCGvyR4/maxresdefault.jpg',
            video_url: 'https://youtu.be/0YRnuCGvyR4?si=tOB9pNd1yoZ7y0it',
        },
        {
            id: 9,
            title: 'Yamaha FZS V5 | Fully AI Produced Film by Loops Integrated',
            film_subtitle: "We created this fully AI produced video for the Yamaha FZS V5, generated from concept to final frame using AI video production showcasing the bike's design, power, and performance in a bold new way.",
            category: 'Real estate',
            duration: '[1:12]',
            thumbnail_url: 'https://img.youtube.com/vi/5MZuArhqgAg/maxresdefault.jpg',
            video_url: 'https://youtu.be/5MZuArhqgAg?si=4srDSZGo-OSfuh77',
        },
    ];

    // Sectors in exact order from screenshot: All, Real estate, Consumer, Tech, Auto
    const sectors = ['All', 'Real estate', 'Consumer', 'Tech', 'Auto'];

    // Pagination state (6 films per page: 3 rows of 2 on desktop)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const filmsSectionRef = useRef(null);

    const handleSectorChange = (sector) => {
        setSelectedSector(sector);
        setCurrentPage(1);
    };

    const filteredFilms = selectedSector === 'All'
        ? films
        : films.filter((f) => f.category?.toLowerCase() === selectedSector.toLowerCase());

    const totalFilms = filteredFilms.length;
    const totalPages = Math.max(1, Math.ceil(totalFilms / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFilms);
    const paginatedFilms = filteredFilms.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            if (filmsSectionRef.current) {
                filmsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (safePage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }
        if (safePage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#14f1d9] selection:text-black">
            <Head>
                <title>Our Work — Loops Integrated</title>
                <meta
                    name="description"
                    content="Our AI creative world. Choose a sector. Every film is AI-generated and human-directed."
                />
            </Head>

            {/* 1. Header (Navbar with 'Work' active in cyan) */}
            <Header activePage="work" onBookCall={() => setBookModalOpen(true)} />

            {/* Main Content */}
            <main className="flex-1">
                {/* 1st Section: Our Work Hero */}
                <WorkHero workSetting={workSetting} />

                {/* 2nd Section: Filter Bar Strip with Top and Bottom Borders (Matching exact screenshot) */}
                <div className="w-full border-t border-b border-white/[0.14] bg-[#080808] py-3.5 sm:py-4">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Sector Pill Buttons */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            {sectors.map((sector) => {
                                const isActive = selectedSector === sector;
                                return (
                                    <button
                                        key={sector}
                                        onClick={() => handleSectorChange(sector)}
                                        type="button"
                                        className={`cursor-pointer px-5 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 ${
                                            isActive
                                                ? 'bg-[#14f1d9] text-black font-semibold shadow-[0_0_18px_rgba(20,241,217,0.3)]'
                                                : 'border border-white/20 text-neutral-300 font-medium hover:border-white/40 hover:text-white bg-transparent'
                                        }`}
                                    >
                                        {sector}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: "Our other services" Pill Link */}
                        <div className="shrink-0">
                            <a
                                href={workSetting?.services_cta_link || '/#services'}
                                className="inline-block border border-white/20 text-neutral-300 font-medium text-xs sm:text-sm px-5 py-2 rounded-full hover:border-white/40 hover:text-white transition-all bg-transparent"
                            >
                                {workSetting?.services_cta_text || 'Our other services'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Curated Films Grid with Counter & Pagination */}
                <section ref={filmsSectionRef} className="pt-8 pb-16 sm:pt-10 sm:pb-24 select-none scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                        {/* Count Indicator: e.g. "Showing 1–6 of 8 curated films" */}
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                                {totalFilms === 0 ? (
                                    'Showing 0 curated films'
                                ) : (
                                    <>
                                        Showing <span className="font-semibold text-white">{startIndex + 1}–{endIndex}</span> of{' '}
                                        <span className="font-semibold text-white">{totalFilms}</span> curated {totalFilms === 1 ? 'film' : 'films'}
                                        {selectedSector !== 'All' && (
                                            <span className="text-neutral-500"> in <span className="text-[#14f1d9]">{selectedSector}</span></span>
                                        )}
                                    </>
                                )}
                            </p>

                            {totalPages > 1 && (
                                <span className="text-xs text-neutral-500 font-mono">
                                    Page {safePage} of {totalPages}
                                </span>
                            )}
                        </div>

                        {/* Empty State */}
                        {paginatedFilms.length === 0 ? (
                            <div className="text-center py-20 px-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                                <p className="text-base sm:text-lg font-medium text-neutral-300 mb-2">No films found in this sector.</p>
                                <p className="text-xs sm:text-sm text-neutral-500 mb-6">Try selecting another sector or view all curated films.</p>
                                <button
                                    type="button"
                                    onClick={() => handleSectorChange('All')}
                                    className="px-5 py-2.5 rounded-full bg-[#14f1d9] hover:bg-[#12dac4] text-black font-semibold text-xs sm:text-sm transition cursor-pointer shadow-[0_0_15px_rgba(20,241,217,0.3)]"
                                >
                                    View All Films
                                </button>
                            </div>
                        ) : (
                            /* 2-Column Responsive Film Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                {paginatedFilms.map((film, index) => {
                                    const thumb = getFilmThumbnail(film);
                                    const isDirect = isDirectVideo(film.video_url);

                                    return (
                                        <div
                                            key={film.id || index}
                                            onClick={() => {
                                                setSelectedFilm(film);
                                                setWatchModalOpen(true);
                                            }}
                                            className="group cursor-pointer flex flex-col space-y-3.5"
                                        >
                                            {/* Video Screen Container */}
                                            <div className="relative aspect-video w-full rounded-2xl bg-[#111215] border border-white/10 overflow-hidden group-hover:border-white/25 transition-all duration-300 shadow-xl flex items-center justify-center">
                                                {/* Ambient Background Video / Poster */}
                                                <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                                                    {thumb && (
                                                        <img
                                                            src={thumb}
                                                            alt={film.title || 'Film thumbnail'}
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                if (e.currentTarget.src && e.currentTarget.src.includes('maxresdefault.jpg')) {
                                                                    e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500"
                                                        />
                                                    )}
                                                    {isDirect && (
                                                        <video
                                                            muted
                                                            loop
                                                            playsInline
                                                            poster={thumb || undefined}
                                                            onMouseEnter={(e) => e.target.play().catch(() => {})}
                                                            onMouseLeave={(e) => e.target.pause()}
                                                            className={`w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105 transition-all duration-500 ${
                                                                thumb ? 'relative z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''
                                                            }`}
                                                            src={appUrl(film.video_url)}
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />
                                                </div>

                                                {/* Top Right Duration Tag */}
                                                <div className="absolute top-3.5 right-4 z-10 pointer-events-none">
                                                    <span className="font-mono text-xs sm:text-sm text-neutral-400 group-hover:text-white transition">
                                                        {film.duration || '[0:45]'}
                                                    </span>
                                                </div>

                                                {/* Center Play Button */}
                                                <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white group-hover:bg-[#14f1d9] group-hover:text-black transition-all duration-300 shadow-2xl">
                                                    <Play size={20} className="ml-1 fill-current" />
                                                </div>
                                            </div>

                                            {/* Card Metadata Below Video */}
                                            <div className="flex items-center justify-between gap-4 pt-1">
                                                <div className="space-y-0.5 min-w-0">
                                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#14f1d9] transition-colors truncate">
                                                        {film.title || '[Brand name]'}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-neutral-400 truncate">
                                                        {film.film_subtitle || '[Film title] · Created for [Brand]'}
                                                    </p>
                                                </div>

                                                {/* Right Category Tag Pill */}
                                                {film.category && (
                                                    <div className="shrink-0">
                                                        <span className="inline-block px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] text-xs font-medium text-neutral-300 group-hover:border-white/30 transition">
                                                            {film.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-neutral-400 font-mono">
                                    Showing <span className="text-white font-semibold">{startIndex + 1}–{endIndex}</span> of{' '}
                                    <span className="text-white font-semibold">{totalFilms}</span> films
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {/* Previous Button */}
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(safePage - 1)}
                                        disabled={safePage === 1}
                                        aria-label="Previous page"
                                        className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                                            safePage === 1
                                                ? 'opacity-30 cursor-not-allowed text-neutral-600 border border-white/5 bg-transparent'
                                                : 'text-neutral-300 border border-white/15 bg-white/[0.03] hover:border-white/40 hover:text-white hover:bg-white/[0.08]'
                                        }`}
                                    >
                                        <ChevronLeft size={14} />
                                        <span>Previous</span>
                                    </button>

                                    {/* Page number buttons */}
                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((item, idx) => {
                                            if (item === '...') {
                                                return (
                                                    <span key={`ellipsis-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs font-mono text-neutral-500">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            const isActive = item === safePage;
                                            return (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => handlePageChange(item)}
                                                    className={`cursor-pointer w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
                                                        isActive
                                                            ? 'bg-[#14f1d9] text-black font-bold shadow-[0_0_16px_rgba(20,241,217,0.4)] scale-105'
                                                            : 'border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06]'
                                                    }`}
                                                >
                                                    {item}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(safePage + 1)}
                                        disabled={safePage === totalPages}
                                        aria-label="Next page"
                                        className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                                            safePage === totalPages
                                                ? 'opacity-30 cursor-not-allowed text-neutral-600 border border-white/5 bg-transparent'
                                                : 'text-neutral-300 border border-white/15 bg-white/[0.03] hover:border-white/40 hover:text-white hover:bg-white/[0.08]'
                                        }`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3rd Section: High-Contrast CTA Banner (Matching exact screenshot) */}
                <CtaBanner
                    onBookCall={() => setBookModalOpen(true)}
                    showSubtitle={false}
                />
            </main>

            {/* 3. Footer */}
            <Footer onContactClick={() => setBookModalOpen(true)} />

            {/* Modals */}
            <BookCallModal
                isOpen={bookModalOpen}
                onClose={() => setBookModalOpen(false)}
            />

            <WatchWorkModal
                isOpen={watchModalOpen}
                onClose={() => setWatchModalOpen(false)}
                onBookCall={() => setBookModalOpen(true)}
                videoUrl={selectedFilm?.video_url}
            />
        </div>
    );
}
