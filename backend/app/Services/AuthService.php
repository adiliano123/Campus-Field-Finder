<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
        ]);

        // Auto-create profile record so the user appears in listings immediately
        if ($data['role'] === 'company') {
            $user->company()->create([
                'company_name' => $data['name'],
                'is_approved'  => false,
            ]);

            User::where('role', 'admin')->each(function ($admin) use ($user) {
                Notification::create([
                    'user_id' => $admin->id,
                    'message' => "New company \"{$user->name}\" registered and awaits approval.",
                    'type'    => 'info',
                ]);
            });
        } elseif ($data['role'] === 'student') {
            $user->student()->create([]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $credentials): array|false
    {
        if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            return false;
        }

        $user = Auth::user();
        $user->tokens()->delete(); // revoke old tokens
        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
