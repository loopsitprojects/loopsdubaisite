<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PortfolioItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_store_or_update_portfolio_item(): void
    {
        $response = $this->post('/admin/portfolio', [
            'title' => 'Test Film',
            'category' => 'None',
        ]);
        $response->assertRedirect('/admin/login');

        $item = PortfolioItem::create([
            'title' => 'Sample Film',
            'category' => 'Real estate',
        ]);

        $updateResponse = $this->patch("/admin/portfolio/{$item->id}", [
            'title' => 'Updated Film',
            'category' => 'None',
        ]);
        $updateResponse->assertRedirect('/admin/login');
    }

    public function test_authenticated_admin_can_create_film_with_none_category(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/portfolio', [
            'title' => 'Commercial Film Project',
            'category' => 'Real estate',
            'duration' => '[1:20]',
            'film_subtitle' => 'Creative Short · In-house',
            'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
            'sort_order' => 10,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('portfolio_items', [
            'title' => 'Commercial Film Project',
            'category' => 'Real estate',
        ]);
    }

    public function test_authenticated_admin_can_update_film_category(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $item = PortfolioItem::create([
            'title' => 'Old Title',
            'category' => 'Tech',
            'duration' => '[0:45]',
            'film_subtitle' => 'Old Subtitle',
            'video_url' => 'https://example.com/video.mp4',
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->patch("/admin/portfolio/{$item->id}", [
            'title' => 'New Title',
            'category' => 'Consumer',
            'duration' => '[0:50]',
            'film_subtitle' => 'New Subtitle',
            'video_url' => 'https://example.com/new.mp4',
            'sort_order' => 1,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $item->refresh();
        $this->assertEquals('Consumer', $item->category);
    }

    public function test_empty_category_defaults_to_real_estate(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/portfolio', [
            'title' => 'Uncategorized Project',
            'category' => '',
            'duration' => '[0:30]',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('portfolio_items', [
            'title' => 'Uncategorized Project',
            'category' => 'Real estate',
        ]);
    }

    public function test_authenticated_admin_can_save_custom_thumbnail_url(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/portfolio', [
            'title' => 'Branded Reel',
            'category' => 'Auto',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
            'video_url' => 'https://example.com/video.mp4',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('portfolio_items', [
            'title' => 'Branded Reel',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
        ]);
    }

    public function test_youtube_video_url_auto_generates_thumbnail(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->actingAs($admin)->post('/admin/portfolio', [
            'title' => 'Asian Paints Causeway',
            'category' => 'Consumer',
            'thumbnail_url' => '',
            'video_url' => 'https://www.youtube.com/watch?v=NZBRpXRW4V0&list=PLbgYKilHGIbE',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('portfolio_items', [
            'title' => 'Asian Paints Causeway',
            'thumbnail_url' => 'https://img.youtube.com/vi/NZBRpXRW4V0/maxresdefault.jpg',
        ]);
    }

    public function test_authenticated_admin_can_upload_thumbnail_file(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');

        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $fakeFile = \Illuminate\Http\UploadedFile::fake()->create('custom_poster.jpg', 50, 'image/jpeg');

        $response = $this->actingAs($admin)->post('/admin/portfolio', [
            'title' => 'Film With Uploaded Poster',
            'category' => 'Tech',
            'thumbnail_file' => $fakeFile,
            'video_url' => 'https://example.com/video.mp4',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $item = PortfolioItem::where('title', 'Film With Uploaded Poster')->first();
        $this->assertNotNull($item);
        $this->assertStringStartsWith('/uploads/portfolio/film_thumb_', $item->thumbnail_url);

        // Clean up test file if it was created in public_path
        if (file_exists(public_path($item->thumbnail_url))) {
            @unlink(public_path($item->thumbnail_url));
        }
    }

    public function test_updating_film_with_youtube_video_auto_sets_video_thumbnail_when_not_updated(): void
    {
        $admin = User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $item = PortfolioItem::create([
            'title' => 'Elyndra Life',
            'category' => 'Real estate',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'video_url' => 'https://youtu.be/MfDawFyD2H0?si=e5Gx4xoXKbBKl8ji',
        ]);

        // Admin updates film title without touching or uploading custom thumbnail
        $response = $this->actingAs($admin)->patch("/admin/portfolio/{$item->id}", [
            'title' => 'Elyndra Life | Belong Beautifully',
            'category' => 'Real estate',
            'thumbnail_url' => $item->thumbnail_url, // left as old unsplash image
            'video_url' => 'https://youtu.be/MfDawFyD2H0?si=e5Gx4xoXKbBKl8ji',
        ]);

        $response->assertRedirect();
        $item->refresh();

        $this->assertEquals('Elyndra Life | Belong Beautifully', $item->title);
        $this->assertEquals('https://img.youtube.com/vi/MfDawFyD2H0/maxresdefault.jpg', $item->thumbnail_url);
    }
}

