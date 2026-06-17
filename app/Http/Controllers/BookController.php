<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Book;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index() {
        $books = Book::all();
        return Inertia::render('Book', ['books' => $books]);
    }
    public function store(Request $request) {
        $validated = $request->validate([
            "title" => "required|min:2|max:100|regex:/^[a-zA-Z0-9\s]+$/",
            "description" => "required|min:2",
            "cover" => "required|image|mimes:jpeg,png,jpg|max:5120",
        ]);

        if($request->hasFile('cover')) {
            $file = $request->file('cover');
            $fileName = Str::slug($validated['title']) . '-' . time() . '.webp';
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file);
            $image->cover(720, 1152);
            $encoded = $image->encodeUsingFileExtension('webp', quality: 85);
            Storage::disk('public')->put('covers/' . $fileName, $encoded->toString());

            $validated['cover'] = $fileName;
            Book::create($validated);
            
            return back()->with(['success' => true, 'message' => 'Book uploaded successfully']);
        } 

        return back()->with(['success' => false, 'message' => 'Book uploaded failed']);

    }
}

