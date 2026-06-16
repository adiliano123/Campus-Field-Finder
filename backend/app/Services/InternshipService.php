<?php

namespace App\Services;

use App\Repositories\InternshipRepository;

class InternshipService
{
    public function __construct(private InternshipRepository $repo) {}

    public function getAll(array $filters = [])
    {
        return $this->repo->getAll($filters);
    }

    public function findById(int $id)
    {
        return $this->repo->findById($id);
    }

    public function create(int $companyId, array $data)
    {
        return $this->repo->create($companyId, $data);
    }

    public function update(int $id, int $companyId, array $data)
    {
        return $this->repo->update($id, $companyId, $data);
    }

    public function delete(int $id, int $companyId): void
    {
        $this->repo->delete($id, $companyId);
    }
}
