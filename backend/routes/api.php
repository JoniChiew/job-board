<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Job routes
Route::middleware('auth:api')->group(function () {
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/employer', [JobController::class, 'employerJobs']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::post('/jobs/{jobId}/apply', [ApplicationController::class, 'apply']);
    Route::post('/applications/{applicationId}/resume', [ApplicationController::class, 'updateResume']);
    Route::get('/jobs/{jobId}/applications', [ApplicationController::class, 'getApplications']);
    Route::get('/applications', [ApplicationController::class, 'getUserApplications']);
});
Route::get('/jobs', [JobController::class, 'index']);
