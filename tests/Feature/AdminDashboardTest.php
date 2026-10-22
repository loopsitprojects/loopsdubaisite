<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_admin_login(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_login_page_loads_successfully(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    public function test_generic_login_route_loads_successfully(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        User::create([
            'name' => 'Loops Admin',
            'email' => 'admin@loopsdubai.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'admin@loopsdubai.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticated();
    }
}
