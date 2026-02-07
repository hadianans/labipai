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
        // Genres table
        Schema::create('genre', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Books table
        Schema::create('book', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author')->nullable();
            $table->string('editor')->nullable();
            $table->string('translator')->nullable();
            $table->string('publisher')->nullable();
            $table->integer('year')->nullable();
            $table->string('language')->nullable();
            $table->integer('page')->nullable();
            $table->integer('volume')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('isbn')->nullable();
            $table->enum('type', ['0', '1'])->default('1'); // 0: Restricted, 1: Open Access
            $table->enum('status', ['0', '1', '2'])->default('0'); // 0: tersedia, 1: dipinjam, 2: hilang
            $table->string('img_url')->nullable();
            $table->boolean('is_show')->default(true); // 0: hide, 1: show
            $table->timestamps();
        });

        // Book genres pivot table
        Schema::create('book_genre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genre')->onDelete('cascade');
            $table->timestamps();
        });

        // Book lending table
        Schema::create('book_lend', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->date('due_date')->nullable();
            $table->date('returned_at')->nullable();
            $table->integer('extension_count')->default(0); // max 2 extensions
            $table->timestamps();
        });

        // Book fines table
        Schema::create('book_fine', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lend_id')->constrained('book_lend')->onDelete('cascade');
            $table->decimal('amount', 10, 2)->default(0); // Rp.500/day (excl. weekend)
            $table->boolean('is_paid')->default(false);
            $table->timestamps();
        });

        // Book favorites table
        Schema::create('book_favorite', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['book_id', 'user_id']);
        });

        // Book reviews table
        Schema::create('book_review', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->integer('star')->default(5); // max 5
            $table->string('review')->nullable();
            $table->timestamps();

            $table->unique(['book_id', 'user_id']);
        });

        // Book copies table
        Schema::create('book_copy', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->string('duplicate_code');
            $table->timestamps();

            $table->unique(['book_id']);
        });

        // Borrow request table
        Schema::create('borrow_request', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('book')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('user')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled', 'expired'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('user')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // 1 hour from request creation
            $table->text('admin_notes')->nullable(); // Notes from admin (e.g., rejection reason)
            $table->timestamps();

            // A user can only have one pending/approved request per book
            $table->index(['book_id', 'user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_review');
        Schema::dropIfExists('book_favorite');
        Schema::dropIfExists('book_fine');
        Schema::dropIfExists('book_lend');
        Schema::dropIfExists('book_genre');
        Schema::dropIfExists('book_copy');
        Schema::dropIfExists('borrow_request');
        Schema::dropIfExists('book');
        Schema::dropIfExists('genre');
    }
};
