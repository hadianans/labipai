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
        // Contacts table
        Schema::create('contact', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // email, whatsapp, instagram, twitter, youtube, telegram
            $table->string('detail');
            $table->timestamps();
        });

        // Rooms table - room booking
        Schema::create('room', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->foreignId('user_id')->nullable()->constrained('user')->onDelete('set null');
            $table->timestamps();
        });

        // Calendar events table
        Schema::create('calendar', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->timestamps();
        });

        // Announcements table
        Schema::create('announcement', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content')->nullable();
            $table->string('img_url')->nullable();
            $table->string('action_url')->nullable(); // CTA link
            $table->enum('priority', ['0', '1', '2'])->default('1'); // 0: low, 1: standard, 2: important
            $table->enum('type', ['0', '1'])->default('1'); // 0: pop-up, 1: section
            $table->enum('status', ['0', '1'])->default('0'); // 0: draft, 1: publish
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->timestamps();
        });

        // Feedbacks table
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('user')->onDelete('set null');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('announcement');
        Schema::dropIfExists('calendar');
        Schema::dropIfExists('room');
        Schema::dropIfExists('contact');
    }
};
