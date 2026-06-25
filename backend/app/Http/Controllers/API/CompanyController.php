<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Company;
use App\Models\Internship;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Company::with('user:id,name,email')->get());
    }

    public function show($id)
    {
        return response()->json(Company::with('user:id,name,email')->findOrFail($id));
    }

    public function profile(Request $request)
    {
        return response()->json($request->user()->company);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry'     => 'nullable|string|max:255',
            'location'     => 'nullable|string|max:255',
            'website'      => 'nullable|url',
            'description'  => 'nullable|string',
        ]);

        $company = $request->user()->company
            ?? Company::create(array_merge($data, ['user_id' => $request->user()->id]));

        $company->update($data);
        return response()->json($company);
    }

    public function stats(Request $request)
    {
        $company = $request->user()->company;
        abort_if(!$company, 403, 'Company profile not found.');

        $internshipIds = Internship::where('company_id', $company->id)->pluck('id');

        return response()->json([
            'active_listings'    => $internshipIds->count(),
            'total_applications' => Application::whereIn('internship_id', $internshipIds)->count(),
            'accepted'           => Application::whereIn('internship_id', $internshipIds)->where('status', 'accepted')->count(),
            'pending'            => Application::whereIn('internship_id', $internshipIds)->where('status', 'pending')->count(),
        ]);
    }
}
