<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_work_settings(): void
    {
        $response = $this->post('/admin/work-settings', [
            'tag' => 'HACKED TAG',
            'headline_prefix' => 'Hacked',
            'headline_highlight' => 'Work',
            'headline_suffix' => 'Section',
            'subtitle' => 'Hacked subtitle text.',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_work_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/work-settings', [
            'tag' => 'FEATURED REELS',
            'headline_prefix' => 'Discover our',
            'headline_highlight' => 'AI cinematic',
            'headline_suffix' => 'universe.',
            'subtitle' => 'Filter by sector. Every film combines AI precision with human directorial vision.',
            'badge_tag_1' => 'Generative AI',
            'badge_tag_2' => 'Director Cut',
            'services_cta_text' => 'Explore all services',
            'services_cta_link' => '/#services',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('work_settings', [
            'tag' => 'FEATURED REELS',
            'headline_prefix' => 'Discover our',
            'headline_highlight' => 'AI cinematic',
            'headline_suffix' => 'universe.',
            'subtitle' => 'Filter by sector. Every film combines AI precision with human directorial vision.',
            'badge_tag_1' => 'Generative AI',
            'badge_tag_2' => 'Director Cut',
            'services_cta_text' => 'Explore all services',
            'services_cta_link' => '/#services',
        ]);
    }

    public function test_work_page_renders_with_work_settings(): void
    {
        WorkSetting::create([
            'tag' => 'EXCLUSIVE SHOWCASE',
            'headline_prefix' => 'Our bespoke',
            'headline_highlight' => 'AI film',
            'headline_suffix' => 'craft.',
            'subtitle' => 'Handcrafted stories rendered with next-gen models.',
            'badge_tag_1' => 'Next-Gen AI',
            'badge_tag_2' => 'Master Directed',
            'services_cta_text' => 'See our full suite',
            'services_cta_link' => '/#services',
        ]);

        $response = $this->get('/work');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Work')
            ->has('workSetting')
            ->where('workSetting.tag', 'EXCLUSIVE SHOWCASE')
            ->where('workSetting.headline_prefix', 'Our bespoke')
            ->where('workSetting.headline_highlight', 'AI film')
            ->where('workSetting.headline_suffix', 'craft.')
            ->where('workSetting.badge_tag_1', 'Next-Gen AI')
            ->where('workSetting.badge_tag_2', 'Master Directed')
            ->where('workSetting.services_cta_text', 'See our full suite')
        );
    }

    public function test_admin_dashboard_provides_work_settings(): void
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
            ->has('workSetting')
        );
    }
}
