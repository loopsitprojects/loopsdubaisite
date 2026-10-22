<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ServicesSetting;
use App\Models\ServiceItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OtherServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_services_settings(): void
    {
        $response = $this->post('/admin/services-setting', [
            'tag' => 'HACKED SERVICES',
            'headline_1' => 'Hacked Headline',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_services_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/services-setting', [
            'tag' => 'EXTENDED CAPABILITIES',
            'headline_1' => 'Beyond film, we build the entire',
            'headline_2' => 'brand ecosystem.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('services_settings', [
            'tag' => 'EXTENDED CAPABILITIES',
            'headline_1' => 'Beyond film, we build the entire',
            'headline_2' => 'brand ecosystem.',
        ]);
    }

    public function test_authenticated_admin_can_manage_service_items(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        // 1. Create service
        $response = $this->actingAs($admin)->post('/admin/services', [
            'title' => 'AI Brand Strategy & Naming',
            'description' => 'Comprehensive strategic direction for modern companies.',
            'sort_order' => 1,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('service_items', [
            'title' => 'AI Brand Strategy & Naming',
        ]);

        $item = ServiceItem::where('title', 'AI Brand Strategy & Naming')->first();

        // 2. Update service
        $updateResponse = $this->actingAs($admin)->post("/admin/services/{$item->id}", [
            'title' => 'Brand Strategy & Sonic Identity',
            'description' => 'Global positioning and audio branding.',
            'sort_order' => 2,
        ]);

        $updateResponse->assertRedirect();
        $this->assertDatabaseHas('service_items', [
            'id' => $item->id,
            'title' => 'Brand Strategy & Sonic Identity',
        ]);

        // 3. Delete service
        $deleteResponse = $this->actingAs($admin)->delete("/admin/services/{$item->id}");
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('service_items', [
            'id' => $item->id,
        ]);
    }

    public function test_home_page_renders_dynamic_services_data(): void
    {
        ServicesSetting::create([
            'tag' => 'ECOSYSTEM',
            'headline_1' => 'Beyond video, we elevate your',
            'headline_2' => 'presence.',
        ]);

        ServiceItem::create([
            'title' => 'Interactive 3D Experiences',
            'description' => 'Spatial computing and VR brand activations.',
            'sort_order' => 1,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('servicesSetting')
            ->has('services')
            ->where('servicesSetting.tag', 'ECOSYSTEM')
            ->where('services.0.title', 'Interactive 3D Experiences')
        );
    }
}
