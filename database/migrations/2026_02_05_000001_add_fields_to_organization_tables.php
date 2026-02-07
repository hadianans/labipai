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
        Schema::table('administrator', function (Blueprint $table) {
            if (!Schema::hasColumn('administrator', 'position')) {
                $table->string('position')->nullable()->after('name');
            }
            if (!Schema::hasColumn('administrator', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('year');
            }
            if (!Schema::hasColumn('administrator', 'is_chief')) {
                $table->boolean('is_chief')->default(false)->after('is_active');
            }
            if (!Schema::hasColumn('administrator', 'img_url')) {
                $table->string('img_url')->nullable()->after('description');
            }
        });

        Schema::table('vision', function (Blueprint $table) {
            if (!Schema::hasColumn('vision', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('year');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrator', function (Blueprint $table) {
            $table->dropColumn(['position', 'is_active', 'is_chief', 'img_url']);
        });

        Schema::table('vision', function (Blueprint $table) {
            $table->dropColumn(['is_active']);
        });
    }
};
