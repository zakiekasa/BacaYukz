<?php

use Illuminate\Support\Facades\Route;


Route::inertia('/', 'home')->name('home');
Route::inertia('/dashboard', 'dashboard')->name('dashboard');
Route::inertia('/register', 'register')->name('register');
Route::inertia('/login', 'login')->name('login');