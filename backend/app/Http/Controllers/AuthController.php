<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'role' => 'required|in:employer,applicant',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            // Generate Passport token
            $token = $user->createToken('auth_token')->accessToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            return response()->json(['message' => 'Registration failed, please try again'], 500);
        }
    }

    // Login user and return token
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    // Send password reset link
    public function forgotPassword(Request $request)
    {
        Log::info("Forgot password request received for email: " . $request->email); // Debug log
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            Log::error("Validation failed: " . json_encode($validator->errors())); // Debug log
            return response()->json(['message' => $validator->errors()], 422);
        }

        try {
            $status = Password::sendResetLink($request->only('email'));
            Log::info("Password reset status: " . $status); // Debug log
            return $status === Password::RESET_LINK_SENT
                ? response()->json(['message' => 'Password reset link sent to your email'], 200)
                : response()->json(['message' => 'Unable to send reset link'], 422);
        } catch (\Exception $e) {
            Log::error('Failed to send reset link: ' . $e->getMessage()); // Debug log
            return response()->json(['message' => 'Failed to send reset link'], 500);
        }
    }

    // Reset password
    public function resetPassword(Request $request)
    {
        Log::info("Reset password request received for email: " . $request->email); // Debug log
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error("Validation failed: " . json_encode($validator->errors())); // Debug log
            return response()->json(['message' => $validator->errors()], 422);
        }

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                }
            );

            Log::info("Password reset status: " . $status); // Debug log
            return $status === Password::PASSWORD_RESET
                ? response()->json(['message' => 'Password reset successfully'], 200)
                : response()->json(['message' => 'Invalid token or email'], 400);
        } catch (\Exception $e) {
            Log::error('Password reset failed: ' . $e->getMessage()); // Debug log
            return response()->json(['message' => 'Password reset failed'], 500);
        }
    }
}
