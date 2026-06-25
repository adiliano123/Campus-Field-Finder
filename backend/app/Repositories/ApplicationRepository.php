<?php

namespace App\Repositories;

use App\Models\Application;
use App\Models\Notification;

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
        $application = Application::create([
            'student_id'    => $studentId,
            'internship_id' => $data['internship_id'],
            'cover_letter'  => $data['cover_letter'] ?? null,
            'status'        => 'pending',
        ]);

        $application->load('internship.company.user', 'student.user');

        $companyUserId = $application->internship?->company?->user_id;
        $studentName = $application->student?->user?->name ?? 'A student';
        $title = $application->internship?->title ?? 'an opportunity';

        if ($companyUserId) {
            Notification::create([
                'user_id' => $companyUserId,
                'message' => "{$studentName} applied for \"{$title}\".",
                'type'    => 'info',
            ]);
        }

        return $application->load('internship.company');
    }

    public function updateStatus(int $id, string $status): Application
    {
        $application = Application::with('internship.company', 'student.user')->findOrFail($id);
        $application->update(['status' => $status]);
        $application = $application->fresh('internship.company', 'student.user');

        $studentUserId = $application->student?->user_id;
        $title = $application->internship?->title ?? 'an opportunity';

        if ($studentUserId) {
            Notification::create([
                'user_id' => $studentUserId,
                'message' => "Your application for \"{$title}\" was {$status}.",
                'type'    => $status === 'accepted' ? 'success' : 'warning',
            ]);
        }

        return $application;
    }
}
