<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

// Check raw DB record
$user = DB::table('users')->where('email', 'dicklamaswili@gmail.com')->first();
echo "DB record:\n";
echo "  id: {$user->id}\n";
echo "  role: {$user->role}\n";
echo "  password length: " . strlen($user->password) . "\n";
echo "  password starts with: " . substr($user->password, 0, 7) . "\n";

// Force raw DB password update
$newHash = Hash::make('Admin@1234');
DB::table('users')
    ->where('email', 'dicklamaswili@gmail.com')
    ->update(['password' => $newHash]);

echo "\nUpdated password hash in DB.\n";
echo "Hash check after update: " . (Hash::check('Admin@1234', $newHash) ? 'PASS' : 'FAIL') . "\n";

// Try Auth::attempt directly
$result = Auth::attempt(['email' => 'dicklamaswili@gmail.com', 'password' => 'Admin@1234']);
echo "Auth::attempt result: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";
