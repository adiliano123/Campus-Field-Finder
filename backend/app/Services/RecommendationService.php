<?php

namespace App\Services;

use App\Models\Internship;
use App\Models\Student;

class RecommendationService
{
    /**
     * Return internships that match the student's course/field.
     * Simple keyword-based matching — can be upgraded to ML later.
     */
    public function recommend(Student $student, int $limit = 6)
    {
        $keywords = $this->extractKeywords($student->course ?? '');

        if (empty($keywords)) {
            return Internship::with('company')
                ->where('deadline', '>=', now())
                ->latest()
                ->limit($limit)
                ->get();
        }

        return Internship::with('company')
            ->where('deadline', '>=', now())
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('title', 'like', "%{$kw}%")
                      ->orWhere('description', 'like', "%{$kw}%")
                      ->orWhere('requirements', 'like', "%{$kw}%");
                }
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    private function extractKeywords(string $course): array
    {
        // Strip common stop words and return meaningful tokens
        $stopWords = ['of', 'and', 'in', 'the', 'a', 'an', 'for', 'to'];
        $words = preg_split('/\s+/', strtolower(trim($course)));
        return array_values(array_filter($words, fn($w) => strlen($w) > 2 && !in_array($w, $stopWords)));
    }
}
