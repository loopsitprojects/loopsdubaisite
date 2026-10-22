import React, { useState, useRef } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { appUrl } from '../../utils/url';
import { 
    LayoutDashboard, 
    Sliders, 
    Mail, 
    Phone,
    MapPin,
    Type,
    CheckCircle2, 
    ExternalLink, 
    LogOut, 
    Save, 
    Trash2, 
    Clock, 
    Video, 
    Sparkles, 
    Layers,
    UserCheck,
    Calendar,
    Building2,
    Plus,
    Edit3,
    X,
    Play,
    Film,
    Image as ImageIcon,
    Menu,
    UploadCloud,
    Check,
    Users,
    Home,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import { getFilmThumbnail, isDirectVideo, parseVideoUrl } from '../../utils/video';

export default function Dashboard({ hero, behindTheFilm, about, teamMembers = [], servicesSetting, services = [], company, bookings = [], portfolio = [], brandLogos = [], stats = {}, workSetting, contactSetting }) {
    const { auth, flash, company: sharedCompany } = usePage().props;
    const activeCompany = company || sharedCompany || {};
    const [activeTab, setActiveTab] = useState('home'); // 'home' | 'work' | 'contact' | 'leads' | 'brands' | 'company'
    const [homeTab, setHomeTab] = useState('hero'); // 'hero' | 'behind' | 'about' | 'services'
    const [workTab, setWorkTab] = useState('hero'); // 'hero' | 'portfolio'
    const [filterCategory, setFilterCategory] = useState('All');
    const [leadStatusFilter, setLeadStatusFilter] = useState('All');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Pagination for Curated Films
    const [filmCurrentPage, setFilmCurrentPage] = useState(1);
    const filmsPerPage = 6;

    // Pagination for Bookings / Leads
    const [leadCurrentPage, setLeadCurrentPage] = useState(1);
    const leadsPerPage = 8;

    // Behind The Film image upload states
    const [conceptFilePreview, setConceptFilePreview] = useState(null);
    const [finishFilePreview, setFinishFilePreview] = useState(null);
    const conceptFileInputRef = useRef(null);
    const finishFileInputRef = useRef(null);

    // Film Thumbnail upload / URL states
    const [filmThumbPreview, setFilmThumbPreview] = useState(null);
    const [filmThumbMethod, setFilmThumbMethod] = useState('upload'); // 'upload' | 'url'
    const filmThumbInputRef = useRef(null);

    // Form for Behind The Film CMS
    const behindForm = useForm({
        tag: behindTheFilm?.tag || 'BEHIND THE FILM',
        title_line_1: behindTheFilm?.title_line_1 || 'From human sketch to finished',
        title_line_2: behindTheFilm?.title_line_2 !== undefined ? behindTheFilm.title_line_2 : 'film.',
        concept_label: behindTheFilm?.concept_label || 'Human concept',
        concept_placeholder_text: behindTheFilm?.concept_placeholder_text || '[Storyboard / reference frames]',
        concept_image_url: behindTheFilm?.concept_image_url || '',
        concept_file: null,
        finish_label: behindTheFilm?.finish_label || 'AI production, human finish',
        finish_placeholder_text: behindTheFilm?.finish_placeholder_text || '[Final film frame]',
        finish_image_url: behindTheFilm?.finish_image_url || '',
        finish_file: null,
    });

    const handleConceptFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            behindForm.setData((prev) => ({
                ...prev,
                concept_file: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setConceptFilePreview(previewUrl);
        }
    };

    const handleRemoveConceptImage = () => {
        behindForm.setData((prev) => ({
            ...prev,
            concept_file: null,
            concept_image_url: '',
        }));
        setConceptFilePreview(null);
        if (conceptFileInputRef.current) {
            conceptFileInputRef.current.value = '';
        }
    };

    const handleFinishFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            behindForm.setData((prev) => ({
                ...prev,
                finish_file: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setFinishFilePreview(previewUrl);
        }
    };

    const handleRemoveFinishImage = () => {
        behindForm.setData((prev) => ({
            ...prev,
            finish_file: null,
            finish_image_url: '',
        }));
        setFinishFilePreview(null);
        if (finishFileInputRef.current) {
            finishFileInputRef.current.value = '';
        }
    };

    const handleBehindSubmit = (e) => {
        e.preventDefault();
        behindForm.post('/admin/behind-the-film', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Form for About Section CMS
    const aboutForm = useForm({
        tag: about?.tag || 'ABOUT',
        headline: about?.headline || 'Built for global brands.',
        description: about?.description || "[Two to three sentences on the team's international experience, the markets you have worked in and why creative direction stays human.]",
    });

    const handleAboutSubmit = (e) => {
        e.preventDefault();
        aboutForm.post('/admin/about', {
            preserveScroll: true,
        });
    };

    // Modal & Form state for Team Member Add / Edit
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [editingTeamMember, setEditingTeamMember] = useState(null);
    const [teamPhotoPreview, setTeamPhotoPreview] = useState(null);
    const teamPhotoInputRef = useRef(null);

    const teamForm = useForm({
        name: '',
        role: '',
        photo_url: '',
        photo_file: null,
        sort_order: (teamMembers?.length || 0) + 1,
    });

    const openAddTeamModal = () => {
        setEditingTeamMember(null);
        setTeamPhotoPreview(null);
        teamForm.setData({
            name: '',
            role: '',
            photo_url: '',
            photo_file: null,
            sort_order: (teamMembers?.length || 0) + 1,
        });
        setTeamModalOpen(true);
    };

    const openEditTeamModal = (member) => {
        setEditingTeamMember(member);
        setTeamPhotoPreview(member.photo_url || null);
        teamForm.setData({
            name: member.name || '',
            role: member.role || '',
            photo_url: member.photo_url || '',
            photo_file: null,
            sort_order: member.sort_order || 1,
        });
        setTeamModalOpen(true);
    };

    const handleTeamPhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            teamForm.setData((prev) => ({
                ...prev,
                photo_file: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setTeamPhotoPreview(previewUrl);
        }
    };

    const handleRemoveTeamPhoto = () => {
        teamForm.setData((prev) => ({
            ...prev,
            photo_file: null,
            photo_url: '',
        }));
        setTeamPhotoPreview(null);
        if (teamPhotoInputRef.current) {
            teamPhotoInputRef.current.value = '';
        }
    };

    const handleTeamSubmit = (e) => {
        e.preventDefault();
        if (editingTeamMember) {
            teamForm.post(`/admin/team-members/${editingTeamMember.id}`, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setTeamModalOpen(false);
                    setEditingTeamMember(null);
                    setTeamPhotoPreview(null);
                },
            });
        } else {
            teamForm.post('/admin/team-members', {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setTeamModalOpen(false);
                    teamForm.reset();
                    setTeamPhotoPreview(null);
                },
            });
        }
    };

    const handleDeleteTeamMember = (id) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            router.delete(`/admin/team-members/${id}`, { preserveScroll: true });
        }
    };

    // Form for Services Section CMS (Headings & Tag)
    const servicesForm = useForm({
        tag: servicesSetting?.tag || 'OUR OTHER SERVICES',
        headline_1: servicesSetting?.headline_1 || 'Beyond video, we support the wider',
        headline_2: servicesSetting?.headline_2 !== undefined ? servicesSetting.headline_2 : 'brand.',
    });

    const handleServicesSettingSubmit = (e) => {
        e.preventDefault();
        servicesForm.post('/admin/services-setting', {
            preserveScroll: true,
        });
    };

    // Modal state for Service Card Add / Edit
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const serviceItemForm = useForm({
        title: '',
        description: '',
        sort_order: (services?.length || 0) + 1,
    });

    const openAddServiceModal = () => {
        setEditingService(null);
        serviceItemForm.setData({
            title: '',
            description: '',
            sort_order: (services?.length || 0) + 1,
        });
        setServiceModalOpen(true);
    };

    const openEditServiceModal = (item) => {
        setEditingService(item);
        serviceItemForm.setData({
            title: item.title || '',
            description: item.description || '',
            sort_order: item.sort_order || 1,
        });
        setServiceModalOpen(true);
    };

    const handleServiceItemSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            serviceItemForm.post(`/admin/services/${editingService.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setServiceModalOpen(false);
                    setEditingService(null);
                },
            });
        } else {
            serviceItemForm.post('/admin/services', {
                preserveScroll: true,
                onSuccess: () => {
                    setServiceModalOpen(false);
                    serviceItemForm.reset();
                },
            });
        }
    };

    const handleDeleteServiceItem = (id) => {
        if (confirm('Are you sure you want to remove this service?')) {
            router.delete(`/admin/services/${id}`, { preserveScroll: true });
        }
    };

    // Modal state for Portfolio Film Add / Edit
    const [filmModalOpen, setFilmModalOpen] = useState(false);
    const [editingFilm, setEditingFilm] = useState(null);

    // Modal state for Brand Logo Add
    const [brandModalOpen, setBrandModalOpen] = useState(false);

    // Logo image upload state
    const [logoFilePreview, setLogoFilePreview] = useState(null);
    const [imageInputMethod, setImageInputMethod] = useState('upload'); // 'upload' | 'url'
    const fileInputRef = useRef(null);

    // Form for Company Details & Logo CMS
    const companyForm = useForm({
        logo_type: activeCompany?.logo_type || 'text',
        logo_text_prefix: activeCompany?.logo_text_prefix || 'Loops',
        logo_text_suffix: activeCompany?.logo_text_suffix || 'Integrated',
        logo_image_url: activeCompany?.logo_image_url || '',
        logo_file: null,
        company_name: activeCompany?.company_name || 'Loops Integrated',
        email: activeCompany?.email || 'hello@loopsdubai.com',
        phone: activeCompany?.phone || '+971 4 000 0000',
        address: activeCompany?.address || 'Dubai Media City, Building 4, Dubai, UAE',
        working_hours: activeCompany?.working_hours || 'Mon — Fri, 9:00 AM — 6:00 PM GST',
        tagline: activeCompany?.tagline || 'AI video production with human creative direction.',
    });

    const handleLogoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            companyForm.setData((prev) => ({
                ...prev,
                logo_file: file,
                logo_type: 'image',
            }));
            const previewUrl = URL.createObjectURL(file);
            setLogoFilePreview(previewUrl);
        }
    };

    const handleRemoveLogoImage = () => {
        companyForm.setData((prev) => ({
            ...prev,
            logo_file: null,
            logo_image_url: '',
            logo_type: 'text',
        }));
        setLogoFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCompanySubmit = (e) => {
        e.preventDefault();
        companyForm.post('/admin/company-settings', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Form for Hero Section CMS
    const heroForm = useForm({
        badge_tag_1: hero?.badge_tag_1 || 'AI-generated',
        badge_tag_2: hero?.badge_tag_2 || 'Human-directed',
        headline_1: hero?.headline_1 || 'AI-powered video.',
        headline_2: hero?.headline_2 || 'Human-led creative.',
        subtitle: hero?.subtitle || 'Concept, script, direction and finishing by experienced creatives. Production accelerated by AI. Made for global brands.',
        primary_cta_text: hero?.primary_cta_text || 'Watch our work',
        primary_cta_link: hero?.primary_cta_link || '#work',
        secondary_cta_text: hero?.secondary_cta_text || 'Book a creative call',
        secondary_cta_link: hero?.secondary_cta_link || '#book',
        reel_placeholder_text: hero?.reel_placeholder_text || '[HERO REEL PLACEHOLDER - 4G-008 - MUTED AUTOPLAY]',
        reel_video_url: hero?.reel_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
    });

    // Form for Adding / Editing a Curated Film
    const filmForm = useForm({
        title: '',
        category: 'Real estate',
        duration: '[0:45]',
        film_subtitle: '',
        thumbnail_url: '',
        thumbnail_file: null,
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
        sort_order: 1,
    });

    // Form for Brand Logo
    const brandForm = useForm({
        name: '',
        logo_url: '',
        sort_order: brandLogos.length + 1,
    });

    const handleHeroSubmit = (e) => {
        e.preventDefault();
        heroForm.post('/admin/hero', {
            preserveScroll: true,
        });
    };

    // Form for Work Page Hero & Header CMS
    const workForm = useForm({
        tag: workSetting?.tag || 'OUR WORK',
        headline_prefix: workSetting?.headline_prefix !== undefined ? workSetting.headline_prefix : 'Our',
        headline_highlight: workSetting?.headline_highlight !== undefined ? workSetting.headline_highlight : 'AI creative',
        headline_suffix: workSetting?.headline_suffix !== undefined ? workSetting.headline_suffix : 'world.',
        subtitle: workSetting?.subtitle || 'Choose a sector. Every film is AI-generated and human-directed.',
        badge_tag_1: workSetting?.badge_tag_1 || 'AI-generated',
        badge_tag_2: workSetting?.badge_tag_2 || 'Human-directed',
        services_cta_text: workSetting?.services_cta_text || 'Our other services',
        services_cta_link: workSetting?.services_cta_link || '/#services',
    });

    const handleWorkSubmit = (e) => {
        e.preventDefault();
        workForm.post('/admin/work-settings', {
            preserveScroll: true,
        });
    };

    // Form for Contact Page CMS
    const contactForm = useForm({
        tag: contactSetting?.tag || 'START A PROJECT',
        headline_prefix: contactSetting?.headline_prefix !== undefined ? contactSetting.headline_prefix : 'Let’s make something',
        headline_highlight: contactSetting?.headline_highlight !== undefined ? contactSetting.headline_highlight : 'extraordinary.',
        subtitle: contactSetting?.subtitle || 'Send a brief or book a 20–minute discovery call with our creative directors. We’ll explore how AI acceleration can elevate your brand video.',
        form_title: contactSetting?.form_title || 'Book a creative call',
        form_subtitle: contactSetting?.form_subtitle || "Fill in your details below and we'll reach out to schedule our session.",
        success_title: contactSetting?.success_title || 'Creative Brief Received!',
        success_message: contactSetting?.success_message || 'Thank you for reaching out. One of our creative directors will review your brief and get back to you within 24 hours with next steps.',
    });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        contactForm.post('/admin/contact-settings', {
            preserveScroll: true,
        });
    };

    const handleFilmThumbFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            filmForm.setData((prev) => ({
                ...prev,
                thumbnail_file: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setFilmThumbPreview(previewUrl);
        }
    };

    const handleRemoveFilmThumb = () => {
        filmForm.setData((prev) => ({
            ...prev,
            thumbnail_file: null,
            thumbnail_url: '',
        }));
        setFilmThumbPreview(null);
        if (filmThumbInputRef.current) {
            filmThumbInputRef.current.value = '';
        }
    };

    const handleAutoDetectYoutubeThumb = () => {
        if (!filmForm.data.video_url) return;
        const parsed = parseVideoUrl(filmForm.data.video_url);
        if (parsed.thumbnailUrl) {
            filmForm.setData((prev) => ({
                ...prev,
                thumbnail_url: parsed.thumbnailUrl,
                thumbnail_file: null,
            }));
            setFilmThumbPreview(parsed.thumbnailUrl);
        }
    };

    const handleFilmVideoUrlChange = (newUrl) => {
        filmForm.setData((prev) => {
            const updated = { ...prev, video_url: newUrl };
            if (!prev.thumbnail_file) {
                const parsed = parseVideoUrl(newUrl);
                if (parsed.type === 'youtube' && parsed.thumbnailUrl) {
                    if (!prev.thumbnail_url || prev.thumbnail_url.includes('unsplash.com') || prev.thumbnail_url.includes('img.youtube.com')) {
                        updated.thumbnail_url = parsed.thumbnailUrl;
                        setFilmThumbPreview(parsed.thumbnailUrl);
                    }
                }
            }
            return updated;
        });
    };

    const openAddFilmModal = () => {
        setEditingFilm(null);
        setFilmThumbPreview(null);
        filmForm.setData({
            title: '[Brand name ' + (portfolio.length + 1) + ']',
            category: 'Real estate',
            duration: '[0:45]',
            film_subtitle: '[Film title] · Created for [Brand]',
            thumbnail_url: '',
            thumbnail_file: null,
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
            sort_order: portfolio.length + 1,
        });
        if (filmThumbInputRef.current) {
            filmThumbInputRef.current.value = '';
        }
        setFilmModalOpen(true);
    };

    const openEditFilmModal = (film) => {
        setEditingFilm(film);
        const resolvedThumb = getFilmThumbnail(film);
        setFilmThumbPreview(resolvedThumb);
        filmForm.setData({
            title: film.title || '',
            category: film.category && film.category !== 'None' ? film.category : 'Real estate',
            duration: film.duration || '[0:45]',
            film_subtitle: film.film_subtitle || '',
            thumbnail_url: resolvedThumb || '',
            thumbnail_file: null,
            video_url: film.video_url || '',
            sort_order: film.sort_order || 1,
        });
        if (filmThumbInputRef.current) {
            filmThumbInputRef.current.value = '';
        }
        setFilmModalOpen(true);
    };

    const handleFilmSubmit = (e) => {
        e.preventDefault();
        if (editingFilm) {
            filmForm.post(`/admin/portfolio/${editingFilm.id}`, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => setFilmModalOpen(false),
            });
        } else {
            filmForm.post('/admin/portfolio', {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => setFilmModalOpen(false),
            });
        }
    };

    const handleDeleteFilm = (id) => {
        if (confirm('Are you sure you want to remove this film from the portfolio?')) {
            router.delete(`/admin/portfolio/${id}`, { preserveScroll: true });
        }
    };

    const handleBrandSubmit = (e) => {
        e.preventDefault();
        brandForm.post('/admin/brand-logos', {
            preserveScroll: true,
            onSuccess: () => {
                setBrandModalOpen(false);
                brandForm.reset();
            },
        });
    };

    const handleDeleteBrand = (id) => {
        if (confirm('Are you sure you want to remove this brand logo?')) {
            router.delete(`/admin/brand-logos/${id}`, { preserveScroll: true });
        }
    };

    const handleUpdateStatus = (bookingId, newStatus) => {
        router.patch(`/admin/bookings/${bookingId}`, {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const handleDeleteBooking = (bookingId) => {
        if (confirm('Are you sure you want to delete this booking lead?')) {
            router.delete(`/admin/bookings/${bookingId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    // Filtered Films
    const filteredPortfolio = filterCategory === 'All'
        ? portfolio
        : portfolio.filter((p) => p.category?.toLowerCase() === filterCategory.toLowerCase());

    // Paginated Curated Films
    const totalFilmPages = Math.max(1, Math.ceil(filteredPortfolio.length / filmsPerPage));
    const safeFilmPage = Math.min(filmCurrentPage, totalFilmPages);
    const filmStartIndex = (safeFilmPage - 1) * filmsPerPage;
    const filmEndIndex = Math.min(filmStartIndex + filmsPerPage, filteredPortfolio.length);
    const paginatedPortfolio = filteredPortfolio.slice(filmStartIndex, filmEndIndex);

    // Filtered Leads
    const filteredBookings = leadStatusFilter === 'All'
        ? bookings
        : bookings.filter((b) => b.status === leadStatusFilter);

    // Paginated Leads
    const totalLeadPages = Math.max(1, Math.ceil(filteredBookings.length / leadsPerPage));
    const safeLeadPage = Math.min(leadCurrentPage, totalLeadPages);
    const leadStartIndex = (safeLeadPage - 1) * leadsPerPage;
    const leadEndIndex = Math.min(leadStartIndex + leadsPerPage, filteredBookings.length);
    const paginatedBookings = filteredBookings.slice(leadStartIndex, leadEndIndex);

    // Sidebar navigation items
    const navItems = [
        { 
            id: 'home', 
            label: 'Home Page CMS', 
            icon: Home, 
            badge: null,
            subItems: [
                { id: 'hero', label: 'Hero Section', icon: Sliders },
                { id: 'behind', label: 'Behind The Film', icon: Sparkles },
                { id: 'about', label: 'About & Team', icon: Users, badge: teamMembers.length },
                { id: 'services', label: 'Other Services', icon: Layers, badge: services.length },
            ]
        },
        { 
            id: 'work', 
            label: 'Work Page CMS', 
            icon: Film, 
            badge: portfolio.length,
            subItems: [
                { id: 'hero', label: 'Hero & Header', icon: Sliders },
                { id: 'portfolio', label: 'Curated Films', icon: Film, badge: portfolio.length },
            ]
        },
        { 
            id: 'contact', 
            label: 'Contact Page CMS', 
            icon: MessageSquare, 
            badge: null 
        },
        { id: 'leads', label: 'Inquiries CRM', icon: Mail, badge: stats?.new_bookings > 0 ? stats.new_bookings : null, badgeColor: 'orange' },
        { id: 'brands', label: 'Brand Partners', icon: ImageIcon, badge: brandLogos.length },
        { id: 'company', label: 'Company Details & Logo', icon: Building2, badge: null },
    ];

    return (
        <div className="min-h-screen bg-[#08090c] text-white flex font-sans selection:bg-[#14f1d9] selection:text-black">
            <Head title={`Admin Dashboard — ${activeCompany?.company_name || 'Loops Integrated'}`} />

            {/* Mobile Sidebar Backdrop */}
            {mobileSidebarOpen && (
                <div 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                />
            )}

            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-[#0c0e12] border-r border-white/10 flex flex-col justify-between shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Brand Logo Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14f1d9] via-[#00f2d5] to-[#ff7a18] p-[1.5px] shadow-[0_0_15px_rgba(20,241,217,0.2)]">
                                <div className="w-full h-full bg-[#0c0e12] rounded-[10px] flex items-center justify-center">
                                    <span className="text-base font-black text-[#14f1d9]">
                                        {(companyForm.data.logo_text_prefix || 'L')[0]}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-base font-black tracking-tight text-white leading-none">
                                    {companyForm.data.logo_type === 'image' && (logoFilePreview || companyForm.data.logo_image_url) ? (
                                        <img src={logoFilePreview || companyForm.data.logo_image_url} alt="Logo" className="h-7 max-w-[130px] object-contain" />
                                    ) : (
                                        <>
                                            {companyForm.data.logo_text_prefix || 'Loops'}{' '}
                                            <span className="text-[#14f1d9]">{companyForm.data.logo_text_suffix || 'Integrated'}</span>
                                        </>
                                    )}
                                </div>
                                <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mt-1 inline-block">
                                    Admin Suite
                                </span>
                            </div>
                        </div>

                        {/* Mobile close button */}
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="md:hidden text-neutral-400 hover:text-white p-1 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Menu Links on the Left */}
                    <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Management
                        </div>

                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeTab === item.id;
                            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);

                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMobileSidebarOpen(false);
                                        }}
                                        type="button"
                                        className={`w-full cursor-pointer px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between group ${
                                            isActive
                                                ? 'bg-white text-black font-bold shadow-lg'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent 
                                                size={17} 
                                                className={isActive ? 'text-black' : 'text-neutral-400 group-hover:text-white transition-colors'} 
                                            />
                                            <span>{item.label}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {item.badge !== null && (
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                    isActive
                                                        ? 'bg-black/15 text-black'
                                                        : item.badgeColor === 'orange'
                                                        ? 'bg-[#ff7a18] text-black shadow-[0_0_8px_rgba(255,122,24,0.4)]'
                                                        : 'bg-white/10 text-neutral-300'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {hasSubItems && (
                                                <ChevronDown 
                                                    size={14} 
                                                    className={`transition-transform duration-200 ${
                                                        isActive ? 'text-black rotate-0' : 'text-neutral-500 -rotate-90 group-hover:text-neutral-300'
                                                    }`} 
                                                />
                                            )}
                                        </div>
                                    </button>

                                    {/* Sub-items for Home Page CMS & Work Page CMS */}
                                    {hasSubItems && isActive && (
                                        <div className="pl-4 pr-1 py-1 space-y-1 border-l border-white/10 ml-5">
                                            {item.subItems.map((sub) => {
                                                const SubIcon = sub.icon;
                                                const isSubActive = item.id === 'home' ? (homeTab === sub.id) : (workTab === sub.id);
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveTab(item.id);
                                                            if (item.id === 'home') {
                                                                setHomeTab(sub.id);
                                                            } else if (item.id === 'work') {
                                                                setWorkTab(sub.id);
                                                            }
                                                            setMobileSidebarOpen(false);
                                                        }}
                                                        className={`w-full cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${
                                                            isSubActive
                                                                ? 'bg-[#14f1d9]/15 text-[#14f1d9] font-bold border border-[#14f1d9]/30 shadow-[0_0_10px_rgba(20,241,217,0.1)]'
                                                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <SubIcon 
                                                                size={13} 
                                                                className={isSubActive ? 'text-[#14f1d9]' : 'text-neutral-500 group-hover:text-neutral-300'} 
                                                            />
                                                            <span>{sub.label}</span>
                                                        </div>
                                                        {sub.badge !== undefined && sub.badge > 0 && (
                                                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                                                isSubActive ? 'bg-[#14f1d9]/25 text-[#14f1d9]' : 'bg-white/5 text-neutral-400'
                                                            }`}>
                                                                {sub.badge}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Live Site Preview Links */}
                        <div className="pt-8 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Live Website
                        </div>

                        <Link
                            href={appUrl('/')}
                            target="_blank"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition flex items-center justify-between group"
                        >
                            <span>Home Page</span>
                            <ExternalLink size={13} className="text-neutral-500 group-hover:text-white" />
                        </Link>

                        <Link
                            href={appUrl('/work')}
                            target="_blank"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition flex items-center justify-between group"
                        >
                            <span>Our Work Page</span>
                            <ExternalLink size={13} className="text-neutral-500 group-hover:text-white" />
                        </Link>

                        <Link
                            href={appUrl('/contact')}
                            target="_blank"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition flex items-center justify-between group"
                        >
                            <span>Contact Us Page</span>
                            <ExternalLink size={13} className="text-neutral-500 group-hover:text-white" />
                        </Link>
                    </div>
                </div>

                {/* Sidebar Bottom Profile & Logout */}
                <div className="p-4 border-t border-white/10 bg-[#090b0e]">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">
                                {auth?.user?.name || 'Administrator'}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate font-mono">
                                {auth?.user?.email || 'admin@loopsdubai.com'}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            type="button"
                            title="Sign Out"
                            className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA ON THE RIGHT */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Mobile Top Header */}
                <div className="md:hidden sticky top-0 z-30 bg-[#0d0f14]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        className="text-white p-1 rounded-lg hover:bg-white/10"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="text-sm font-bold text-white">
                        {companyForm.data.logo_text_prefix || 'Loops'} <span className="text-[#14f1d9]">{companyForm.data.logo_text_suffix || 'Integrated'}</span> Admin
                    </div>

                    <button
                        onClick={handleLogout}
                        type="button"
                        className="text-xs text-red-400 p-1"
                    >
                        <LogOut size={16} />
                    </button>
                </div>

                {/* Flash Message Banner */}
                {flash?.success && (
                    <div className="bg-[#14f1d9]/10 border-b border-[#14f1d9]/20 px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#14f1d9]">
                        <CheckCircle2 size={16} />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Main Content Body */}
                <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 w-full max-w-7xl">
                    {/* Top Stats Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-[#101217] border border-white/10 rounded-xl p-5 hover:border-white/20 transition shadow-lg">
                            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                                <span>Client Inquiries</span>
                                <Mail size={16} className="text-[#14f1d9]" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-white">
                                {stats?.total_bookings || bookings.length}
                            </div>
                            <span className="text-[11px] text-neutral-500">From landing & work modals</span>
                        </div>

                        <div className="bg-[#101217] border border-white/10 rounded-xl p-5 hover:border-white/20 transition shadow-lg">
                            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                                <span>New Leads</span>
                                <Sparkles size={16} className="text-[#ff7a18]" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-[#ff7a18]">
                                {stats?.new_bookings || 0}
                            </div>
                            <span className="text-[11px] text-neutral-500">Awaiting creative response</span>
                        </div>

                        <div className="bg-[#101217] border border-white/10 rounded-xl p-5 hover:border-white/20 transition shadow-lg">
                            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                                <span>Curated Films</span>
                                <Film size={16} className="text-cyan-400" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-white">
                                {portfolio.length}
                            </div>
                            <span className="text-[11px] text-neutral-500">Across 4 sector categories</span>
                        </div>

                        <div className="bg-[#101217] border border-white/10 rounded-xl p-5 hover:border-white/20 transition shadow-lg">
                            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                                <span>Brand Partners</span>
                                <Building2 size={16} className="text-emerald-400" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-white">
                                {brandLogos.length}
                            </div>
                            <span className="text-[11px] text-neutral-500">In "Created For" section</span>
                        </div>
                    </div>

                    {/* TAB: HOME PAGE CMS */}
                    {activeTab === 'home' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Home CMS Navigation Header & Section Switcher */}
                            <div className="bg-[#101217] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] shadow-[0_0_10px_#14f1d9]"></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#14f1d9]">
                                            Home Page Sections CMS
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        Home Landing Page Editor
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                                        Select a section below to update live headings, dual comparison frames, leadership team cards, or services.
                                    </p>
                                </div>

                                {/* Section Switcher Tabs */}
                                <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#090a0d] border border-white/10 self-start lg:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setHomeTab('hero')}
                                        className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                            homeTab === 'hero'
                                                ? 'bg-white text-black shadow-md'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Sliders size={14} className={homeTab === 'hero' ? 'text-black' : 'text-[#14f1d9]'} />
                                        <span>Hero Section</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setHomeTab('behind')}
                                        className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                            homeTab === 'behind'
                                                ? 'bg-white text-black shadow-md'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Sparkles size={14} className={homeTab === 'behind' ? 'text-black' : 'text-[#14f1d9]'} />
                                        <span>Behind The Film</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setHomeTab('about')}
                                        className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                            homeTab === 'about'
                                                ? 'bg-white text-black shadow-md'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Users size={14} className={homeTab === 'about' ? 'text-black' : 'text-[#f7a838]'} />
                                        <span>About & Team</span>
                                        {teamMembers.length > 0 && (
                                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                                homeTab === 'about' ? 'bg-black/15 text-black' : 'bg-white/10 text-neutral-300'
                                            }`}>
                                                {teamMembers.length}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setHomeTab('services')}
                                        className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                                            homeTab === 'services'
                                                ? 'bg-white text-black shadow-md'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Layers size={14} className={homeTab === 'services' ? 'text-black' : 'text-[#14f1d9]'} />
                                        <span>Other Services</span>
                                        {services.length > 0 && (
                                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                                homeTab === 'services' ? 'bg-black/15 text-black' : 'bg-white/10 text-neutral-300'
                                            }`}>
                                                {services.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* HOME SECTION 1: Hero CMS Editor */}
                            {homeTab === 'hero' && (
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Hero Section Live Content</h2>
                                            <p className="text-xs text-neutral-400 mt-1">
                                                Modifications will directly update the public landing page in real-time.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleHeroSubmit}
                                            disabled={heroForm.processing}
                                            className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-1.5 transition shadow disabled:opacity-50 self-start sm:self-auto"
                                        >
                                            <Save size={15} />
                                            <span>Save Changes</span>
                                        </button>
                                    </div>

                                    <form onSubmit={handleHeroSubmit} className="space-y-6">
                                        {/* Badges */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-900/60 border border-white/5">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Badge Left Tag (Cyan Dot)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.badge_tag_1}
                                                    onChange={(e) => heroForm.setData('badge_tag_1', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Badge Right Tag (Orange Dot)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.badge_tag_2}
                                                    onChange={(e) => heroForm.setData('badge_tag_2', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                        </div>

                                        {/* Headlines */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Headline Line 1 (White text: e.g. "AI-powered video.")
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.headline_1}
                                                    onChange={(e) => heroForm.setData('headline_1', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Headline Line 2 (Orange + White text: e.g. "Human-led creative.")
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.headline_2}
                                                    onChange={(e) => heroForm.setData('headline_2', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                        </div>

                                        {/* Subtitle */}
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                Hero Description / Subtitle
                                            </label>
                                            <textarea
                                                rows="3"
                                                value={heroForm.data.subtitle}
                                                onChange={(e) => heroForm.setData('subtitle', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                            />
                                        </div>

                                        {/* CTAs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Primary Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.primary_cta_text}
                                                    onChange={(e) => heroForm.setData('primary_cta_text', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Secondary Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.secondary_cta_text}
                                                    onChange={(e) => heroForm.setData('secondary_cta_text', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                        </div>

                                        {/* Reel tag and video URL */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Top-Right Reel Watermark Tag
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.reel_placeholder_text}
                                                    onChange={(e) => heroForm.setData('reel_placeholder_text', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                                    Reel Background Video URL (MP4 stream)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={heroForm.data.reel_video_url}
                                                    onChange={(e) => heroForm.setData('reel_video_url', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#14f1d9]"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* HOME SECTION 2: BEHIND THE FILM CMS */}
                            {homeTab === 'behind' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {/* Page Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]"></span>
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#14f1d9]">
                                                    Home Page Section CMS
                                                </span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                                Behind The Film CMS
                                            </h2>
                                            <p className="text-sm text-neutral-400 mt-1">
                                                Manage the dual comparison section highlighting human sketch to finished AI production.
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleBehindSubmit}
                                            disabled={behindForm.processing}
                                            type="button"
                                            className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
                                        >
                                            <Save size={16} />
                                            <span>{behindForm.processing ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>

                                    <form onSubmit={handleBehindSubmit} className="space-y-8">
                                        {/* SECTION 1: Section Header & Headings */}
                                        <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                            <div className="pb-4 border-b border-white/10">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Sparkles size={18} className="text-[#14f1d9]" />
                                                    <span>Section Titles & Badge</span>
                                                </h3>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Configure the category tag and headline rendered above the comparison cards.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#14f1d9]"></span>
                                                        <span>Category Tag (Cyan Accent)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={behindForm.data.tag}
                                                        onChange={(e) => behindForm.setData('tag', e.target.value)}
                                                        placeholder="BEHIND THE FILM"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Displayed in uppercase cyan above the headline.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Headline Line 1
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={behindForm.data.title_line_1}
                                                        onChange={(e) => behindForm.setData('title_line_1', e.target.value)}
                                                        placeholder="From human sketch to finished"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Top line of the main section heading.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Headline Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={behindForm.data.title_line_2}
                                                        onChange={(e) => behindForm.setData('title_line_2', e.target.value)}
                                                        placeholder="film."
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Second line of the heading (optional).
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: Dual Comparison Cards */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Left Card: Human Concept */}
                                            <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
                                                <div className="space-y-5">
                                                    <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-[#f7a838] shadow-[0_0_8px_#f7a838]"></span>
                                                            <h3 className="text-base font-bold text-white">Left Card: Human Concept</h3>
                                                        </div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f7a838]/10 text-[#f7a838] border border-[#f7a838]/20">
                                                            Concept Frame
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Card Bottom Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={behindForm.data.concept_label}
                                                            onChange={(e) => behindForm.setData('concept_label', e.target.value)}
                                                            placeholder="Human concept"
                                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                        />
                                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                                            Rendered in warm orange (#f7a838) below the frame.
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Fallback Placeholder Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={behindForm.data.concept_placeholder_text}
                                                            onChange={(e) => behindForm.setData('concept_placeholder_text', e.target.value)}
                                                            placeholder="[Storyboard / reference frames]"
                                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838] transition font-mono text-xs"
                                                        />
                                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                                            Shown inside the dashed card if no image is uploaded.
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Image File Upload or URL
                                                        </label>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="file"
                                                                    ref={conceptFileInputRef}
                                                                    onChange={handleConceptFileChange}
                                                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                                                    className="hidden"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => conceptFileInputRef.current?.click()}
                                                                    className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition"
                                                                >
                                                                    <UploadCloud size={15} className="text-[#f7a838]" />
                                                                    <span>Upload Image File</span>
                                                                </button>

                                                                {(conceptFilePreview || behindForm.data.concept_image_url) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleRemoveConceptImage}
                                                                        className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                        <span>Reset to Placeholder</span>
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={behindForm.data.concept_image_url}
                                                                    onChange={(e) => {
                                                                        behindForm.setData('concept_image_url', e.target.value);
                                                                        setConceptFilePreview(null);
                                                                    }}
                                                                    placeholder="Or paste external image URL: https://..."
                                                                    className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-xs focus:outline-none focus:border-[#f7a838] transition font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Preview Box */}
                                                <div className="mt-6 pt-5 border-t border-white/10">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                                                        Card Preview
                                                    </span>
                                                    <div className="w-full aspect-[16/10] rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center p-4 overflow-hidden relative">
                                                        {conceptFilePreview || behindForm.data.concept_image_url ? (
                                                            <img
                                                                src={conceptFilePreview || behindForm.data.concept_image_url}
                                                                alt="Concept Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-mono text-neutral-400 text-center">
                                                                {behindForm.data.concept_placeholder_text || '[Storyboard / reference frames]'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 text-xs font-semibold text-[#f7a838]">
                                                        {behindForm.data.concept_label || 'Human concept'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Card: AI Production, Human Finish */}
                                            <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
                                                <div className="space-y-5">
                                                    <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]"></span>
                                                            <h3 className="text-base font-bold text-white">Right Card: Finished Film</h3>
                                                        </div>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14f1d9]/10 text-[#14f1d9] border border-[#14f1d9]/20">
                                                            AI + Human Finish
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Card Bottom Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={behindForm.data.finish_label}
                                                            onChange={(e) => behindForm.setData('finish_label', e.target.value)}
                                                            placeholder="AI production, human finish"
                                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                        />
                                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                                            Rendered in bright cyan (#14f1d9) below the frame.
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Fallback Placeholder Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={behindForm.data.finish_placeholder_text}
                                                            onChange={(e) => behindForm.setData('finish_placeholder_text', e.target.value)}
                                                            placeholder="[Final film frame]"
                                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition font-mono text-xs"
                                                        />
                                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                                            Shown inside the dashed card if no image is uploaded.
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                            Image File Upload or URL
                                                        </label>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="file"
                                                                    ref={finishFileInputRef}
                                                                    onChange={handleFinishFileChange}
                                                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                                                    className="hidden"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => finishFileInputRef.current?.click()}
                                                                    className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition"
                                                                >
                                                                    <UploadCloud size={15} className="text-[#14f1d9]" />
                                                                    <span>Upload Image File</span>
                                                                </button>

                                                                {(finishFilePreview || behindForm.data.finish_image_url) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleRemoveFinishImage}
                                                                        className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                        <span>Reset to Placeholder</span>
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={behindForm.data.finish_image_url}
                                                                    onChange={(e) => {
                                                                        behindForm.setData('finish_image_url', e.target.value);
                                                                        setFinishFilePreview(null);
                                                                    }}
                                                                    placeholder="Or paste external image URL: https://..."
                                                                    className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-xs focus:outline-none focus:border-[#14f1d9] transition font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Preview Box */}
                                                <div className="mt-6 pt-5 border-t border-white/10">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                                                        Card Preview
                                                    </span>
                                                    <div className="w-full aspect-[16/10] rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center p-4 overflow-hidden relative">
                                                        {finishFilePreview || behindForm.data.finish_image_url ? (
                                                            <img
                                                                src={finishFilePreview || behindForm.data.finish_image_url}
                                                                alt="Finish Preview"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-mono text-neutral-400 text-center">
                                                                {behindForm.data.finish_placeholder_text || '[Final film frame]'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 text-xs font-semibold text-[#14f1d9]">
                                                        {behindForm.data.finish_label || 'AI production, human finish'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 3: Live Website Simulation Box */}
                                        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles size={16} className="text-[#14f1d9]" />
                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                        Live Section Simulation (As Seen on Home Page)
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-neutral-500">
                                                    Full width container on #080808 background
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                                                    {behindForm.data.tag || 'BEHIND THE FILM'}
                                                </span>
                                                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                                    <span className="block">{behindForm.data.title_line_1 || 'From human sketch to finished'}</span>
                                                    {behindForm.data.title_line_2 && (
                                                        <span className="block">{behindForm.data.title_line_2}</span>
                                                    )}
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                                <div>
                                                    <div className="w-full aspect-[16/10] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center p-6 overflow-hidden">
                                                        {conceptFilePreview || behindForm.data.concept_image_url ? (
                                                            <img
                                                                src={conceptFilePreview || behindForm.data.concept_image_url}
                                                                alt="Concept"
                                                                className="w-full h-full object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <span className="text-xs sm:text-sm font-medium text-neutral-400">
                                                                {behindForm.data.concept_placeholder_text || '[Storyboard / reference frames]'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 text-xs sm:text-sm font-semibold text-[#f7a838]">
                                                        {behindForm.data.concept_label || 'Human concept'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="w-full aspect-[16/10] rounded-2xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center p-6 overflow-hidden">
                                                        {finishFilePreview || behindForm.data.finish_image_url ? (
                                                            <img
                                                                src={finishFilePreview || behindForm.data.finish_image_url}
                                                                alt="Finished"
                                                                className="w-full h-full object-cover rounded-xl"
                                                            />
                                                        ) : (
                                                            <span className="text-xs sm:text-sm font-medium text-neutral-400">
                                                                {behindForm.data.finish_placeholder_text || '[Final film frame]'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 text-xs sm:text-sm font-semibold text-[#14f1d9]">
                                                        {behindForm.data.finish_label || 'AI production, human finish'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Sticky/Fixed Bar for Easy Saving */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <span className="text-xs text-neutral-400">
                                                All edits persist directly to MySQL and sync to the live website instantly.
                                            </span>

                                            <button
                                                type="submit"
                                                disabled={behindForm.processing}
                                                className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center gap-2 transition shadow-[0_0_25px_rgba(20,241,217,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                            >
                                                <Save size={16} />
                                                <span>{behindForm.processing ? 'Saving Changes...' : 'Save Behind The Film Section'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* HOME SECTION 3: ABOUT & TEAM CMS */}
                            {homeTab === 'about' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {/* Page Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-[#f7a838] shadow-[0_0_8px_#f7a838]"></span>
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#f7a838]">
                                                    Home Page Section CMS
                                                </span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                                About & Team CMS
                                            </h2>
                                            <p className="text-sm text-neutral-400 mt-1">
                                                Manage the "Built for global brands." section copy and leadership team photo cards.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={openAddTeamModal}
                                                className="cursor-pointer bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition border border-white/10"
                                            >
                                                <Plus size={15} className="text-[#14f1d9]" />
                                                <span>Add Team Member</span>
                                            </button>

                                            <button
                                                onClick={handleAboutSubmit}
                                                disabled={aboutForm.processing}
                                                type="button"
                                                className="cursor-pointer bg-[#f7a838] hover:bg-[#e09328] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(247,168,56,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
                                            >
                                                <Save size={16} />
                                                <span>{aboutForm.processing ? 'Saving...' : 'Save About Copy'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* SECTION 1: About Section Headings & Copy Form */}
                                    <form onSubmit={handleAboutSubmit} className="space-y-6">
                                        <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                            <div className="pb-4 border-b border-white/10">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Building2 size={18} className="text-[#f7a838]" />
                                                    <span>Section Headings & Description</span>
                                                </h3>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Configure the category tag, headline, and bio narrative displayed on the left column.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#f7a838]"></span>
                                                        <span>Category Tag (Amber Accent)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={aboutForm.data.tag}
                                                        onChange={(e) => aboutForm.setData('tag', e.target.value)}
                                                        placeholder="ABOUT"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Rendered in uppercase amber (#f7a838) above the headline.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Section Headline
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={aboutForm.data.headline}
                                                        onChange={(e) => aboutForm.setData('headline', e.target.value)}
                                                        placeholder="Built for global brands."
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Main bold headline for the about section.
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                    Narrative Description Paragraph
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    required
                                                    value={aboutForm.data.description}
                                                    onChange={(e) => aboutForm.setData('description', e.target.value)}
                                                    placeholder="[Two to three sentences on the team's international experience...]"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                />
                                                <span className="text-[11px] text-neutral-500 mt-1 block">
                                                    The story explaining your creative leadership and international market experience.
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-end pt-3">
                                                <button
                                                    type="submit"
                                                    disabled={aboutForm.processing}
                                                    className="cursor-pointer bg-[#f7a838] hover:bg-[#e09328] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition disabled:opacity-50"
                                                >
                                                    <Save size={15} />
                                                    <span>{aboutForm.processing ? 'Saving...' : 'Save Section Copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* SECTION 2: Team Members & Leadership Cards */}
                                    <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Users size={18} className="text-[#14f1d9]" />
                                                    <h3 className="text-lg font-bold text-white">Team Members & Leadership</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                                                        {teamMembers.length}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Shown in the 2x2 grid on the right side of the About section. Upload photos or keep [Photo] placeholders.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={openAddTeamModal}
                                                className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <Plus size={16} />
                                                <span>Add Team Member</span>
                                            </button>
                                        </div>

                                        {teamMembers.length === 0 ? (
                                            <div className="p-12 text-center rounded-xl border border-dashed border-white/10">
                                                <Users size={32} className="mx-auto text-neutral-600 mb-3" />
                                                <p className="text-sm text-neutral-400 font-medium">No team members added yet.</p>
                                                <p className="text-xs text-neutral-500 mt-1">Click "Add Team Member" above to create your first card.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                                                {teamMembers.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
                                                    >
                                                        <div>
                                                            {/* Photo Container */}
                                                            <div className="w-full aspect-[4/5] rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center overflow-hidden mb-3.5 relative">
                                                                {member.photo_url ? (
                                                                    <img
                                                                        src={member.photo_url}
                                                                        alt={member.name}
                                                                        className="w-full h-full object-cover rounded-lg filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs font-mono text-neutral-400">
                                                                        [Photo]
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h4 className="text-sm font-bold text-white group-hover:text-[#14f1d9] transition-colors truncate">
                                                                {member.name || '[Name]'}
                                                            </h4>
                                                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                                                                {member.role || '[Role]'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                                                            <span className="text-[10px] text-neutral-500 font-mono">
                                                                Order #{member.sort_order || 1}
                                                            </span>

                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditTeamModal(member)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                                                    title="Edit member"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteTeamMember(member.id)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                                                    title="Delete member"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION 3: Live Website Simulation Box */}
                                    <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} className="text-[#f7a838]" />
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                    Live Section Simulation (As Seen on Home Page)
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-neutral-500">
                                                Full width container on #080808 background
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">
                                            {/* Left Column */}
                                            <div className="lg:col-span-5 space-y-4">
                                                <span className="block text-xs font-bold tracking-[0.2em] text-[#f7a838] uppercase">
                                                    {aboutForm.data.tag || 'ABOUT'}
                                                </span>
                                                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                                    {aboutForm.data.headline || 'Built for global brands.'}
                                                </h2>
                                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line pt-2">
                                                    {aboutForm.data.description || "[Two to three sentences on the team's international experience, the markets you have worked in and why creative direction stays human.]"}
                                                </p>
                                            </div>

                                            {/* Right Column: 2x2 Grid of Team Members */}
                                            <div className="lg:col-span-7">
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {(teamMembers.length > 0 ? teamMembers.slice(0, 4) : [
                                                        { id: 1, name: '[Name]', role: '[Role]', photo_url: null },
                                                        { id: 2, name: '[Name]', role: '[Role]', photo_url: null },
                                                        { id: 3, name: '[Name]', role: '[Role]', photo_url: null },
                                                        { id: 4, name: '[Name]', role: '[Role]', photo_url: null },
                                                    ]).map((member, idx) => (
                                                        <div key={member.id || idx} className="flex flex-col">
                                                            <div className="w-full aspect-[4/5] rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center p-3 overflow-hidden">
                                                                {member.photo_url ? (
                                                                    <img
                                                                        src={member.photo_url}
                                                                        alt={member.name}
                                                                        className="w-full h-full object-cover rounded-lg filter grayscale"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs font-mono text-neutral-400">
                                                                        [Photo]
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-2.5">
                                                                <div className="text-xs font-bold text-white truncate">
                                                                    {member.name || '[Name]'}
                                                                </div>
                                                                <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                                                                    {member.role || '[Role]'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* HOME SECTION 4: OTHER SERVICES CMS */}
                            {homeTab === 'services' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {/* Page Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]"></span>
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#14f1d9]">
                                                    Home Page Section CMS
                                                </span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                                Other Services CMS
                                            </h2>
                                            <p className="text-sm text-neutral-400 mt-1">
                                                Manage the "Beyond video, we support the wider brand." headings and auxiliary service offerings.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={openAddServiceModal}
                                                className="cursor-pointer bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition border border-white/10"
                                            >
                                                <Plus size={15} className="text-[#14f1d9]" />
                                                <span>Add New Service</span>
                                            </button>

                                            <button
                                                onClick={handleServicesSettingSubmit}
                                                disabled={servicesForm.processing}
                                                type="button"
                                                className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
                                            >
                                                <Save size={16} />
                                                <span>{servicesForm.processing ? 'Saving...' : 'Save Services Copy'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* SECTION 1: Services Section Headings Form */}
                                    <form onSubmit={handleServicesSettingSubmit} className="space-y-6">
                                        <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                            <div className="pb-4 border-b border-white/10">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Layers size={18} className="text-[#14f1d9]" />
                                                    <span>Section Headings & Tag</span>
                                                </h3>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Configure the category tag and 2-line headline displayed above the service cards.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                                                        <span>Category Tag (Uppercase Muted)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={servicesForm.data.tag}
                                                        onChange={(e) => servicesForm.setData('tag', e.target.value)}
                                                        placeholder="OUR OTHER SERVICES"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Category eyebrow tag rendered in uppercase.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Headline Line 1
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={servicesForm.data.headline_1}
                                                        onChange={(e) => servicesForm.setData('headline_1', e.target.value)}
                                                        placeholder="Beyond video, we support the wider"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        First line of the section heading.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Headline Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={servicesForm.data.headline_2}
                                                        onChange={(e) => servicesForm.setData('headline_2', e.target.value)}
                                                        placeholder="brand."
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Second line of the section heading (optional).
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end pt-3">
                                                <button
                                                    type="submit"
                                                    disabled={servicesForm.processing}
                                                    className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition disabled:opacity-50"
                                                >
                                                    <Save size={15} />
                                                    <span>{servicesForm.processing ? 'Saving...' : 'Save Section Headings'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* SECTION 2: Services Offering Cards */}
                                    <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Layers size={18} className="text-[#14f1d9]" />
                                                    <h3 className="text-lg font-bold text-white">Service Offering Cards</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                                                        {services.length}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    The 3 cards displayed side-by-side beneath the section headline on the home page.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={openAddServiceModal}
                                                className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <Plus size={16} />
                                                <span>Add New Service</span>
                                            </button>
                                        </div>

                                        {services.length === 0 ? (
                                            <div className="p-12 text-center rounded-xl border border-dashed border-white/10">
                                                <Layers size={32} className="mx-auto text-neutral-600 mb-3" />
                                                <p className="text-sm text-neutral-400 font-medium">No service cards added yet.</p>
                                                <p className="text-xs text-neutral-500 mt-1">Click "Add New Service" above to create your first card.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {services.map((service) => (
                                                    <div
                                                        key={service.id}
                                                        className="bg-[#0d0e12] border border-white/10 hover:border-white/20 rounded-2xl p-6 min-h-[190px] flex flex-col justify-between group transition-all duration-300"
                                                    >
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white group-hover:text-[#14f1d9] transition-colors mb-2">
                                                                {service.title}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                                                                {service.description}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                                                            <span className="text-[10px] text-neutral-500 font-mono">
                                                                Order #{service.sort_order || 1}
                                                            </span>

                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditServiceModal(service)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                                                    title="Edit service"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteServiceItem(service.id)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                                                    title="Delete service"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION 3: Live Website Simulation Box */}
                                    <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} className="text-[#14f1d9]" />
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                                    Live Section Simulation (As Seen on Home Page)
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-neutral-500">
                                                Full width container on #080808 background
                                            </span>
                                        </div>

                                        <div className="max-w-3xl mb-4 pt-2">
                                            <span className="block text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-3">
                                                {servicesForm.data.tag || 'OUR OTHER SERVICES'}
                                            </span>
                                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                                <span className="block">{servicesForm.data.headline_1 || 'Beyond video, we support the wider'}</span>
                                                {servicesForm.data.headline_2 && (
                                                    <span className="block">{servicesForm.data.headline_2}</span>
                                                )}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                            {(services.length > 0 ? services : [
                                                { id: 1, title: 'Brand and creative strategy', description: '[Two-line description to confirm with the team.]' },
                                                { id: 2, title: 'Digital performance', description: '[Two-line description to confirm with the team.]' },
                                                { id: 3, title: 'Experiences and events', description: '[Two-line description to confirm with the team.]' },
                                            ]).map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="bg-[#0d0e12] border border-white/10 rounded-2xl p-6 min-h-[160px] flex flex-col justify-between"
                                                >
                                                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">
                                                        {service.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: WORK PAGE CMS */}
                    {(activeTab === 'work' || activeTab === 'portfolio') && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Work CMS Navigation Header & Section Switcher */}
                            <div className="bg-[#101217] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] shadow-[0_0_10px_#14f1d9]"></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#14f1d9]">
                                            Work Page CMS
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        Our Work Page Editor
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                                        Edit the AI creative headline, tags, and services link, or manage the curated portfolio films grid.
                                    </p>
                                </div>

                                {/* Section Switcher Tabs */}
                                <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#090a0d] border border-white/10 self-start lg:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setWorkTab('hero')}
                                        className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                            workTab === 'hero'
                                                ? 'bg-[#14f1d9] text-black shadow-[0_0_15px_rgba(20,241,217,0.3)]'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <Sliders size={14} />
                                        <span>Hero & Header Section</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setWorkTab('portfolio')}
                                        className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                            workTab === 'portfolio'
                                                ? 'bg-[#14f1d9] text-black shadow-[0_0_15px_rgba(20,241,217,0.3)]'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <Film size={14} />
                                        <span>Curated Films</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                            workTab === 'portfolio' ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-300'
                                        }`}>
                                            {portfolio.length}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* SUB-TAB 1: WORK HERO & HEADER CMS */}
                            {workTab === 'hero' && (
                                <div className="space-y-8">
                                    {/* Work Hero Edit Form */}
                                    <form onSubmit={handleWorkSubmit} className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                            <div>
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Sliders size={18} className="text-[#14f1d9]" />
                                                    <span>Work Page Headline & Badges</span>
                                                </h3>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Configure the top hero typography, accent highlighted text, status badges, and services CTA button.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={workForm.processing}
                                                className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] disabled:opacity-50"
                                            >
                                                <Save size={15} />
                                                <span>{workForm.processing ? 'Saving...' : 'Save Work Header'}</span>
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Eyebrow Tag */}
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                    Section Eyebrow Tag
                                                </label>
                                                <input
                                                    type="text"
                                                    value={workForm.data.tag}
                                                    onChange={(e) => workForm.setData('tag', e.target.value)}
                                                    placeholder="OUR WORK"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                                <span className="text-[11px] text-neutral-500 mt-1 block">
                                                    Small uppercase cyan tracking tag displayed above the main headline.
                                                </span>
                                            </div>

                                            {/* 3-Part Headline Construction */}
                                            <div className="p-5 rounded-xl bg-[#090a0d] border border-white/10 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                                                        3-Part Main Headline Builder
                                                    </span>
                                                    <span className="text-[11px] text-neutral-400">
                                                        Prefix (White) + Highlight (Amber Accent) + Suffix (White)
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-400 mb-1">
                                                            Headline Prefix
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={workForm.data.headline_prefix}
                                                            onChange={(e) => workForm.setData('headline_prefix', e.target.value)}
                                                            placeholder="Our"
                                                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-[#f7a838] mb-1">
                                                            Headline Highlight (Amber Accent)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={workForm.data.headline_highlight}
                                                            onChange={(e) => workForm.setData('headline_highlight', e.target.value)}
                                                            placeholder="AI creative"
                                                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-[#f7a838]/40 text-[#f7a838] font-bold text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-neutral-400 mb-1">
                                                            Headline Suffix
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={workForm.data.headline_suffix}
                                                            onChange={(e) => workForm.setData('headline_suffix', e.target.value)}
                                                            placeholder="world."
                                                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subtitle */}
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                    Work Page Subtitle / Instructions
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={workForm.data.subtitle}
                                                    onChange={(e) => workForm.setData('subtitle', e.target.value)}
                                                    placeholder="Choose a sector. Every film is AI-generated and human-directed."
                                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                                <span className="text-[11px] text-neutral-500 mt-1 block">
                                                    Paragraph explaining sector filtering and AI + human curation.
                                                </span>
                                            </div>

                                            {/* Status Badge Pills */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]"></span>
                                                        <span>Status Badge 1 (Cyan Dot)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={workForm.data.badge_tag_1}
                                                        onChange={(e) => workForm.setData('badge_tag_1', e.target.value)}
                                                        placeholder="AI-generated"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[#ff7a18] shadow-[0_0_8px_#ff7a18]"></span>
                                                        <span>Status Badge 2 (Orange Dot)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={workForm.data.badge_tag_2}
                                                        onChange={(e) => workForm.setData('badge_tag_2', e.target.value)}
                                                        placeholder="Human-directed"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                </div>
                                            </div>

                                            {/* Services Link Button in Filter Bar */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/10">
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Filter Bar Services Button Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={workForm.data.services_cta_text}
                                                        onChange={(e) => workForm.setData('services_cta_text', e.target.value)}
                                                        placeholder="Our other services"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        Right-aligned button on the sector filter bar.
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                        Filter Bar Services Button Link URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={workForm.data.services_cta_link}
                                                        onChange={(e) => workForm.setData('services_cta_link', e.target.value)}
                                                        placeholder="/#services"
                                                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                    />
                                                    <span className="text-[11px] text-neutral-500 mt-1 block">
                                                        URL target (e.g. "/#services" or "/contact").
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end pt-3">
                                                <button
                                                    type="submit"
                                                    disabled={workForm.processing}
                                                    className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] disabled:opacity-50"
                                                >
                                                    <Save size={15} />
                                                    <span>{workForm.processing ? 'Saving...' : 'Save Work Header'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* SECTION 2: Live Website Simulation Box (Matching exact screenshot) */}
                                    <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 select-none">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] animate-pulse"></span>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                                    Live Work Page Simulation Preview
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-mono text-neutral-500">
                                                Matches /work in real-time
                                            </span>
                                        </div>

                                        {/* Simulated Hero Section */}
                                        <div className="pt-4 pb-2">
                                            {workForm.data.tag && (
                                                <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                                                    {workForm.data.tag}
                                                </span>
                                            )}

                                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#f2eee5] leading-[1.05] mb-4">
                                                {workForm.data.headline_prefix && <span>{workForm.data.headline_prefix} </span>}
                                                {workForm.data.headline_highlight && (
                                                    <span className="text-[#f7a838]">{workForm.data.headline_highlight} </span>
                                                )}
                                                {workForm.data.headline_suffix && <span>{workForm.data.headline_suffix}</span>}
                                            </h1>

                                            {workForm.data.subtitle && (
                                                <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
                                                    {workForm.data.subtitle}
                                                </p>
                                            )}

                                            {/* Pill Badge */}
                                            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-xs sm:text-sm font-medium text-neutral-300 shadow-md">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="inline-block w-2 h-2 rounded-full bg-[#14f1d9] shadow-[0_0_8px_#14f1d9]" />
                                                    <span>{workForm.data.badge_tag_1 || 'AI-generated'}</span>
                                                </span>
                                                <span className="text-neutral-500 font-bold">·</span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="inline-block w-2 h-2 rounded-full bg-[#ff7a18] shadow-[0_0_8px_#ff7a18]" />
                                                    <span>{workForm.data.badge_tag_2 || 'Human-directed'}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Simulated Filter Bar Strip with Top and Bottom Borders (Exact screenshot layout) */}
                                        <div className="border-t border-b border-white/[0.14] py-3.5 -mx-6 sm:-mx-10 px-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080808]">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {['All', 'Real estate', 'Consumer', 'Tech', 'Auto'].map((sector) => {
                                                    const isAuto = sector === 'Auto';
                                                    return (
                                                        <div
                                                            key={sector}
                                                            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                                                                isAuto
                                                                    ? 'bg-[#14f1d9] text-black font-semibold shadow-[0_0_18px_rgba(20,241,217,0.3)]'
                                                                    : 'border border-white/20 text-neutral-300 font-medium'
                                                            }`}
                                                        >
                                                            {sector}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div>
                                                <div className="inline-block border border-white/20 text-neutral-300 font-medium text-xs px-4 py-1.5 rounded-full">
                                                    {workForm.data.services_cta_text || 'Our other services'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simulated Film Count & 2 Film Tiles matching screenshot */}
                                        <div>
                                            <p className="text-xs text-neutral-400 font-normal mb-5">
                                                Showing 2 curated films
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="aspect-[16/10] bg-[#0d0e12] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                                                        <Play size={18} fill="currentColor" />
                                                    </div>
                                                    <span className="absolute top-3 right-4 font-mono text-[11px] text-neutral-400">
                                                        [0:45]
                                                    </span>
                                                </div>

                                                <div className="aspect-[16/10] bg-[#0d0e12] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                                                        <Play size={18} fill="currentColor" />
                                                    </div>
                                                    <span className="absolute top-3 right-4 font-mono text-[11px] text-neutral-400">
                                                        [0:45]
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SUB-TAB 2: CURATED FILMS PORTFOLIO MANAGER */}
                            {workTab === 'portfolio' && (
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Curated Films & Portfolio</h2>
                                            <p className="text-xs text-neutral-400 mt-1">
                                                Manage films displayed across the Home and Our Work pages.
                                            </p>
                                        </div>
                                        <button
                                            onClick={openAddFilmModal}
                                            type="button"
                                            className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 transition shadow self-start sm:self-auto"
                                        >
                                            <Plus size={16} />
                                            <span>Add New Film</span>
                                        </button>
                                    </div>

                                    {/* Category filter pills */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-white/10 pb-4">
                                        {['All', 'Real estate', 'Consumer', 'Tech', 'Auto'].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setFilterCategory(cat);
                                                    setFilmCurrentPage(1);
                                                }}
                                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                                                    filterCategory === cat
                                                        ? 'bg-white text-black font-bold'
                                                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                        <span className="text-xs text-neutral-400 ml-auto font-mono">
                                            Showing {filteredPortfolio.length === 0 ? 0 : `${filmStartIndex + 1}–${filmEndIndex}`} of {filteredPortfolio.length} films
                                        </span>
                                    </div>

                                    {/* Films Grid */}
                                    {paginatedPortfolio.length === 0 ? (
                                        <div className="py-16 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl bg-neutral-900/30">
                                            <Film size={32} className="mx-auto mb-2 opacity-40 text-neutral-400" />
                                            <p className="text-sm font-medium text-neutral-300">No curated films in this category.</p>
                                            <p className="text-xs text-neutral-500 mt-1">Try selecting another category or add a new film.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedPortfolio.map((film) => (
                                                <div
                                                    key={film.id}
                                                    className="bg-[#0b0c10] border border-white/10 rounded-xl overflow-hidden hover:border-white/25 transition group flex flex-col justify-between"
                                                >
                                                    <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                                                        {getFilmThumbnail(film) && (
                                                            <img
                                                                src={getFilmThumbnail(film)}
                                                                alt={film.title || 'Film thumbnail'}
                                                                onError={(e) => {
                                                                    if (e.currentTarget.src && e.currentTarget.src.includes('maxresdefault.jpg')) {
                                                                        e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                                                    }
                                                                }}
                                                                className="absolute inset-0 w-full h-full object-cover filter brightness-75 group-hover:brightness-90 transition duration-300"
                                                            />
                                                        )}
                                                        {isDirectVideo(film.video_url) && (
                                                            <video
                                                                src={film.video_url}
                                                                muted
                                                                loop
                                                                playsInline
                                                                onMouseEnter={(e) => e.target.play().catch(() => {})}
                                                                onMouseLeave={(e) => e.target.pause()}
                                                                className={`w-full h-full object-cover filter brightness-75 group-hover:brightness-90 transition duration-300 ${
                                                                    getFilmThumbnail(film) ? 'relative z-0 opacity-0 group-hover:opacity-100' : ''
                                                                }`}
                                                            />
                                                        )}
                                                        <span className="absolute top-2.5 right-3 font-mono text-[11px] bg-black/70 px-2 py-0.5 rounded text-neutral-300 z-10">
                                                            {film.duration || '[0:45]'}
                                                        </span>
                                                        <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm bg-[#14f1d9]/20 text-[#14f1d9] border border-[#14f1d9]/30">
                                                            {film.category || 'Real estate'}
                                                        </span>
                                                    </div>

                                                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-bold text-white text-base truncate">
                                                                {film.title}
                                                            </h3>
                                                            <p className="text-xs text-neutral-400 truncate">
                                                                {film.film_subtitle || '· Created for [Brand]'}
                                                            </p>
                                                        </div>

                                                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                                            <span className="text-[11px] font-mono text-neutral-500">
                                                                Order: #{film.sort_order || 1}
                                                            </span>
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => openEditFilmModal(film)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                                                    title="Edit Film"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteFilm(film.id)}
                                                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                                                    title="Delete Film"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Film Pagination Controls */}
                                    {totalFilmPages > 1 && (
                                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="text-xs text-neutral-400 font-mono">
                                                Page <span className="text-white font-semibold">{safeFilmPage}</span> of <span className="text-white font-semibold">{totalFilmPages}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setFilmCurrentPage(Math.max(1, safeFilmPage - 1))}
                                                    disabled={safeFilmPage === 1}
                                                    aria-label="Previous page"
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                                        safeFilmPage === 1
                                                            ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-neutral-900 border border-white/5'
                                                            : 'text-neutral-300 bg-neutral-900 border border-white/10 hover:border-white/30 hover:text-white'
                                                    }`}
                                                >
                                                    <ChevronLeft size={13} />
                                                    <span>Prev</span>
                                                </button>

                                                {Array.from({ length: totalFilmPages }, (_, i) => i + 1).map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        type="button"
                                                        onClick={() => setFilmCurrentPage(pageNum)}
                                                        className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                                                            pageNum === safeFilmPage
                                                                ? 'bg-[#14f1d9] text-black shadow-[0_0_10px_rgba(20,241,217,0.3)]'
                                                                : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => setFilmCurrentPage(Math.min(totalFilmPages, safeFilmPage + 1))}
                                                    disabled={safeFilmPage === totalFilmPages}
                                                    aria-label="Next page"
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                                        safeFilmPage === totalFilmPages
                                                            ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-neutral-900 border border-white/5'
                                                            : 'text-neutral-300 bg-neutral-900 border border-white/10 hover:border-white/30 hover:text-white'
                                                    }`}
                                                >
                                                    <span>Next</span>
                                                    <ChevronRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: CONTACT PAGE CMS */}
                    {activeTab === 'contact' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Contact CMS Navigation Header */}
                            <div className="bg-[#101217] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] shadow-[0_0_10px_#14f1d9]"></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#14f1d9]">
                                            Contact Page CMS
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        Contact Us & Brief Form Editor
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                                        Customize the hero headline, amber accent highlight, explanatory pitch, and the interactive creative brief form copy.
                                    </p>
                                </div>

                                <Link
                                    href={appUrl('/contact')}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition self-start sm:self-auto"
                                >
                                    <span>View /contact Page</span>
                                    <ExternalLink size={13} />
                                </Link>
                            </div>

                            {/* Contact Form Editor */}
                            <form onSubmit={handleContactSubmit} className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <MessageSquare size={18} className="text-[#14f1d9]" />
                                            <span>Contact Hero & Brief Form Content</span>
                                        </h3>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Updates the public /contact page in real-time.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={contactForm.processing}
                                        className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] disabled:opacity-50"
                                    >
                                        <Save size={15} />
                                        <span>{contactForm.processing ? 'Saving...' : 'Save Contact Page Copy'}</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Eyebrow Tag */}
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                            Section Eyebrow Tag
                                        </label>
                                        <input
                                            type="text"
                                            value={contactForm.data.tag}
                                            onChange={(e) => contactForm.setData('tag', e.target.value)}
                                            placeholder="START A PROJECT"
                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                        />
                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                            Uppercase cyan tracking tag (e.g. "START A PROJECT").
                                        </span>
                                    </div>

                                    {/* 2-Part Headline Construction */}
                                    <div className="p-5 rounded-xl bg-[#090a0d] border border-white/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                                                2-Part Main Headline Builder
                                            </span>
                                            <span className="text-[11px] text-neutral-400">
                                                Prefix (White) + Highlight (Amber Accent)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                                                    Headline Prefix (White Text)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contactForm.data.headline_prefix}
                                                    onChange={(e) => contactForm.setData('headline_prefix', e.target.value)}
                                                    placeholder="Let’s make something"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#f7a838] mb-1">
                                                    Headline Highlight (Amber Accent)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contactForm.data.headline_highlight}
                                                    onChange={(e) => contactForm.setData('headline_highlight', e.target.value)}
                                                    placeholder="extraordinary."
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-[#f7a838]/40 text-[#f7a838] font-bold text-sm focus:outline-none focus:border-[#f7a838] transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                            Explanatory Subtitle / Discovery Call Pitch
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={contactForm.data.subtitle}
                                            onChange={(e) => contactForm.setData('subtitle', e.target.value)}
                                            placeholder="Send a brief or book a 20–minute discovery call with our creative directors. We’ll explore how AI acceleration can elevate your brand video."
                                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                        />
                                        <span className="text-[11px] text-neutral-500 mt-1 block">
                                            Shown directly beneath the main headline on the contact page.
                                        </span>
                                    </div>

                                    {/* Booking Form Card Titles */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/10">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Booking Form Card Title
                                            </label>
                                            <input
                                                type="text"
                                                value={contactForm.data.form_title}
                                                onChange={(e) => contactForm.setData('form_title', e.target.value)}
                                                placeholder="Book a creative call"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Booking Form Card Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                value={contactForm.data.form_subtitle}
                                                onChange={(e) => contactForm.setData('form_subtitle', e.target.value)}
                                                placeholder="Fill in your details below and we’ll reach out to schedule our session."
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Success Message Card Copy */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/10">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Submission Success Title
                                            </label>
                                            <input
                                                type="text"
                                                value={contactForm.data.success_title}
                                                onChange={(e) => contactForm.setData('success_title', e.target.value)}
                                                placeholder="Creative Brief Received!"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Submission Success Message
                                            </label>
                                            <input
                                                type="text"
                                                value={contactForm.data.success_message}
                                                onChange={(e) => contactForm.setData('success_message', e.target.value)}
                                                placeholder="Thank you for reaching out. One of our creative directors will review your brief..."
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-3">
                                        <button
                                            type="submit"
                                            disabled={contactForm.processing}
                                            className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition shadow-[0_0_15px_rgba(20,241,217,0.3)] disabled:opacity-50"
                                        >
                                            <Save size={15} />
                                            <span>{contactForm.processing ? 'Saving...' : 'Save Contact Page Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* SECTION 2: Live Website Simulation Box (Matching exact user screenshot) */}
                            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 select-none">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#14f1d9] animate-pulse"></span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Live Contact Page Simulation Preview
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-mono text-neutral-500">
                                        Matches /contact in real-time
                                    </span>
                                </div>

                                {/* Simulated Contact Hero */}
                                <div className="pt-4 pb-4">
                                    {contactForm.data.tag && (
                                        <span className="block text-xs font-bold tracking-[0.2em] text-[#14f1d9] uppercase mb-4">
                                            {contactForm.data.tag}
                                        </span>
                                    )}

                                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#f2eee5] leading-[1.05] mb-4">
                                        {contactForm.data.headline_prefix && <span>{contactForm.data.headline_prefix} </span>}
                                        {contactForm.data.headline_highlight && (
                                            <span className="text-[#f7a838]">{contactForm.data.headline_highlight}</span>
                                        )}
                                    </h1>

                                    {contactForm.data.subtitle && (
                                        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl whitespace-pre-line">
                                            {contactForm.data.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Simulated 2-Column Section from Screenshot */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/10">
                                    {/* Left Column Preview Card */}
                                    <div className="md:col-span-5 space-y-3">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <Mail size={16} className="text-[#14f1d9]" />
                                            <div>
                                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                                    Direct Studio Email
                                                </div>
                                                <div className="text-xs font-medium text-white">
                                                    {companyForm.data.email || 'hello@loopsdubai.com'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <Phone size={16} className="text-[#14f1d9]" />
                                            <div>
                                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                                    Studio Phone
                                                </div>
                                                <div className="text-xs font-medium text-white">
                                                    {companyForm.data.phone || '+971 4 000 0000'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column Form Preview Card */}
                                    <div className="md:col-span-7">
                                        <div className="bg-[#0e0f13] border border-white/10 rounded-2xl p-5 space-y-4">
                                            <div>
                                                <h4 className="text-base font-bold text-white">
                                                    {contactForm.data.form_title || 'Book a creative call'}
                                                </h4>
                                                <p className="text-xs text-neutral-400 mt-0.5">
                                                    {contactForm.data.form_subtitle || "Fill in your details below and we'll reach out to schedule our session."}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="h-9 rounded-lg bg-neutral-900 border border-white/10 px-3 flex items-center text-xs text-neutral-500">
                                                    John Doe
                                                </div>
                                                <div className="h-9 rounded-lg bg-neutral-900 border border-white/10 px-3 flex items-center text-xs text-neutral-500">
                                                    john@brand.com
                                                </div>
                                            </div>

                                            <div className="h-10 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
                                                Book a creative call →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Creative Call Leads */}
                    {activeTab === 'leads' && (
                        <div className="bg-[#101217] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Call Requests & Leads Inbox</h2>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Client inquiries captured via the "Book a creative call" modal.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {['All', 'new', 'scheduled', 'completed'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setLeadStatusFilter(status);
                                                setLeadCurrentPage(1);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize cursor-pointer transition ${
                                                leadStatusFilter === status
                                                    ? 'bg-[#14f1d9] text-black font-semibold'
                                                    : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                    <span className="text-xs text-neutral-400 ml-auto font-mono">
                                        Showing {filteredBookings.length === 0 ? 0 : `${leadStartIndex + 1}–${leadEndIndex}`} of {filteredBookings.length} leads
                                    </span>
                                </div>
                            </div>

                            {paginatedBookings?.length === 0 ? (
                                <div className="text-center py-16 text-neutral-500">
                                    <Mail size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No call requests matching filter.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/10">
                                    {paginatedBookings.map((booking) => (
                                        <div key={booking.id} className="p-6 hover:bg-white/[0.02] transition">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-base font-semibold text-white">
                                                            {booking.name}
                                                        </h3>
                                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                                            booking.status === 'new'
                                                                ? 'bg-[#ff7a18]/20 text-[#ff7a18] border border-[#ff7a18]/30'
                                                                : booking.status === 'scheduled'
                                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                                : booking.status === 'completed'
                                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                                : 'bg-neutral-800 text-neutral-300'
                                                        }`}>
                                                            {booking.status.toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                                                        <a href={`mailto:${booking.email}`} className="text-[#14f1d9] hover:underline">
                                                            {booking.email}
                                                        </a>
                                                        {booking.phone && (
                                                            <a href={`tel:${booking.phone}`} className="text-neutral-300 hover:text-white font-mono">
                                                                {booking.phone}
                                                            </a>
                                                        )}
                                                        {booking.company && (
                                                            <span className="flex items-center gap-1 text-neutral-300">
                                                                <Building2 size={12} />
                                                                {booking.company}
                                                            </span>
                                                        )}
                                                        <span className="text-neutral-500">•</span>
                                                        <span>{booking.service_type}</span>
                                                        <span className="text-neutral-500">•</span>
                                                        <span className="text-neutral-500 font-mono">
                                                            {new Date(booking.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {booking.message && (
                                                        <p className="text-xs text-neutral-300 mt-2 bg-neutral-900/80 p-3 rounded-lg border border-white/5">
                                                            "{booking.message}"
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Status Controls */}
                                                <div className="flex items-center gap-2 self-start">
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                                                        className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#14f1d9] cursor-pointer"
                                                    >
                                                        <option value="new">Mark: New</option>
                                                        <option value="contacted">Mark: Contacted</option>
                                                        <option value="scheduled">Mark: Scheduled</option>
                                                        <option value="completed">Mark: Completed</option>
                                                    </select>

                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        type="button"
                                                        className="cursor-pointer text-neutral-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition"
                                                        title="Delete Lead"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Leads Pagination Controls */}
                            {totalLeadPages > 1 && (
                                <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0e12]">
                                    <div className="text-xs text-neutral-400 font-mono">
                                        Page <span className="text-white font-semibold">{safeLeadPage}</span> of <span className="text-white font-semibold">{totalLeadPages}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setLeadCurrentPage(Math.max(1, safeLeadPage - 1))}
                                            disabled={safeLeadPage === 1}
                                            aria-label="Previous page"
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                                safeLeadPage === 1
                                                    ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-neutral-900 border border-white/5'
                                                    : 'text-neutral-300 bg-neutral-900 border border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            <ChevronLeft size={13} />
                                            <span>Prev</span>
                                        </button>

                                        {Array.from({ length: totalLeadPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                type="button"
                                                onClick={() => setLeadCurrentPage(pageNum)}
                                                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                                                    pageNum === safeLeadPage
                                                        ? 'bg-[#14f1d9] text-black shadow-[0_0_10px_rgba(20,241,217,0.3)]'
                                                        : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => setLeadCurrentPage(Math.min(totalLeadPages, safeLeadPage + 1))}
                                            disabled={safeLeadPage === totalLeadPages}
                                            aria-label="Next page"
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                                safeLeadPage === totalLeadPages
                                                    ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-neutral-900 border border-white/5'
                                                    : 'text-neutral-300 bg-neutral-900 border border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            <span>Next</span>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 4: Brand Partners */}
                    {activeTab === 'brands' && (
                        <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Brand Partners & Logos</h2>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Displayed in the "CREATED FOR" section on the Home page.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setBrandModalOpen(true)}
                                    type="button"
                                    className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 transition shadow self-start sm:self-auto"
                                >
                                    <Plus size={16} />
                                    <span>Add Brand Logo</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {brandLogos.map((brand, idx) => (
                                    <div
                                        key={brand.id || idx}
                                        className="bg-[#0b0c10] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-between text-center min-h-[140px] hover:border-white/20 transition group"
                                    >
                                        <div className="w-10 h-10 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-neutral-500 font-mono text-xs">
                                            [Logo]
                                        </div>
                                        <div className="text-xs font-semibold text-white truncate w-full">
                                            {brand.name}
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/10 w-full justify-center">
                                            <span className="text-[10px] font-mono text-neutral-500">#{brand.sort_order}</span>
                                            <button
                                                onClick={() => handleDeleteBrand(brand.id)}
                                                className="text-neutral-500 hover:text-rose-400 cursor-pointer transition p-1"
                                                title="Delete Logo"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 5: Company Details & Logo CMS */}
                    {activeTab === 'company' && (
                        <div className="space-y-8">
                            <form onSubmit={handleCompanySubmit} className="space-y-8">
                                {/* Top Header Card with Action */}
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#14f1d9]/10 border border-[#14f1d9]/25 text-[11px] font-bold text-[#14f1d9] uppercase tracking-wider mb-2">
                                            <Building2 size={13} />
                                            <span>Branding & Contacts CMS</span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-white">
                                            Company Details & Logo
                                        </h2>
                                        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                                            Update your studio logo, contact channels, address, and operating hours. Changes instantly apply across the Header, Footer, and Contact page.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={companyForm.processing}
                                        className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
                                    >
                                        <Save size={16} />
                                        <span>{companyForm.processing ? 'Saving Changes...' : 'Save Company Details'}</span>
                                    </button>
                                </div>

                                {/* SECTION 1: Brand Logo & Appearance */}
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Type size={18} className="text-[#14f1d9]" />
                                                <span>Studio Logo & Brand Appearance</span>
                                            </h3>
                                            <p className="text-xs text-neutral-400 mt-1">
                                                Choose how your logo is displayed in the navigation bar and footer.
                                            </p>
                                        </div>

                                    {/* Logo Format Selector */}
                                    <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => companyForm.setData('logo_type', 'text')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                companyForm.data.logo_type === 'text'
                                                    ? 'bg-[#14f1d9] text-black shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            2-Tone Stylized Text
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => companyForm.setData('logo_type', 'image')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                companyForm.data.logo_type === 'image'
                                                    ? 'bg-[#14f1d9] text-black shadow'
                                                    : 'text-neutral-400 hover:text-white'
                                            }`}
                                        >
                                            Logo Image (Upload / URL)
                                        </button>
                                    </div>
                                </div>

                                {/* Live Simulated Navbar Header Logo Preview */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                        Live Header Logo Preview (Exact Navbar Appearance)
                                    </label>
                                    <div className="bg-[#0b0c0e] border border-white/10 rounded-xl p-5 flex items-center justify-between overflow-x-auto shadow-inner">
                                        {/* Preview Logo */}
                                        <div className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-white">
                                            {companyForm.data.logo_type === 'image' && (logoFilePreview || companyForm.data.logo_image_url) ? (
                                                <img 
                                                    src={logoFilePreview || companyForm.data.logo_image_url} 
                                                    alt="Logo Preview" 
                                                    className="h-8 max-w-[200px] object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <span className="text-white">
                                                        {companyForm.data.logo_text_prefix || 'Loops'}
                                                    </span>
                                                    <span className="text-[#14f1d9]">
                                                        {companyForm.data.logo_text_suffix || 'Integrated'}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Simulated Navigation items */}
                                        <div className="hidden sm:flex items-center gap-6 text-xs text-neutral-400 font-medium">
                                            <span className="hover:text-white transition">Work</span>
                                            <span className="hover:text-white transition">How it works</span>
                                            <span className="hover:text-white transition">About</span>
                                            <span className="hover:text-white transition">Our other services</span>
                                            <span className="text-[#14f1d9] font-semibold">Contact</span>
                                        </div>

                                        {/* Simulated Button */}
                                        <div className="hidden sm:block">
                                            <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                                                Book a creative call
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-neutral-500 mt-1.5 block">
                                        Matches the high-contrast luxury styling in your main navigation header.
                                    </span>
                                </div>

                                {/* Logo Inputs based on Mode */}
                                {companyForm.data.logo_type === 'text' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Logo Prefix Text (Primary — Pure White)
                                            </label>
                                            <input
                                                type="text"
                                                value={companyForm.data.logo_text_prefix}
                                                onChange={(e) => companyForm.setData('logo_text_prefix', e.target.value)}
                                                placeholder="Loops"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                First word rendered in crisp white (e.g. "Loops").
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Logo Accent Text (Highlight — Cyan #14f1d9)
                                            </label>
                                            <input
                                                type="text"
                                                value={companyForm.data.logo_text_suffix}
                                                onChange={(e) => companyForm.setData('logo_text_suffix', e.target.value)}
                                                placeholder="Integrated"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-[#14f1d9] font-bold text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Second word styled in the signature vibrant cyan accent.
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-2">
                                        {/* Sub-toggle: Upload File vs Image URL */}
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                                            <button
                                                type="button"
                                                onClick={() => setImageInputMethod('upload')}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                                                    imageInputMethod === 'upload'
                                                        ? 'bg-white/15 text-white font-semibold shadow'
                                                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <UploadCloud size={14} className={imageInputMethod === 'upload' ? 'text-[#14f1d9]' : ''} />
                                                <span>Upload Image from Device</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setImageInputMethod('url')}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                                                    imageInputMethod === 'url'
                                                        ? 'bg-white/15 text-white font-semibold shadow'
                                                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <ExternalLink size={14} className={imageInputMethod === 'url' ? 'text-[#14f1d9]' : ''} />
                                                <span>Image URL Link</span>
                                            </button>
                                        </div>

                                        {imageInputMethod === 'upload' ? (
                                            <div className="space-y-4">
                                                {/* Hidden native file input */}
                                                <input 
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/svg+xml,image/webp,image/jpeg,image/gif"
                                                    onChange={handleLogoFileChange}
                                                    className="hidden"
                                                />

                                                {/* Active or Selected Image Preview Badge */}
                                                {(logoFilePreview || companyForm.data.logo_image_url) ? (
                                                    <div className="p-4 rounded-xl bg-neutral-900 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-14 rounded-lg bg-[#08090c] border border-white/10 p-2 flex items-center justify-center overflow-hidden shrink-0">
                                                                <img 
                                                                    src={logoFilePreview || companyForm.data.logo_image_url} 
                                                                    alt="Selected logo" 
                                                                    className="max-h-full max-w-full object-contain"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-white">
                                                                        {companyForm.data.logo_file ? companyForm.data.logo_file.name : 'Current Active Logo'}
                                                                    </span>
                                                                    {companyForm.data.logo_file ? (
                                                                        <span className="text-[10px] bg-[#14f1d9]/20 text-[#14f1d9] border border-[#14f1d9]/30 px-2 py-0.5 rounded-full font-semibold">
                                                                            Ready to save
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                                                                            Live in Header
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[11px] text-neutral-400 mt-0.5 block truncate max-w-md">
                                                                    {companyForm.data.logo_file 
                                                                        ? `${(companyForm.data.logo_file.size / 1024).toFixed(1)} KB · Will be uploaded on save`
                                                                        : (companyForm.data.logo_image_url || 'Stored on server')
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 self-start sm:self-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                                                            >
                                                                <UploadCloud size={13} />
                                                                <span>Change File</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleRemoveLogoImage}
                                                                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Trash2 size={13} />
                                                                <span>Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Drag & Drop / Click to Browse Box */
                                                    <div 
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="border-2 border-dashed border-white/15 hover:border-[#14f1d9] rounded-2xl p-8 text-center bg-neutral-900/50 hover:bg-neutral-900/80 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-3"
                                                    >
                                                        <div className="w-12 h-12 rounded-2xl bg-[#14f1d9]/10 text-[#14f1d9] group-hover:bg-[#14f1d9]/20 group-hover:scale-105 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(20,241,217,0.15)]">
                                                            <UploadCloud size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white group-hover:text-[#14f1d9] transition-colors">
                                                                Click to browse or drag & drop logo image file
                                                            </div>
                                                            <p className="text-xs text-neutral-400 mt-1">
                                                                PNG, SVG, WebP, or JPG up to 5MB
                                                            </p>
                                                        </div>
                                                        <span className="text-[11px] text-neutral-500 max-w-sm">
                                                            Tip: Transparent PNG or vector SVG with white/bright lettering delivers the crispest results on the dark luxury navigation bar.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Direct URL Input */
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                    Custom Logo Image URL (PNG, SVG, or WebP)
                                                </label>
                                                <input
                                                    type="url"
                                                    value={companyForm.data.logo_image_url}
                                                    onChange={(e) => {
                                                        companyForm.setData('logo_image_url', e.target.value);
                                                        setLogoFilePreview(null);
                                                    }}
                                                    placeholder="https://example.com/logo.svg"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] font-mono transition"
                                                />
                                                <span className="text-[11px] text-neutral-500 mt-1 block">
                                                    Provide an image URL. Max recommended display height: 36px.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                                {/* SECTION 2: Studio Contact Channels */}
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                    <div className="pb-4 border-b border-white/10">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Phone size={18} className="text-[#14f1d9]" />
                                            <span>Studio Contact Information & Channels</span>
                                        </h3>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Configures the contact details shown on the Contact page, in emails, and footer links.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                                                <Mail size={14} className="text-[#14f1d9]" />
                                                <span>Direct Studio Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={companyForm.data.email}
                                                onChange={(e) => companyForm.setData('email', e.target.value)}
                                                placeholder="hello@loopsdubai.com"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Displayed on the Contact page with one-click <code className="text-neutral-400 font-mono">mailto:</code> action.
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                                                <Phone size={14} className="text-[#14f1d9]" />
                                                <span>Studio Phone Number</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={companyForm.data.phone}
                                                onChange={(e) => companyForm.setData('phone', e.target.value)}
                                                placeholder="+971 4 000 0000"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Displayed on the Contact page with direct <code className="text-neutral-400 font-mono">tel:</code> calling.
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                                                <Clock size={14} className="text-cyan-400" />
                                                <span>Studio Working Hours</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={companyForm.data.working_hours}
                                                onChange={(e) => companyForm.setData('working_hours', e.target.value)}
                                                placeholder="Mon — Fri, 9:00 AM — 6:00 PM GST"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Operational hours shown to prospective clients.
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                                                <MapPin size={14} className="text-[#ff7a18]" />
                                                <span>Headquarters Physical Address</span>
                                            </label>
                                            <textarea
                                                rows={2}
                                                required
                                                value={companyForm.data.address}
                                                onChange={(e) => companyForm.setData('address', e.target.value)}
                                                placeholder="Dubai Media City, Building 4, Dubai, UAE"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition resize-none"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Official office / headquarters address displayed on Contact page.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: Legal Name & Footer Tagline */}
                                <div className="bg-[#101217] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                                    <div className="pb-4 border-b border-white/10">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Building2 size={18} className="text-[#14f1d9]" />
                                            <span>Company Identity & Slogan</span>
                                        </h3>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Configures the official company name and tagline rendered in the website footer and page titles.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Full Company / Legal Entity Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={companyForm.data.company_name}
                                                onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                                placeholder="Loops Integrated"
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Used for footer branding, HTML meta titles, and copyright notices.
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                                Footer Tagline / Slogan
                                            </label>
                                            <input
                                                type="text"
                                                value={companyForm.data.tagline}
                                                onChange={(e) => companyForm.setData('tagline', e.target.value)}
                                                placeholder="AI video production with human creative direction."
                                                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] transition"
                                            />
                                            <span className="text-[11px] text-neutral-500 mt-1 block">
                                                Displayed immediately beneath the company name in the website footer.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 4: Live Contact Page Preview Tile */}
                                <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                        Live Contact Page Preview (How clients see your channels on /contact)
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <Mail size={16} className="text-[#14f1d9] shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Email</div>
                                                <div className="text-xs text-white truncate font-medium">{companyForm.data.email || '—'}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <Phone size={16} className="text-[#14f1d9] shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Phone</div>
                                                <div className="text-xs text-white truncate font-medium">{companyForm.data.phone || '—'}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <MapPin size={16} className="text-[#ff7a18] shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Headquarters</div>
                                                <div className="text-xs text-white truncate font-medium">{companyForm.data.address || '—'}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0e0f13] border border-white/10">
                                            <Clock size={16} className="text-cyan-400 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Hours</div>
                                                <div className="text-xs text-white truncate font-medium">{companyForm.data.working_hours || '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Sticky/Fixed Bar for Easy Saving */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <span className="text-xs text-neutral-400">
                                        All fields persist directly to MySQL and sync to the live website instantly.
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={companyForm.processing}
                                        className="cursor-pointer bg-[#14f1d9] hover:bg-[#12dac4] text-black font-bold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center gap-2 transition shadow-[0_0_25px_rgba(20,241,217,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        <span>{companyForm.processing ? 'Saving Changes...' : 'Save Company Details'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </main>
            </div>

            {/* FILM MODAL (ADD / EDIT) */}
            {filmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">
                                {editingFilm ? 'Edit Curated Film' : 'Add New Curated Film'}
                            </h3>
                            <button
                                onClick={() => setFilmModalOpen(false)}
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFilmSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Film Title (e.g. "[Brand name 1]")
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={filmForm.data.title}
                                    onChange={(e) => filmForm.setData('title', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                                        Sector / Category
                                    </label>
                                    <select
                                        value={filmForm.data.category || 'Real estate'}
                                        onChange={(e) => filmForm.setData('category', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9] cursor-pointer"
                                    >
                                        <option value="Real estate">Real estate</option>
                                        <option value="Consumer">Consumer</option>
                                        <option value="Tech">Tech</option>
                                        <option value="Auto">Auto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                                        Duration Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={filmForm.data.duration}
                                        onChange={(e) => filmForm.setData('duration', e.target.value)}
                                        placeholder="[0:45]"
                                        className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Subtitle (e.g. "[Film title] · Created for [Brand]")
                                </label>
                                <input
                                    type="text"
                                    value={filmForm.data.film_subtitle}
                                    onChange={(e) => filmForm.setData('film_subtitle', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            {/* Thumbnail Poster Image */}
                            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-medium text-neutral-200">
                                        Video Thumbnail / Poster Image
                                    </label>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setFilmThumbMethod('upload')}
                                            className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                                                filmThumbMethod === 'upload'
                                                    ? 'bg-[#14f1d9] text-black font-semibold'
                                                    : 'text-neutral-400 hover:text-white bg-white/5'
                                            }`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilmThumbMethod('url')}
                                            className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                                                filmThumbMethod === 'url'
                                                    ? 'bg-[#14f1d9] text-black font-semibold'
                                                    : 'text-neutral-400 hover:text-white bg-white/5'
                                            }`}
                                        >
                                            Image URL
                                        </button>
                                    </div>
                                </div>

                                {filmThumbMethod === 'upload' ? (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={filmThumbInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFilmThumbFileChange}
                                                className="block w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer cursor-pointer border border-white/10 rounded-lg p-1.5 bg-neutral-900"
                                            />
                                            {filmThumbPreview && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFilmThumb}
                                                    className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                                    title="Remove thumbnail"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-neutral-500">
                                            Supports JPG, PNG, WebP up to 10MB.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={filmForm.data.thumbnail_url}
                                                onChange={(e) => {
                                                    filmForm.setData('thumbnail_url', e.target.value);
                                                    setFilmThumbPreview(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/... or https://..."
                                                className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#14f1d9]"
                                            />
                                            {filmThumbPreview && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFilmThumb}
                                                    className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                                    title="Clear thumbnail"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* YouTube auto-detect helper */}
                                {filmForm.data.video_url && (filmForm.data.video_url.includes('youtu') || filmForm.data.video_url.includes('youtube')) && (
                                    <div className="flex items-center justify-between text-[11px] bg-black/40 border border-white/5 rounded-lg px-3 py-1.5">
                                        <span className="text-neutral-400">YouTube URL detected</span>
                                        <button
                                            type="button"
                                            onClick={handleAutoDetectYoutubeThumb}
                                            className="text-[#14f1d9] hover:underline font-medium cursor-pointer"
                                        >
                                            ✨ Fetch YouTube thumbnail
                                        </button>
                                    </div>
                                )}

                                {/* Live Thumbnail Preview */}
                                {filmThumbPreview && (
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-950 flex items-center justify-center">
                                        <img
                                            src={filmThumbPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                if (e.currentTarget.src && e.currentTarget.src.includes('maxresdefault.jpg')) {
                                                    e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                                } else {
                                                    e.currentTarget.style.display = 'none';
                                                }
                                            }}
                                        />
                                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-neutral-300">
                                            Thumbnail Preview
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Video URL (Direct MP4, YouTube, or Vimeo)
                                </label>
                                <input
                                    type="text"
                                    value={filmForm.data.video_url}
                                    onChange={(e) => handleFilmVideoUrlChange(e.target.value)}
                                    placeholder="https://assets.mixkit.co/... or https://www.youtube.com/watch?v=..."
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setFilmModalOpen(false)}
                                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={filmForm.processing}
                                    className="px-5 py-2 rounded-full bg-[#14f1d9] text-black text-xs font-bold hover:bg-[#12dac4] transition cursor-pointer disabled:opacity-50"
                                >
                                    {editingFilm ? 'Update Film' : 'Add to Portfolio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BRAND LOGO MODAL */}
            {brandModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">Add Brand Partner Logo</h3>
                            <button
                                onClick={() => setBrandModalOpen(false)}
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleBrandSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Brand / Partner Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={brandForm.data.name}
                                    onChange={(e) => brandForm.setData('name', e.target.value)}
                                    placeholder="[Brand name]"
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={brandForm.data.sort_order}
                                    onChange={(e) => brandForm.setData('sort_order', parseInt(e.target.value) || 1)}
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setBrandModalOpen(false)}
                                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={brandForm.processing}
                                    className="px-5 py-2 rounded-full bg-[#14f1d9] text-black text-xs font-bold hover:bg-[#12dac4] transition cursor-pointer disabled:opacity-50"
                                >
                                    Add Brand Partner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TEAM MEMBER MODAL (ADD / EDIT) */}
            {teamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">
                                {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
                            </h3>
                            <button
                                onClick={() => setTeamModalOpen(false)}
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleTeamSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={teamForm.data.name}
                                        onChange={(e) => teamForm.setData('name', e.target.value)}
                                        placeholder="e.g. Alex Morgan or [Name]"
                                        className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                                        Role / Position
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={teamForm.data.role}
                                        onChange={(e) => teamForm.setData('role', e.target.value)}
                                        placeholder="e.g. Executive Creative Director or [Role]"
                                        className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={teamForm.data.sort_order}
                                    onChange={(e) => teamForm.setData('sort_order', parseInt(e.target.value) || 1)}
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#f7a838]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                                    Member Photography (Portrait 4:5 ratio)
                                </label>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            ref={teamPhotoInputRef}
                                            onChange={handleTeamPhotoChange}
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => teamPhotoInputRef.current?.click()}
                                            className="cursor-pointer px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition"
                                        >
                                            <UploadCloud size={14} className="text-[#f7a838]" />
                                            <span>Upload Photo File</span>
                                        </button>

                                        {(teamPhotoPreview || teamForm.data.photo_url) && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveTeamPhoto}
                                                className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                                            >
                                                <Trash2 size={13} />
                                                <span>Reset to [Photo]</span>
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        value={teamForm.data.photo_url}
                                        onChange={(e) => {
                                            teamForm.setData('photo_url', e.target.value);
                                            setTeamPhotoPreview(null);
                                        }}
                                        placeholder="Or paste external photo URL: https://..."
                                        className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 text-xs focus:outline-none focus:border-[#f7a838] transition font-mono"
                                    />
                                </div>
                            </div>

                            {/* Live Portrait Preview Box */}
                            <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 flex items-center gap-4">
                                <div className="w-16 h-20 rounded-lg border border-dashed border-white/15 bg-white/[0.02] overflow-hidden flex items-center justify-center shrink-0">
                                    {teamPhotoPreview || teamForm.data.photo_url ? (
                                        <img
                                            src={teamPhotoPreview || teamForm.data.photo_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover filter grayscale"
                                        />
                                    ) : (
                                        <span className="text-[10px] font-mono text-neutral-500">[Photo]</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-white truncate">
                                        {teamForm.data.name || '[Name]'}
                                    </div>
                                    <div className="text-[11px] text-neutral-400 truncate">
                                        {teamForm.data.role || '[Role]'}
                                    </div>
                                    <div className="text-[10px] text-neutral-500 mt-1">
                                        Display ratio: 4:5 vertical portrait
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setTeamModalOpen(false)}
                                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={teamForm.processing}
                                    className="px-6 py-2 rounded-full bg-[#f7a838] hover:bg-[#e09328] text-black text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                >
                                    {teamForm.processing ? 'Saving...' : editingTeamMember ? 'Update Member' : 'Add Team Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SERVICE CARD MODAL (ADD / EDIT) */}
            {serviceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#101217] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">
                                {editingService ? 'Edit Service Card' : 'Add New Service Card'}
                            </h3>
                            <button
                                onClick={() => setServiceModalOpen(false)}
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleServiceItemSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={serviceItemForm.data.title}
                                    onChange={(e) => serviceItemForm.setData('title', e.target.value)}
                                    placeholder="e.g. Brand and creative strategy"
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Service Description
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={serviceItemForm.data.description}
                                    onChange={(e) => serviceItemForm.setData('description', e.target.value)}
                                    placeholder="e.g. [Two-line description to confirm with the team.]"
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={serviceItemForm.data.sort_order}
                                    onChange={(e) => serviceItemForm.setData('sort_order', parseInt(e.target.value) || 1)}
                                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#14f1d9]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setServiceModalOpen(false)}
                                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceItemForm.processing}
                                    className="px-6 py-2 rounded-full bg-[#14f1d9] hover:bg-[#12dac4] text-black text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                >
                                    {serviceItemForm.processing ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
