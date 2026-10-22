<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandLogo extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_url',
        'sort_order',
        'is_active',
    ];
}
