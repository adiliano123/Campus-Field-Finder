<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SavedInternship;
use Illuminate\Http\Request;

class SavedInternshipController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        abort_if(!$student, 403, 'Student profile not found.');

        $saved = SavedInternship::with('internship.company')
            ->where('student_id', $student->id)
            ->latest()
            ->get()
            ->map(fn ($item) => $item->internship)
            ->filter();

        return response()->json($saved->values());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'internship_id' => 'required|exists:internships,id',
        ]);

        $student = $request->user()->student;
        abort_if(!$student, 403, 'Student profile not found.');

        $saved = SavedInternship::firstOrCreate([
            'student_id'    => $student->id,
            'internship_id' => $data['internship_id'],
        ]);

        return response()->json($saved->load('internship.company'), 201);
    }

    public function destroy(Request $request, $internshipId)
    {
        $student = $request->user()->student;
        abort_if(!$student, 403, 'Student profile not found.');

        SavedInternship::where('student_id', $student->id)
            ->where('internship_id', $internshipId)
            ->delete();

        return response()->json(['message' => 'Opportunity removed from saved list.']);
    }
}
