<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'username' => 'superadmin',
            'email' => 'superadmin@baitulhikmah.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SUPER_ADMIN,
            'status' => '1',
            'phone' => '081234567890',
        ]);

        // Admin
        User::create([
            'username' => 'admin',
            'email' => 'admin@baitulhikmah.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'status' => '1',
            'phone' => '081234567891',
        ]);

        // Regular Users
        $users = [
            ['username' => 'ahmad', 'email' => 'ahmad@student.upi.edu'],
            ['username' => 'fatimah', 'email' => 'fatimah@student.upi.edu'],
            ['username' => 'ibrahim', 'email' => 'ibrahim@student.upi.edu'],
            ['username' => 'aisyah', 'email' => 'aisyah@student.upi.edu'],
            ['username' => 'umar', 'email' => 'umar@student.upi.edu'],
        ];

        foreach ($users as $user) {
            User::create([
                'username' => $user['username'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_USER,
                'status' => '1',
            ]);
        }
    }
}
