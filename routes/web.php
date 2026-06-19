<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/book/{book:slug}', [HomeController::class, 'bookDetail'])->name('book.show');
Route::get('/book/{book:slug}/{chapter:slug}', [HomeController::class, 'chapterDetail'])->name('chapter.show');


Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [BookController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard/books', [BookController::class, 'index'])->name('dashboard.books');
    Route::post('/dashboard/books', [BookController::class, 'store'])->name('dashboard.books.store');
    Route::get('/dashboard/books/{book:id}/edit', [BookController::class, 'edit'])->name('dashboard.books.edit');
    Route::put('/dashboard/books/{book:id}', [BookController::class, 'update'])->name('dashboard.books.update');
    Route::delete('/dashboard/books/{book:id}', [BookController::class, 'destroy'])->name('dashboard.books.destroy');
    
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
    Route::post('/logout', [LoginController::class, 'destroy'])->name('login.destroy');
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});
