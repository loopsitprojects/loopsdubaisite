<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\BehindTheFilmSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BehindTheFilmTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_behind_the_film_settings(): void
    {
        $response = $this->post('/admin/behind-the-film', [
            'tag' => 'HACKED TAG',
            'title_line_1' => 'Hacked Title',
            'concept_label' => 'Hacked Concept',
            'finish_label' => 'Hacked Finish',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_update_behind_the_film_settings(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/behind-the-film', [
            'tag' => 'CREATIVE PROCESS',
            'title_line_1' => 'From initial sketch to full',
            'title_line_2' => 'cinematic glory.',
            'concept_label' => 'Creative Moodboard',
            'concept_placeholder_text' => '[Custom Storyboard Reference]',
            'concept_image_url' => 'https://example.com/concept.jpg',
            'finish_label' => 'Rendered Commercial',
            'finish_placeholder_text' => '[Custom Render Frame]',
            'finish_image_url' => 'https://example.com/finish.jpg',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('behind_the_film_settings', [
            'tag' => 'CREATIVE PROCESS',
            'title_line_1' => 'From initial sketch to full',
            'title_line_2' => 'cinematic glory.',
            'concept_label' => 'Creative Moodboard',
            'finish_label' => 'Rendered Commercial',
        ]);
    }

    public function test_home_page_receives_behind_the_film_data(): void
    {
        BehindTheFilmSetting::create([
            'tag' => 'OUR CRAFT',
            'title_line_1' => 'Human ingenuity meets',
            'title_line_2' => 'synthetic speed.',
            'concept_label' => 'Hand-drawn frames',
            'concept_placeholder_text' => '[Rough Sketch]',
            'concept_image_url' => null,
            'finish_label' => 'Final 8K Master',
            'finish_placeholder_text' => '[Finished Cut]',
            'finish_image_url' => null,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('behindTheFilm')
            ->where('behindTheFilm.tag', 'OUR CRAFT')
            ->where('behindTheFilm.concept_label', 'Hand-drawn frames')
        );
    }
}
