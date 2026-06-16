<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json($request->user()->student);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'university'    => 'nullable|string|max:255',
            'course'        => 'nullable|string|max:255',
            'year_of_study' => 'nullable|integer|min:1|max:10',
            'bio'           => 'nullable|string',
            'cv_url'        => 'nullable|url',
        ]);

        $student = $request->user()->student
            ?? Student::create(array_merge($data, ['user_id' => $request->user()->id]));

        $student->update($data);
        return response()->json($student);
    }
}
