<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Internship;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_students'    => User::where('role', 'student')->count(),
            'total_companies'   => User::where('role', 'company')->count(),
            'pending_companies' => Company::where('is_approved', false)->count(),
            'total_internships' => Internship::count(),
        ]);
    }

    public function companies()
    {
        // Return all users with role=company, with their company profile if it exists
        $users = \App\Models\User::where('role', 'company')
            ->with('company')
            ->get()
            ->map(function ($user) {
                $company = $user->company;
                return [
                    'id'           => $company?->id ?? $user->id,
                    'user_id'      => $user->id,
                    'company_name' => $company?->company_name ?? $user->name,
                    'industry'     => $company?->industry,
                    'location'     => $company?->location,
                    'website'      => $company?->website,
                    'description'  => $company?->description,
                    'is_approved'  => $company?->is_approved ?? false,
                    'user'         => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
                ];
            });

        return response()->json($users);
    }

    public function approveCompany($id)
    {
        $company = Company::findOrFail($id);
        $company->update(['is_approved' => true]);
        return response()->json(['message' => 'Company approved.', 'company' => $company]);
    }

    public function rejectCompany($id)
    {
        $company = Company::findOrFail($id);
        $company->update(['is_approved' => false]);
        return response()->json(['message' => 'Company rejected.', 'company' => $company]);
    }

    public function students()
    {
        return response()->json(
            User::where('role', 'student')->with('student')->get()
        );
    }

    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted.']);
    }
}
