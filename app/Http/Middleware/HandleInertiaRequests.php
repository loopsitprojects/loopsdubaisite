<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'company' => fn () => \App\Models\CompanySetting::first() ?? [
                'logo_type' => 'image',
                'logo_text_prefix' => 'Loops',
                'logo_text_suffix' => 'Integrated',
                'logo_image_url' => '/uploads/logos/loops_integrated_logo.png',
                'company_name' => 'Loops Integrated',
                'email' => 'hello@loopsdubai.com',
                'phone' => '+971 4 000 0000',
                'address' => 'Dubai Media City, Building 4, Dubai, UAE',
                'working_hours' => 'Mon — Fri, 9:00 AM — 6:00 PM GST',
                'tagline' => 'AI video production with human creative direction.',
            ],
        ];
    }
}
