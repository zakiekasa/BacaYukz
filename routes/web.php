<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;


use App\Http\Controllers\Auth\PasswordResetController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/books', [HomeController::class, 'books'])->name('books.index');
Route::get('/book/{book:slug}', [HomeController::class, 'bookDetail'])->name('book.show');
Route::post('/chapter/{chapter:id}/quiz/submit', [HomeController::class, 'quizSubmit'])->name('chapter.quiz.submit')->middleware('auth');
Route::get('/book/{book:slug}/{chapter:slug}', [HomeController::class, 'chapterDetail'])->name('chapter.show');
Route::get('/author/{user}', [HomeController::class, 'authorProfile'])->name('author.profile');

Route::get('/communities', [\App\Http\Controllers\CommunityController::class, 'index'])->name('communities.index');
Route::post('/communities', [\App\Http\Controllers\CommunityController::class, 'store'])->name('communities.store')->middleware('auth');
Route::get('/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index'])->name('leaderboard.index');
Route::get('/download', [HomeController::class, 'download'])->name('download');



Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [BookController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard/books', [BookController::class, 'index'])->name('dashboard.books');
    Route::post('/dashboard/books', [BookController::class, 'store'])->name('dashboard.books.store');
    Route::get('/dashboard/books/{book:id}/edit', [BookController::class, 'edit'])->name('dashboard.books.edit');
    Route::put('/dashboard/books/{book:id}', [BookController::class, 'update'])->name('dashboard.books.update');
    Route::delete('/dashboard/books/{book:id}', [BookController::class, 'destroy'])->name('dashboard.books.destroy');
    Route::get('/dashboard/chapters/{chapter:id}/quiz', [BookController::class, 'quizManage'])->name('dashboard.chapters.quiz');
    Route::post('/dashboard/chapters/{chapter:id}/quiz', [BookController::class, 'quizStore'])->name('dashboard.chapters.quiz.store');
    
    Route::get('/dashboard/books/{book:id}/chapters', [ChapterController::class, 'manage'])->name('dashboard.books.chapters');
    Route::get('/dashboard/chapters', [ChapterController::class, 'index'])->name('dashboard.chapter');
    Route::post('/dashboard/chapters', [ChapterController::class, 'store'])->name('dashboard.chapter.store');
    Route::get('/dashboard/chapters/{chapter:id}/edit', [ChapterController::class, 'edit'])->name('dashboard.chapter.edit');
    Route::put('/dashboard/chapters/{chapter:id}', [ChapterController::class, 'update'])->name('dashboard.chapter.update');
    Route::delete('/dashboard/chapters/{chapter:id}', [ChapterController::class, 'destroy'])->name('dashboard.chapter.destroy');
    Route::get('/dashboard/likes', [BookController::class, 'likes'])->name('dashboard.likes');
    Route::post('/dashboard/books/{book:id}/like', [BookController::class, 'toggleLike'])->name('dashboard.books.like');
    Route::post('/notifications/{notification:id}/read', [HomeController::class, 'readNotification'])->name('notifications.read');
    Route::post('/notifications/read-all', [HomeController::class, 'readAllNotifications'])->name('notifications.read-all');
    Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('dashboard.profile');
    Route::put('/dashboard/profile', [ProfileController::class, 'update'])->name('dashboard.profile.update');
    
    Route::get('/dashboard/streak', [\App\Http\Controllers\ReadingStreakController::class, 'index'])->name('dashboard.streak');
    Route::get('/dashboard/history', [BookController::class, 'history'])->name('dashboard.history');
    Route::post('/reading/ping', [\App\Http\Controllers\ReadingStreakController::class, 'ping'])->name('reading.ping');

    Route::post('/logout', [LoginController::class, 'destroy'])->name('login.destroy');
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
    
    Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPasswordForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
});
