<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\Chapter;

class HomeController extends Controller
{
    public function index() {
        $books = Book::all();
        
        return Inertia::render('Home/Index', [
            'books' => $books
        ]);
    }

    public function bookDetail(Book $book) {
        $book->load(['chapters' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('Home/Book', [
            'book' => $book
        ]);
    }

    public function chapterDetail(Book $book, Chapter $chapter) {
        $chapter->increment('view');

        $previousChapter = Chapter::where('book_id', $book->id)
            ->where('id', '<', $chapter->id)
            ->orderBy('id', 'desc')
            ->first();

        $nextChapter = Chapter::where('book_id', $book->id)
            ->where('id', '>', $chapter->id)
            ->orderBy('id', 'asc')
            ->first();

        return Inertia::render('Home/Chapter', [
            'book' => $book,
            'chapter' => $chapter,
            'previous_chapter' => $previousChapter,
            'next_chapter' => $nextChapter
        ]);
    }
}
