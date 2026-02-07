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
        // Administrators table - pengurus laboratorium
        Schema::create('administrator', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name');
            $table->integer('year');
            $table->string('phone')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Visions table - visi kepengurusan
        Schema::create('vision', function (Blueprint $table) {
            $table->id();
            $table->string('vision_point');
            $table->integer('year');
            $table->timestamps();
        });

        // Mission points table
        Schema::create('mission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vision_id')->constrained('vision')->onDelete('cascade');
            $table->string('mission_point');
            $table->timestamps();
        });

        // Departments table
        // Schema::create('department', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name'); // Rumah Tangga, Media, IT, Kajian Keilmuan
        //     $table->string('description')->nullable();
        //     $table->timestamps();
        // });

        // Department members pivot table
        // Schema::create('department_member', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('department_id')->constrained('department')->onDelete('cascade');
        //     $table->foreignId('administrator_id')->constrained('administrator')->onDelete('cascade');
        //     $table->integer('year');
        //     $table->timestamps();
        // });

        // Programs table
        Schema::create('program', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('detail_url')->nullable();
            $table->string('img_url')->nullable();
            $table->timestamps();
        });

        // Program members pivot table
        // Schema::create('program_member', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('program_id')->constrained('program')->onDelete('cascade');
        //     $table->foreignId('administrator_id')->constrained('administrator')->onDelete('cascade');
        //     $table->integer('year');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('program_member');
        Schema::dropIfExists('program');
        // Schema::dropIfExists('department_member');
        // Schema::dropIfExists('department');
        Schema::dropIfExists('mission');
        Schema::dropIfExists('vision');
        Schema::dropIfExists('administrator');
    }
};
