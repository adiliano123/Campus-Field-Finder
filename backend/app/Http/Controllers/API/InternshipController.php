<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\InternshipService;
use Illuminate\Http\Request;

class InternshipController extends Controller
{
    public function __construct(private InternshipService $service) {}

    public function index(Request $request)
    {
        $internships = $this->service->getAll($request->only(['type', 'location', 'search']));
        return response()->json($internships);
    }

    public function show($id)
    {
        $internship = $this->service->findById($id);
        return response()->json($internship);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'type'         => 'required|in:internship,field_training,industrial_training,attachment',
            'location'     => 'required|string',
            'duration'     => 'required|string',
            'requirements' => 'nullable|string',
            'deadline'     => 'required|date|after:today',
        ]);

        $company = $request->user()->company;
        abort_if(!$company || !$company->is_approved, 403, 'Company not approved.');

        $internship = $this->service->create($company->id, $data);
        return response()->json($internship, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'type'         => 'sometimes|in:internship,field_training,industrial_training,attachment',
            'location'     => 'sometimes|string',
            'duration'     => 'sometimes|string',
            'requirements' => 'nullable|string',
            'deadline'     => 'sometimes|date',
        ]);

        $internship = $this->service->update($id, $request->user()->company->id, $data);
        return response()->json($internship);
    }

    public function destroy(Request $request, $id)
    {
        $this->service->delete($id, $request->user()->company->id);
        return response()->json(['message' => 'Deleted.']);
    }
}
