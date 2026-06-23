<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Mews\Purifier\Facades\Purifier;
use App\Models\Chapter;
use App\Models\Book;

class ChapterController extends Controller
{
    public function index() {
        if (auth()->user()->role === 'pembaca') {
            return redirect()->route('dashboard.likes');
        }
        $books = Book::where('user_id', auth()->id())->get();
        return Inertia::render('Dashboard/ChapterCreate', ['books' => $books]);
    }
    public function store(Request $request) {
        $validatedData = $request->validate([
            "book_id" => "required|exists:books,id",
            "title" => "required|string|max:100",
            "content" => "required|string",
            "is_draft" => "nullable|boolean",
        ]);

        $book = Book::findOrFail($validatedData['book_id']);
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        $validatedData['content'] = Purifier::clean($validatedData['content']);
        $validatedData['user_id'] = auth()->id();
        $validatedData['is_draft'] = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN);

        $chapter = Chapter::create($validatedData);

        if (!$chapter->is_draft) {
            $likers = $book->likedByUsers;
            foreach ($likers as $liker) {
                \App\Models\Notification::create([
                    'user_id' => $liker->id,
                    'book_id' => $book->id,
                    'chapter_id' => $chapter->id,
                    'message' => "Buku '{$book->title}' telah menambahkan chapter baru: '{$chapter->title}'",
                    'is_read' => false,
                ]);
            }
        }

        return back()->with(['message' => 'Chapter created successfully', "success" => true]);
    }

    public function manage(Book $book) {
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }
        $chapters = $book->chapters()->orderBy('id', 'asc')->get();
        return Inertia::render('Dashboard/BookChapters', [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'cover' => $book->cover ? ((str_starts_with($book->cover, 'http') || str_starts_with($book->cover, 'data:')) ? $book->cover : asset('storage/covers/' . $book->cover)) : null,
            ],
            'chapters' => $chapters->map(function ($chapter) {
                return [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'slug' => $chapter->slug,
                    'view' => $chapter->view,
                    'is_draft' => $chapter->is_draft,
                    'createdAt' => $chapter->created_at->format('Y-m-d'),
                ];
            })
        ]);
    }

    public function edit(Chapter $chapter) {
        if ($chapter->user_id !== auth()->id()) {
            abort(403);
        }
        $chapter->load('book');
        return Inertia::render('Dashboard/ChapterEdit', [
            'chapter' => [
                'id' => $chapter->id,
                'title' => $chapter->title,
                'content' => $chapter->content,
                'is_draft' => $chapter->is_draft,
                'book' => [
                    'id' => $chapter->book->id,
                    'title' => $chapter->book->title,
                    'slug' => $chapter->book->slug,
                ]
            ]
        ]);
    }

    public function update(Request $request, Chapter $chapter) {
        if ($chapter->user_id !== auth()->id()) {
            abort(403);
        }
        $validatedData = $request->validate([
            "title" => "required|string|max:100",
            "content" => "required|string",
            "is_draft" => "nullable|boolean",
        ]);

        $validatedData['content'] = Purifier::clean($validatedData['content']);
        $newIsDraft = filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN);

        $wasDraft = $chapter->is_draft;
        $validatedData['is_draft'] = $newIsDraft;

        $chapter->update($validatedData);

        if ($wasDraft && !$newIsDraft) {
            $book = $chapter->book;
            $likers = $book->likedByUsers;
            foreach ($likers as $liker) {
                \App\Models\Notification::create([
                    'user_id' => $liker->id,
                    'book_id' => $book->id,
                    'chapter_id' => $chapter->id,
                    'message' => "Buku '{$book->title}' telah menambahkan chapter baru: '{$chapter->title}'",
                    'is_read' => false,
                ]);
            }
        }

        return redirect()->route('dashboard.books.chapters', $chapter->book_id)->with([
            'message' => 'Chapter updated successfully',
            'success' => true
        ]);
    }

    public function destroy(Chapter $chapter) {
        if ($chapter->user_id !== auth()->id()) {
            abort(403);
        }
        $bookId = $chapter->book_id;
        $chapter->delete();

        return redirect()->route('dashboard.books.chapters', $bookId)->with([
            'message' => 'Chapter deleted successfully',
            'success' => true
        ]);
    }
}
