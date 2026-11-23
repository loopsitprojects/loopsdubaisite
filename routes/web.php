<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public Front-facing Website
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/work', [WorkController::class, 'index'])->name('work');
Route::get('/our-work', [WorkController::class, 'index'])->name('our.work');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::get('/contact-us', [HomeController::class, 'contact'])->name('contact.us');
Route::post('/book-call', [HomeController::class, 'storeBooking'])->name('book.call');

// Admin Authentication
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Admin Dashboard (Protected)
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/hero', [AdminController::class, 'updateHero'])->name('admin.hero.update');
    Route::patch('/bookings/{booking}', [AdminController::class, 'updateBooking'])->name('admin.bookings.update');
    Route::delete('/bookings/{booking}', [AdminController::class, 'deleteBooking'])->name('admin.bookings.delete');
    
    // Portfolio / Curated Films CRUD
    Route::post('/portfolio', [AdminController::class, 'storePortfolio'])->name('admin.portfolio.store');
    Route::post('/portfolio/featured', [AdminController::class, 'updateFeaturedFilms'])->name('admin.portfolio.featured');
    Route::patch('/portfolio/{portfolioItem}', [AdminController::class, 'updatePortfolio'])->name('admin.portfolio.update');
    Route::post('/portfolio/{portfolioItem}', [AdminController::class, 'updatePortfolio'])->name('admin.portfolio.update.post');
    Route::delete('/portfolio/{portfolioItem}', [AdminController::class, 'deletePortfolio'])->name('admin.portfolio.delete');

    // Brand Logos CRUD
    Route::post('/brand-logos', [AdminController::class, 'storeBrandLogo'])->name('admin.brandLogos.store');
    Route::patch('/brand-logos/{brandLogo}', [AdminController::class, 'updateBrandLogo'])->name('admin.brandLogos.update');
    Route::delete('/brand-logos/{brandLogo}', [AdminController::class, 'deleteBrandLogo'])->name('admin.brandLogos.delete');

    // Company Branding & Details
    Route::post('/company-settings', [AdminController::class, 'updateCompanySettings'])->name('admin.company.update');

    // Behind The Film CMS
    Route::post('/behind-the-film', [AdminController::class, 'updateBehindTheFilm'])->name('admin.behindTheFilm.update');

    // About Section CMS
    Route::post('/about', [AdminController::class, 'updateAbout'])->name('admin.about.update');

    // Team Members CRUD
    Route::post('/team-members', [AdminController::class, 'storeTeamMember'])->name('admin.teamMembers.store');
    Route::post('/team-members/{teamMember}', [AdminController::class, 'updateTeamMember'])->name('admin.teamMembers.update');
    Route::delete('/team-members/{teamMember}', [AdminController::class, 'deleteTeamMember'])->name('admin.teamMembers.delete');

    // Other Services CMS
    Route::post('/services-setting', [AdminController::class, 'updateServicesSetting'])->name('admin.servicesSetting.update');
    Route::post('/services', [AdminController::class, 'storeServiceItem'])->name('admin.services.store');
    Route::post('/services/{serviceItem}', [AdminController::class, 'updateServiceItem'])->name('admin.services.update');
    Route::delete('/services/{serviceItem}', [AdminController::class, 'deleteServiceItem'])->name('admin.services.delete');

    // Home Page Sections Visibility Toggles
    Route::post('/sections/toggle', [AdminController::class, 'toggleSectionVisibility'])->name('admin.sections.toggle');
    Route::post('/sections/visibility', [AdminController::class, 'updateSectionVisibility'])->name('admin.sections.update');

    // Storyboard Frames CMS (Upload, Reorder, Delete, Reset)
    Route::post('/storyboard-frames', [AdminController::class, 'storeStoryboardFrame'])->name('admin.storyboard.store');
    Route::post('/storyboard-frames/reorder', [AdminController::class, 'reorderStoryboardFrames'])->name('admin.storyboard.reorder');
    Route::post('/storyboard-frames/reset', [AdminController::class, 'resetStoryboardFrames'])->name('admin.storyboard.reset');
    Route::delete('/storyboard-frames/{storyboardFrame}', [AdminController::class, 'deleteStoryboardFrame'])->name('admin.storyboard.delete');

    // Global Offices CMS (Add, Edit, Delete, Toggle Visibility, Reorder)
    Route::post('/offices', [AdminController::class, 'storeOffice'])->name('admin.offices.store');
    Route::post('/offices/reorder', [AdminController::class, 'reorderOffices'])->name('admin.offices.reorder');
    Route::post('/offices/{office}', [AdminController::class, 'updateOffice'])->name('admin.offices.update');
    Route::post('/offices/{office}/toggle', [AdminController::class, 'toggleOfficeVisibility'])->name('admin.offices.toggle');
    Route::delete('/offices/{office}', [AdminController::class, 'deleteOffice'])->name('admin.offices.delete');

    // Work Page Hero & Header CMS
    Route::post('/work-settings', [AdminController::class, 'updateWorkSetting'])->name('admin.workSetting.update');

    // Contact Page CMS
    Route::post('/contact-settings', [AdminController::class, 'updateContactSetting'])->name('admin.contactSetting.update');

    // Admin Account & Security Settings
    Route::post('/security', [AdminController::class, 'updateSecurity'])->name('admin.security.update');
});
