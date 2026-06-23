<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\Chapter;

/**
 * HomeController manages the public-facing pages of the BacaYukz application.
 */
class HomeController extends Controller
{
    /**
     * Display the home page (landing page) with popular books.
     *
     * @return \Inertia\Response
     */
    public function index() {
        $popularBooks = Book::with(['genres', 'user'])->orderBy('view', 'desc')->limit(6)->get();
        
        return Inertia::render('Home/Index', [
            'popularBooks' => $popularBooks,
        ]);
    }

    /**
     * Display the dedicated catalog page containing all books and filters.
     *
     * @return \Inertia\Response
     */
    public function books() {
        $books = Book::with(['genres', 'user'])->latest()->get();
        $genres = \App\Models\Genre::all();

        return Inertia::render('Home/Books', [
            'books' => $books,
            'genres' => $genres,
        ]);
    }

    /**
     * Display the book details page along with its published chapters and likes status.
     *
     * @param  \App\Models\Book  $book
     * @return \Inertia\Response
     */
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

    /**
     * Display a specific chapter's reading page with next/previous links and the author's support details.
     *
     * @param  \App\Models\Book     $book
     * @param  \App\Models\Chapter  $chapter
     * @return \Inertia\Response
     */
    public function chapterDetail(Book $book, Chapter $chapter) {
        // If chapter is a draft, only allow the book owner to view it
        if ($chapter->is_draft) {
            if (!auth()->check() || $book->user_id !== auth()->id()) {
                abort(404);
            }
        }

        $chapter->increment('view');

        $book->load('user');
        $chapter->load('quiz.questions');

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

        $attempt = null;
        if (auth()->check() && $chapter->quiz) {
            $attempt = \App\Models\QuizAttempt::where('user_id', auth()->id())
                ->where('quiz_id', $chapter->quiz->id)
                ->first();
        }

        return Inertia::render('Home/Chapter', [
            'book' => $book,
            'chapter' => $chapter,
            'previous_chapter' => $previousChapter,
            'next_chapter' => $nextChapter,
            'quiz' => $chapter->quiz,
            'attempt' => $attempt,
        ]);
    }

    /**
     * Mark a specific notification as read and redirect to the relevant book or chapter page.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\RedirectResponse
     */
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

    /**
     * Mark all unread notifications of the authenticated user as read.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function readAllNotifications() {
        auth()->user()->notifications()->where('is_read', false)->update(['is_read' => true]);
        return back();
    }

    /**
     * Display a specific author's profile along with their published books.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function authorProfile(\App\Models\User $user) {
        $books = Book::where('user_id', $user->id)->with('genres')->latest()->get();
        
        $user->avatar_url = $user->avatar 
            ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/avatars/' . $user->avatar)) 
            : null;

        return Inertia::render('Home/Author', [
            'author' => $user,
            'books' => $books,
        ]);
    }

    /**
     * Display the application download page.
     *
     * @return \Inertia\Response
     */
    public function download() {
        return Inertia::render('Home/Download');
    }

    public function quizSubmit(Request $request, Chapter $chapter) {
        $chapter->load('quiz.questions');
        if (!$chapter->quiz) {
            abort(404);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        $score = 0;
        $totalQuestions = $chapter->quiz->questions->count();
        if ($totalQuestions > 0) {
            $correctCount = 0;
            foreach ($chapter->quiz->questions as $q) {
                $userAns = $validated['answers'][$q->id] ?? null;
                if ($userAns === $q->correct_option) {
                    $correctCount++;
                }
            }
            $score = round(($correctCount / $totalQuestions) * 100);
        }

        $attempt = \App\Models\QuizAttempt::updateOrCreate([
            'user_id' => auth()->id(),
            'quiz_id' => $chapter->quiz->id,
        ], [
            'score' => $score,
        ]);

        return back()->with([
            'success' => true,
            'message' => "Kuis selesai! Nilai Anda: {$score}%",
        ]);
    }
}
