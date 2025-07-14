<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    // Create a new job (employer only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'is_remote' => 'boolean',
            'status' => 'required|in:closed,active,draft,filled',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        if (Auth::user()->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $job = Job::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'salary_range' => $request->salary_range,
            'is_remote' => $request->is_remote ?? false,
            'status' => $request->status,
        ]);

        return response()->json(['job' => $job], 201);
    }

    // Get all published jobs (public)
    public function index()
    {
        $jobs = Job::where('status', 'active')->get();
        return response()->json(['jobs' => $jobs], 200);
    }

    // Get jobs created by the authenticated employer
    public function employerJobs()
    {
        if (Auth::user()->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jobs = Job::where('user_id', Auth::id())->get();
        return response()->json(['jobs' => $jobs], 200);
    }

    // Update a job (employer only)
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'is_remote' => 'boolean',
            'status' => 'sometimes|in:closed,active,draft,filled',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        $job = Job::findOrFail($id);
        if ($job->user_id !== Auth::id() || Auth::user()->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $job->update($request->only(['title', 'description', 'location', 'salary_range', 'is_remote', 'status']));
        return response()->json(['job' => $job], 200);
    }

    // Delete a job (employer only)
    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        if ($job->user_id !== Auth::id() || Auth::user()->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $job->delete();
        return response()->json(['message' => 'Job deleted'], 200);
    }
}
