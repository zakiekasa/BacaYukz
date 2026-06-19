<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\Chapter;

class HomeController extends Controller
{
    public function index() {
        $books = Book::with('genres')->latest()->get();
        $genres = \App\Models\Genre::all();
        
        return Inertia::render('Home/Index', [
            'books' => $books,
            'genres' => $genres,
        ]);
    }
    public function bookDetail(Book $book) {
        $book->load(['genres', 'user']);
        
        // Only load published chapters for the public book detail view
        $book->setRelation('chapters', $book->chapters()->where('is_draft', false)->orderBy('created_at', 'desc')->get());

        $isLiked = false;
        if (auth()->check()) {
            $isLiked = $book->likedByUsers()->where('user_id', auth()->id())->exists();
        }

        return Inertia::render('Home/Book', [
            'book' => $book,
            'isLiked' => $isLiked,
        ]);
    }

    public function chapterDetail(Book $book, Chapter $chapter) {
        // If chapter is a draft, only allow the book owner to view it
        if ($chapter->is_draft) {
            if (!auth()->check() || $book->user_id !== auth()->id()) {
                abort(404);
            }
        }

        $chapter->increment('view');

        $previousChapter = Chapter::where('book_id', $book->id)
            ->where('is_draft', false)
            ->where('id', '<', $chapter->id)
            ->orderBy('id', 'desc')
            ->first();

        $nextChapter = Chapter::where('book_id', $book->id)
            ->where('is_draft', false)
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
    public function readNotification(\App\Models\Notification $notification) {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }
        
        $notification->update(['is_read' => true]);
        
        $book = Book::findOrFail($notification->book_id);
        
        if ($notification->chapter_id) {
            $chapter = Chapter::findOrFail($notification->chapter_id);
            return redirect()->route('chapter.show', [$book->slug, $chapter->slug]);
        }
        
        return redirect()->route('book.show', $book->slug);
    }

    public function readAllNotifications() {
        auth()->user()->notifications()->where('is_read', false)->update(['is_read' => true]);
        return back();
    }
}
