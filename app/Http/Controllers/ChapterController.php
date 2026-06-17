<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Mews\Purifier\Facades\Purifier;
use App\Models\Chapter;

class ChapterController extends Controller
{
    public function index() {
        $books = \App\Models\Book::all();
        return Inertia::render('Chapter', ['books' => $books]);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            "book_id" => "required|exists:books,id",
            "title" => "required|string|max:100",
            "content" => "required|string"
        ]);

        $validatedData['content'] = Purifier::clean($validatedData['content']);

        Chapter::create($validatedData);

        return back()->with(['message' => 'Chapter created successfully', "success" => true]);
    }
}
