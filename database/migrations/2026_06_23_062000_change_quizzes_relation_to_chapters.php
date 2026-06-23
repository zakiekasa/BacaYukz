<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (Schema::hasColumn('quizzes', 'book_id')) {
                $table->dropForeign(['book_id']);
                $table->dropColumn('book_id');
            }
            if (!Schema::hasColumn('quizzes', 'chapter_id')) {
                $table->foreignId('chapter_id')->after('id')->constrained('chapters')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (Schema::hasColumn('quizzes', 'chapter_id')) {
                $table->dropForeign(['chapter_id']);
                $table->dropColumn('chapter_id');
            }
            if (!Schema::hasColumn('quizzes', 'book_id')) {
                $table->foreignId('book_id')->after('id')->constrained('books')->onDelete('cascade');
            }
        });
    }
};
