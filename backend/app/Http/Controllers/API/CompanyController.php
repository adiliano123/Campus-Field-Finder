<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
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
}
