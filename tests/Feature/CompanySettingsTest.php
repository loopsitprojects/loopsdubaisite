<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\CompanySetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CompanySettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_company_settings(): void
    {
        $response = $this->post('/admin/company-settings', [
            'company_name' => 'Hacked Name',
            'email' => 'hacked@example.com',
            'phone' => '+1234567890',
            'address' => 'Somewhere',
            'working_hours' => 'Always',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_company_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/company-settings', [
            'logo_type' => 'text',
            'logo_text_prefix' => 'Loops',
            'logo_text_suffix' => 'Global',
            'company_name' => 'Loops Global Media',
            'email' => 'contact@loopsglobal.com',
            'phone' => '+971 4 999 8888',
            'address' => 'Dubai Internet City, Building 1, Dubai, UAE',
            'working_hours' => 'Mon — Fri, 8:00 AM — 5:00 PM GST',
            'tagline' => 'Next-gen video storytelling powered by AI.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('company_settings', [
            'logo_text_suffix' => 'Global',
            'company_name' => 'Loops Global Media',
            'email' => 'contact@loopsglobal.com',
            'phone' => '+971 4 999 8888',
        ]);
    }

    public function test_contact_page_renders_dynamic_company_details(): void
    {
        CompanySetting::create([
            'logo_type' => 'text',
            'logo_text_prefix' => 'Loops',
            'logo_text_suffix' => 'Creative',
            'company_name' => 'Loops Creative Studio',
            'email' => 'studio@loopscreative.com',
            'phone' => '+971 50 111 2222',
            'address' => 'Alserkal Avenue, Warehouse 12, Dubai, UAE',
            'working_hours' => 'Mon — Sat, 10:00 AM — 7:00 PM GST',
            'tagline' => 'Human ingenuity meets generative AI.',
        ]);

        $response = $this->get('/contact');
        $response->assertStatus(200);
        $response->assertSee('studio@loopscreative.com');
        $response->assertSee('+971 50 111 2222');
        $response->assertSee('Alserkal Avenue, Warehouse 12, Dubai, UAE');
    }

    public function test_admin_dashboard_loads_company_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('company')
            ->where('company.company_name', 'Loops Integrated')
        );
    }

    public function test_admin_can_upload_logo_image_file(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $file = \Illuminate\Http\UploadedFile::fake()->create('loops_logo.png', 50, 'image/png');

        $response = $this->actingAs($admin)->post('/admin/company-settings', [
            'logo_type' => 'image',
            'logo_file' => $file,
            'company_name' => 'Loops Integrated',
            'email' => 'hello@loopsdubai.com',
            'phone' => '+971 4 000 0000',
            'address' => 'Dubai Media City, UAE',
            'working_hours' => 'Mon — Fri, 9:00 AM — 6:00 PM GST',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $setting = CompanySetting::first();
        $this->assertEquals('image', $setting->logo_type);
        $this->assertStringStartsWith('/uploads/logos/logo_', $setting->logo_image_url);
        $this->assertFileExists(public_path(ltrim($setting->logo_image_url, '/')));

        // Clean up test file
        if (file_exists(public_path(ltrim($setting->logo_image_url, '/')))) {
            unlink(public_path(ltrim($setting->logo_image_url, '/')));
        }
    }
}
