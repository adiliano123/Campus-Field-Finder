<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'dicklamaswili@gmail.com')->first();

if (!$user) {
    echo "User NOT FOUND - creating now...\n";
    $user = User::create([
        'name'               => 'Admin',
        'email'              => 'dicklamaswili@gmail.com',
        'password'           => Hash::make('Admin@1234'),
        'role'               => 'admin',
        'email_verified_at'  => now(),
    ]);
    echo "Created! ID: {$user->id}\n";
} else {
    echo "User found. ID: {$user->id}, Role: {$user->role}\n";
    // Force update password
    $user->password = Hash::make('Admin@1234');
    $user->role = 'admin';
    $user->email_verified_at = now();
    $user->save();
    echo "Password reset to Admin@1234\n";
}

// Verify it works
$check = Hash::check('Admin@1234', $user->fresh()->password);
echo "Hash check: " . ($check ? "PASS" : "FAIL") . "\n";
