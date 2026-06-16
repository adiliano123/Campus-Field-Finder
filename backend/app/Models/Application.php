<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'internship_id', 'cover_letter', 'status'];

    // status: pending | accepted | rejected
    public function student()
    {
        return $this->belongsTo(Student::class)->with('user:id,name,email');
    }

    public function internship()
    {
        return $this->belongsTo(Internship::class)->with('company');
    }
}
