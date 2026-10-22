<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicesSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag',
        'headline_1',
        'headline_2',
    ];
}
