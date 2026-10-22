<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\AboutSetting;
use App\Models\TeamMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_about_settings(): void
    {
        $response = $this->post('/admin/about', [
            'tag' => 'HACKED ABOUT',
            'headline' => 'Hacked Headline',
            'description' => 'Hacked description',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_about_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/about', [
            'tag' => 'OUR PHILOSOPHY',
            'headline' => 'Built for visionaries.',
            'description' => 'Two decades of combined filmmaking prowess.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('about_settings', [
            'tag' => 'OUR PHILOSOPHY',
            'headline' => 'Built for visionaries.',
            'description' => 'Two decades of combined filmmaking prowess.',
        ]);
    }

    public function test_authenticated_admin_can_manage_team_members(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        // 1. Create team member
        $response = $this->actingAs($admin)->post('/admin/team-members', [
            'name' => 'Marcus Vance',
            'role' => 'Executive Creative Director',
            'photo_url' => 'https://example.com/marcus.jpg',
            'sort_order' => 1,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('team_members', [
            'name' => 'Marcus Vance',
            'role' => 'Executive Creative Director',
        ]);

        $member = TeamMember::where('name', 'Marcus Vance')->first();

        // 2. Update team member
        $updateResponse = $this->actingAs($admin)->post("/admin/team-members/{$member->id}", [
            'name' => 'Marcus Vance OBE',
            'role' => 'Chief Creative Officer',
            'photo_url' => 'https://example.com/marcus2.jpg',
            'sort_order' => 1,
        ]);

        $updateResponse->assertRedirect();
        $this->assertDatabaseHas('team_members', [
            'id' => $member->id,
            'name' => 'Marcus Vance OBE',
            'role' => 'Chief Creative Officer',
        ]);

        // 3. Delete team member
        $deleteResponse = $this->actingAs($admin)->delete("/admin/team-members/{$member->id}");
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('team_members', [
            'id' => $member->id,
        ]);
    }

    public function test_home_page_renders_dynamic_about_and_team_data(): void
    {
        AboutSetting::create([
            'tag' => 'CREATIVE LEADERSHIP',
            'headline' => 'Global vision, Dubai precision.',
            'description' => 'Decades of tier-1 agency and cinema experience.',
        ]);

        TeamMember::create([
            'name' => 'Elena Rostova',
            'role' => 'Head of AI Direction',
            'photo_url' => 'https://example.com/elena.jpg',
            'sort_order' => 1,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('about')
            ->has('teamMembers')
            ->where('about.tag', 'CREATIVE LEADERSHIP')
            ->where('teamMembers.0.name', 'Elena Rostova')
        );
    }
}
