<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internship extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'description', 'type', 'location',
        'duration', 'requirements', 'deadline',
    ];

    // type: internship | field_training | industrial_training | attachment
    public function company()
    {
        return $this->belongsTo(Company::class)->select(['id', 'company_name', 'industry']);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
