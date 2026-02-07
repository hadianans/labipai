<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['0', '1', '2'])->default('2'); // 0: super admin, 1: admin, 2: user
            $table->enum('status', ['0', '1'])->default('0'); // 0: non active, 1: active
            $table->string('phone')->nullable();
            $table->string('img_url')->nullable(); // profile photo, max 1MB
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
