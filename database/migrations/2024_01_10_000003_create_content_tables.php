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
        // Categories table (for articles)
        Schema::create('category', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Articles table
        Schema::create('article', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt')->nullable();
            $table->text('content')->nullable();
            $table->string('author');
            $table->enum('status', ['0', '1'])->default('0'); // 0: archive, 1: publish
            $table->timestamps();
        });

        // Article assets table
        Schema::create('article_asset', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('article')->onDelete('cascade');
            $table->string('img_url');
            $table->string('alt_text')->nullable();
            $table->timestamps();
        });

        // Article categories pivot table
        Schema::create('article_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('article')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('category')->onDelete('cascade');
            $table->timestamps();
        });

        // Tags table (for gallery)
        Schema::create('tag', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Gallery table
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('img_url');
            $table->boolean('is_hero')->default(false); // for hero section slider
            $table->timestamps();
        });

        // Gallery tags pivot table
        Schema::create('gallery_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('gallery')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tag')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_tag');
        Schema::dropIfExists('gallery');
        Schema::dropIfExists('tag');
        Schema::dropIfExists('article_category');
        Schema::dropIfExists('article_asset');
        Schema::dropIfExists('article');
        Schema::dropIfExists('category');
    }
};
