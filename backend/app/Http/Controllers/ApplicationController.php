<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    // Apply for a job (applicant only)
    public function apply(Request $request, $jobId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'nullable|string|max:1000',
            'resume' => 'required|file|mimes:pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        if (Auth::user()->role !== 'applicant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $job = Job::findOrFail($jobId);

        // Check if already applied
        $existingApplication = Application::where('user_id', Auth::id())
            ->where('job_id', $jobId)
            ->first();
        if ($existingApplication) {
            return response()->json(['message' => 'You have already applied for this job'], 422);
        }

        // Store resume
        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = Application::create([
            'user_id' => Auth::id(),
            'job_id' => $jobId,
            'message' => $request->message,
            'resume' => $resumePath,
            'status' => 'pending',
        ]);

        return response()->json(['application' => $application], 201);
    }

    // Update resume for an existing application (applicant only)
    public function updateResume(Request $request, $applicationId)
    {
        $validator = Validator::make($request->all(), [
            'resume' => 'required|file|mimes:pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        if (Auth::user()->role !== 'applicant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application = Application::where('id', $applicationId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Delete old resume if exists
        if ($application->resume) {
            Storage::disk('public')->delete($application->resume);
        }

        // Store new resume
        $resumePath = $request->file('resume')->store('resumes', 'public');
        $application->update(['resume' => $resumePath]);

        return response()->json(['message' => 'Resume updated successfully', 'resume' => asset('storage/' . $resumePath)], 200);
    }

    // Get applications for a job (employer only)
    public function getApplications($jobId)
    {
        $job = Job::findOrFail($jobId);
        if ($job->user_id !== Auth::id() || Auth::user()->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch applications with user details and resume URL
        $applications = Application::where('job_id', $jobId)
            ->with('user:id,name,email')
            ->get()
            ->map(function ($application) {
                $application->resume_url = $application->resume ? asset('storage/' . $application->resume) : null;
                return $application;
            });

        return response()->json(['applications' => $applications], 200);
    }

    // Get applications for the authenticated user (applicant only)
    public function getUserApplications()
    {
        if (Auth::user()->role !== 'applicant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $applications = Application::where('user_id', Auth::id())
            ->with('job')
            ->get()
            ->map(function ($application) {
                $application->resume_url = $application->resume ? asset('storage/' . $application->resume) : null;
                return $application;
            });

        return response()->json(['applications' => $applications], 200);
    }
}
