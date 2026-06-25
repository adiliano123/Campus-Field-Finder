<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Internship;
use App\Models\Notification;
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

        Notification::create([
            'user_id' => $company->user_id,
            'message' => "Your company \"{$company->company_name}\" has been approved. You can now post opportunities.",
            'type'    => 'success',
        ]);

        return response()->json(['message' => 'Company approved.', 'company' => $company]);
    }

    public function rejectCompany($id)
    {
        $company = Company::findOrFail($id);
        $company->update(['is_approved' => false]);

        Notification::create([
            'user_id' => $company->user_id,
            'message' => "Your company \"{$company->company_name}\" registration was not approved.",
            'type'    => 'warning',
        ]);

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

    // Admin: delete any internship
    public function deleteInternship($id)
    {
        $internship = Internship::findOrFail($id);
        $internship->delete();
        return response()->json(['message' => 'Internship deleted.']);
    }

    /**
     * GET /admin/applications
     * All applications platform-wide with student user + internship + company.
     */
    public function applications()
    {
        $apps = \App\Models\Application::with([
            'student.user:id,name,email',
            'internship.company:id,company_name,industry',
        ])
            ->latest()
            ->get()
            ->map(function ($app) {
                return [
                    'id'           => $app->id,
                    'status'       => $app->status,
                    'cover_letter' => $app->cover_letter,
                    'applied_at'   => $app->created_at,
                    'student' => [
                        'name'  => $app->student?->user?->name,
                        'email' => $app->student?->user?->email,
                    ],
                    'internship' => [
                        'id'      => $app->internship?->id,
                        'title'   => $app->internship?->title,
                        'company' => [
                            'company_name' => $app->internship?->company?->company_name,
                        ],
                    ],
                ];
            });

        return response()->json($apps);
    }
}
