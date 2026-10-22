<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Booking;
use App\Models\ContactSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_loads_successfully(): void
    {
        $response = $this->get('/contact');
        $response->assertStatus(200);
    }

    public function test_contact_us_alias_loads_successfully(): void
    {
        $response = $this->get('/contact-us');
        $response->assertStatus(200);
    }

    public function test_user_can_submit_creative_call_brief(): void
    {
        $response = $this->post('/book-call', [
            'name' => 'Alexander Wright',
            'email' => 'alex@monolith.com',
            'phone' => '+971 50 123 4567',
            'company' => 'Monolith Studios',
            'service_type' => 'AI Video Production',
            'message' => 'Looking to produce a 60-second cinematic film for our luxury watch reveal.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('bookings', [
            'email' => 'alex@monolith.com',
            'phone' => '+971 50 123 4567',
            'company' => 'Monolith Studios',
            'status' => 'new',
        ]);
    }

    public function test_guest_cannot_update_contact_settings(): void
    {
        $response = $this->post('/admin/contact-settings', [
            'tag' => 'HACKED TAG',
            'headline_prefix' => 'Hacked',
            'headline_highlight' => 'Headline',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_contact_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/contact-settings', [
            'tag' => 'INITIATE COLLABORATION',
            'headline_prefix' => 'Create something truly',
            'headline_highlight' => 'unforgettable.',
            'subtitle' => 'Schedule a discovery session with our executive directors in Dubai.',
            'form_title' => 'Request Executive Consultation',
            'form_subtitle' => 'Provide campaign details for customized storyboard concepts.',
            'success_title' => 'Consultation Request Logged!',
            'success_message' => 'Our team will review your requirements and reach out within 12 hours.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_settings', [
            'tag' => 'INITIATE COLLABORATION',
            'headline_prefix' => 'Create something truly',
            'headline_highlight' => 'unforgettable.',
            'subtitle' => 'Schedule a discovery session with our executive directors in Dubai.',
            'form_title' => 'Request Executive Consultation',
            'form_subtitle' => 'Provide campaign details for customized storyboard concepts.',
            'success_title' => 'Consultation Request Logged!',
            'success_message' => 'Our team will review your requirements and reach out within 12 hours.',
        ]);
    }

    public function test_contact_page_renders_with_contact_settings(): void
    {
        ContactSetting::create([
            'tag' => 'BESPOKE CAMPAIGNS',
            'headline_prefix' => 'Begin your next',
            'headline_highlight' => 'masterpiece.',
            'subtitle' => 'Partner directly with our award-winning AI directors.',
            'form_title' => 'Book a creative consultation',
            'form_subtitle' => 'Complete the brief below.',
            'success_title' => 'Transmission Confirmed!',
            'success_message' => 'We will reach out immediately.',
        ]);

        $response = $this->get('/contact');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Contact')
            ->has('contactSetting')
            ->where('contactSetting.tag', 'BESPOKE CAMPAIGNS')
            ->where('contactSetting.headline_prefix', 'Begin your next')
            ->where('contactSetting.headline_highlight', 'masterpiece.')
            ->where('contactSetting.form_title', 'Book a creative consultation')
        );
    }

    public function test_admin_dashboard_provides_contact_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('contactSetting')
        );
    }
}
