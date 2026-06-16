<?php

namespace App\Repositories;

use App\Models\Application;

class ApplicationRepository
{
    public function getByStudent(int $studentId)
    {
        return Application::with('internship.company')
            ->where('student_id', $studentId)
            ->latest()
            ->get();
    }

    public function getByInternship(int $internshipId)
    {
        return Application::with('student.user')
            ->where('internship_id', $internshipId)
            ->latest()
            ->get();
    }

    public function create(int $studentId, array $data): Application
    {
        return Application::create([
            'student_id'    => $studentId,
            'internship_id' => $data['internship_id'],
            'cover_letter'  => $data['cover_letter'] ?? null,
            'status'        => 'pending',
        ]);
    }

    public function updateStatus(int $id, string $status): Application
    {
        $application = Application::findOrFail($id);
        $application->update(['status' => $status]);
        return $application->fresh('internship.company');
    }
}
