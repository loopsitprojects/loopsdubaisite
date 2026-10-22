import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import CreatedFor from '../Components/CreatedFor';
import FeaturedFilms from '../Components/FeaturedFilms';
import HowItWorks from '../Components/HowItWorks';
import BehindTheFilm from '../Components/BehindTheFilm';
import About from '../Components/About';
import OtherServices from '../Components/OtherServices';
import CtaBanner from '../Components/CtaBanner';
import Footer from '../Components/Footer';
import BookCallModal from '../Components/BookCallModal';
import WatchWorkModal from '../Components/WatchWorkModal';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function Home({ hero, behindTheFilm, about, teamMembers, servicesSetting, services, portfolio, brandLogos }) {
    const { flash } = usePage().props;
    const [bookModalOpen, setBookModalOpen] = useState(false);
    const [watchModalOpen, setWatchModalOpen] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#14f1d9] selection:text-black">
            <Head>
                <title>Loops Integrated — AI Video Production & Creative Direction</title>
                <meta
                    name="description"
                    content="Concept, script, direction and finishing by experienced creatives. Production accelerated by AI. Made for global brands."
                />
            </Head>

            {/* Flash notification banner if redirected with success */}
            {flash?.success && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#14f1d9] text-black px-6 py-3 rounded-full font-medium text-sm shadow-2xl flex items-center gap-2 animate-bounce">
                    <CheckCircle2 size={18} />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* 1. Header (Navbar) */}
            <Header onBookCall={() => setBookModalOpen(true)} />

            {/* Main Content */}
            <main className="flex-1">
                {/* 1st Section: Hero Section */}
                <Hero
                    hero={hero}
                    onBookCall={() => setBookModalOpen(true)}
                    onWatchWork={() => {
                        setSelectedFilm(null);
                        setWatchModalOpen(true);
                    }}
                />

                {/* 2nd Section: CREATED FOR Brand Logos */}
                <CreatedFor logos={brandLogos} />

                {/* 3rd Section: FEATURED FILMS ("Our best work, for brands you know.") */}
                <FeaturedFilms
                    portfolio={portfolio}
                    onFilmClick={(film) => {
                        setSelectedFilm(film);
                        setWatchModalOpen(true);
                    }}
                    onEnterCreativeWorld={() => setBookModalOpen(true)}
                />

                {/* 4th Section: HOW IT WORKS ("People decide. AI accelerates. People finish.") */}
                <HowItWorks />

                {/* 5th Section: BEHIND THE FILM ("From human sketch to finished film.") */}
                <BehindTheFilm setting={behindTheFilm} />

                {/* 6th Section: ABOUT ("Built for global brands.") */}
                <About about={about} teamMembers={teamMembers} />

                {/* 7th Section: OUR OTHER SERVICES ("Beyond video, we support the wider brand.") */}
                <OtherServices setting={servicesSetting} services={services} />

                {/* 8th Section: HIGH-CONTRAST CTA ("Send a brief. Get a storyboard concept in [72] hours.") */}
                <CtaBanner onBookCall={() => setBookModalOpen(true)} />
            </main>

            {/* 3. Footer (Matching Exact Screenshot) */}
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
                videoUrl={selectedFilm?.video_url || hero?.reel_video_url}
            />
        </div>
    );
}
