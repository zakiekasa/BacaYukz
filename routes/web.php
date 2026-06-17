<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\HomeController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/book/{book:slug}', [HomeController::class, 'bookDetail'])->name('book.show');
Route::get('/book/{book:slug}/{chapter:slug}', [HomeController::class, 'chapterDetail'])->name('chapter.show');


Route::middleware('auth')->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard/books', [BookController::class, 'index'])->name('dashboard.books');
    Route::post('/dashboard/books', [BookController::class, 'store'])->name('dashboard.books.store');
    Route::get('/dashboard/chapters', [ChapterController::class, 'index'])->name('dashboard.chapter');
    Route::post('/dashboard/chapters', [ChapterController::class, 'store'])->name('dashboard.chapter.store');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('login.destroy');
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});
