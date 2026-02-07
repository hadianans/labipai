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
        // Courses table
        Schema::create('course', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('level', ['0', '1', '2', '3'])->default('0'); // 0: beginner, 1: intermediate, 2: advanced, 3: expert
            $table->enum('status', ['0', '1'])->default('0'); // 0: draft, 1: published
            $table->timestamps();
        });

        // Course modules table
        Schema::create('course_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('course')->onDelete('cascade');
            $table->string('title');
            $table->string('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Course contents table
        Schema::create('course_content', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_module')->onDelete('cascade');
            $table->enum('type', ['0', '1'])->default('0'); // 0: text, 1: video
            $table->string('title');
            $table->string('content_url')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Course enrollments table
        Schema::create('course_enrollment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('course')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->timestamp('enrolled_at')->nullable();
            $table->integer('progress')->default(0); // percentage
            $table->timestamps();

            $table->unique(['course_id', 'user_id']);
        });

        // Activity logs table
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('course')->onDelete('cascade');
            $table->foreignId('content_id')->constrained('course_content')->onDelete('cascade');
            $table->enum('status', ['0', '1'])->default('0'); // 0: undone, 1: done
            $table->timestamp('accessed_at')->nullable();
            $table->timestamps();
        });

        // Course reviews table
        Schema::create('course_review', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('course')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->integer('star')->default(5); // max 5
            $table->string('review')->nullable();
            $table->timestamps();

            $table->unique(['course_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_review');
        Schema::dropIfExists('activity_log');
        Schema::dropIfExists('course_enrollment');
        Schema::dropIfExists('course_content');
        Schema::dropIfExists('course_module');
        Schema::dropIfExists('course');
    }
};
