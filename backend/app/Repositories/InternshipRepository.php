<?php

namespace App\Repositories;

use App\Models\Internship;

class InternshipRepository
{
    public function getAll(array $filters = [])
    {
        $query = Internship::with('company');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['location'])) {
            $query->where('location', 'like', '%' . $filters['location'] . '%');
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->latest()->get();
    }

    public function findById(int $id): Internship
    {
        return Internship::with('company')->findOrFail($id);
    }

    public function create(int $companyId, array $data): Internship
    {
        return Internship::create(array_merge($data, ['company_id' => $companyId]));
    }

    public function update(int $id, int $companyId, array $data): Internship
    {
        $internship = Internship::where('id', $id)->where('company_id', $companyId)->firstOrFail();
        $internship->update($data);
        return $internship->fresh('company');
    }

    public function delete(int $id, int $companyId): void
    {
        Internship::where('id', $id)->where('company_id', $companyId)->firstOrFail()->delete();
    }
}
