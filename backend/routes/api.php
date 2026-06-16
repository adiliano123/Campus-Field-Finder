<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\InternshipController;
use App\Http\Controllers\API\ApplicationController;
use App\Http\Controllers\API\AdminController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('internships',      [InternshipController::class, 'index']);
Route::get('internships/{id}', [InternshipController::class, 'show']);
Route::get('companies',        [CompanyController::class, 'index']);
Route::get('companies/{id}',   [CompanyController::class, 'show']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('auth/logout',          [AuthController::class, 'logout']);
    Route::get('auth/me',               [AuthController::class, 'me']);
    Route::put('auth/change-password',  [AuthController::class, 'changePassword']);

    // Student routes
    Route::middleware('role:student')->group(function () {
        Route::get('student/profile',    [StudentController::class, 'profile']);
        Route::put('student/profile',    [StudentController::class, 'updateProfile']);
        Route::get('applications',       [ApplicationController::class, 'index']);
        Route::post('applications',      [ApplicationController::class, 'store']);
    });

    // Company routes
    Route::middleware('role:company')->group(function () {
        Route::get('company/profile',    [CompanyController::class, 'profile']);
        Route::put('company/profile',    [CompanyController::class, 'updateProfile']);
        Route::post('internships',       [InternshipController::class, 'store']);
        Route::put('internships/{id}',   [InternshipController::class, 'update']);
        Route::delete('internships/{id}',[InternshipController::class, 'destroy']);
        Route::get('internships/{id}/applications', [ApplicationController::class, 'byInternship']);
        Route::patch('applications/{id}/status',    [ApplicationController::class, 'updateStatus']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('stats',                  [AdminController::class, 'stats']);
        Route::get('companies',              [AdminController::class, 'companies']);
        Route::patch('companies/{id}/approve', [AdminController::class, 'approveCompany']);
        Route::patch('companies/{id}/reject',  [AdminController::class, 'rejectCompany']);
        Route::get('students',               [AdminController::class, 'students']);
        Route::delete('users/{id}',          [AdminController::class, 'deleteUser']);
    });
});
