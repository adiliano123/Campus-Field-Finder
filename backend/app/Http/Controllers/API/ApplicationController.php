<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\ApplicationRepository;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(private ApplicationRepository $repo) {}

    // Student: get own applications
    public function index(Request $request)
    {
        $student = $request->user()->student;
        abort_if(!$student, 403, 'Student profile not found.');
        return response()->json($this->repo->getByStudent($student->id));
    }

    // Company: get applications for a specific internship
    public function byInternship(Request $request, $internshipId)
    {
        return response()->json($this->repo->getByInternship($internshipId));
    }

    // Student: apply
    public function store(Request $request)
    {
        $data = $request->validate([
            'internship_id' => 'required|exists:internships,id',
            'cover_letter'  => 'nullable|string',
        ]);

        $student = $request->user()->student;
        abort_if(!$student, 403, 'Student profile not found.');

        $application = $this->repo->create($student->id, $data);
        return response()->json($application, 201);
    }

    // Company: update application status
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $application = $this->repo->updateStatus($id, $data['status']);
        return response()->json($application);
    }
}
