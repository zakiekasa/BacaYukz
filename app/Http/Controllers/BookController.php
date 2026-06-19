<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Book;
use App\Models\Chapter;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index() {
        if (auth()->user()->role === 'pembaca') {
            return redirect()->route('dashboard.likes');
        }
        $books = Book::where('user_id', auth()->id())->get();
        $genres = \App\Models\Genre::all();
        return Inertia::render('Book', [
            'books' => $books,
            'genres' => $genres,
        ]);
    }
    public function store(Request $request) {
        $validated = $request->validate([
            "title" => "required|min:2|max:100|regex:/^[a-zA-Z0-9\s]+$/",
            "description" => "required|min:2",
            "cover" => "required|image|mimes:jpeg,png,jpg|max:5120",
            "genres" => "required|array|min:1",
            "genres.*" => "exists:genres,id",
        ]);

        if($request->hasFile('cover')) {
            $file = $request->file('cover');
            $fileName = Str::slug($validated['title']) . '-' . time() . '.webp';
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file);
            $image->cover(720, 1152);
            $encoded = $image->encodeUsingFileExtension('webp', quality: 85);
            Storage::disk('public')->put('covers/' . $fileName, $encoded->toString());

            $book = Book::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'cover' => $fileName,
            ]);

            $book->genres()->sync($request->genres);
            
            return back()->with(['success' => true, 'message' => 'Book uploaded successfully']);
        } 

        return back()->with(['success' => false, 'message' => 'Book uploaded failed']);
    }

    public function dashboard() {
        if (auth()->user()->role === 'pembaca') {
            return redirect()->route('dashboard.likes');
        }
        $books = Book::where('user_id', auth()->id())->withCount('chapters')->withSum('chapters', 'view')->latest()->get();
        $formattedBooks = $books->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'cover' => $book->cover ? (str_starts_with($book->cover, 'http') ? $book->cover : asset('storage/covers/' . $book->cover)) : null,
                'description' => $book->description,
                'chaptersCount' => $book->chapters_count,
                'viewsSum' => (int) ($book->chapters_sum_view ?? 0),
                'createdAt' => $book->created_at->format('Y-m-d'),
            ];
        });

        $totalBooks = $books->count();
        $totalChapters = (int) $books->sum('chapters_count');
        $totalReaders = (int) ($books->sum('view') + $books->sum('chapters_sum_view'));

        return Inertia::render('dashboard', [
            'books' => $formattedBooks,
            'totalBooks' => $totalBooks,
            'totalChapters' => $totalChapters,
            'totalReaders' => $totalReaders,
        ]);
    }

    public function edit(Book $book) {
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        $book->load('genres');
        $genres = \App\Models\Genre::all();

        return Inertia::render('BookEdit', [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'description' => $book->description,
                'cover' => $book->cover ? (str_starts_with($book->cover, 'http') ? $book->cover : asset('storage/covers/' . $book->cover)) : null,
                'genres' => $book->genres->map(function ($genre) {
                    return [
                        'id' => $genre->id,
                        'name' => $genre->name,
                        'slug' => $genre->slug,
                    ];
                }),
            ],
            'genres' => $genres,
        ]);
    }

    public function update(Request $request, Book $book) {
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            "title" => "required|min:2|max:100|regex:/^[a-zA-Z0-9\s]+$/",
            "description" => "required|min:2",
            "cover" => "nullable|image|mimes:jpeg,png,jpg|max:5120",
            "genres" => "required|array|min:1",
            "genres.*" => "exists:genres,id",
        ]);

        if ($request->hasFile('cover')) {
            if ($book->cover && !str_starts_with($book->cover, 'http')) {
                Storage::disk('public')->delete('covers/' . $book->cover);
            }

            $file = $request->file('cover');
            $fileName = Str::slug($validated['title']) . '-' . time() . '.webp';
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file);
            $image->cover(720, 1152);
            $encoded = $image->encodeUsingFileExtension('webp', quality: 85);
            Storage::disk('public')->put('covers/' . $fileName, $encoded->toString());

            $validated['cover'] = $fileName;
        } else {
            unset($validated['cover']);
        }

        $book->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'cover' => $validated['cover'] ?? $book->cover,
        ]);

        $book->genres()->sync($request->genres);

        return redirect()->route('dashboard')->with(['success' => true, 'message' => 'Book updated successfully']);
    }

    public function destroy(Book $book) {
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        if ($book->cover && !str_starts_with($book->cover, 'http')) {
            Storage::disk('public')->delete('covers/' . $book->cover);
        }

        $book->delete();

        return redirect()->route('dashboard')->with(['success' => true, 'message' => 'Book deleted successfully']);
    }

    public function likes() {
        $user = auth()->user();
        $likedBooks = $user->likedBooks()->withCount('chapters')->latest()->get();
        
        $formattedBooks = $likedBooks->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'cover' => $book->cover ? (str_starts_with($book->cover, 'http') ? $book->cover : asset('storage/covers/' . $book->cover)) : null,
                'description' => $book->description,
                'chaptersCount' => $book->chapters_count,
                'createdAt' => $book->created_at->format('Y-m-d'),
                'likes' => $book->likes,
            ];
        });

        return Inertia::render('dashboardLikes', [
            'books' => $formattedBooks,
        ]);
    }

    public function toggleLike(Book $book) {
        $user = auth()->user();
        
        $alreadyLiked = $book->likedByUsers()->where('user_id', $user->id)->exists();

        if ($alreadyLiked) {
            $book->likedByUsers()->detach($user->id);
            $book->decrement('likes');
            $message = 'Batal menyukai buku';
            $liked = false;
        } else {
            $book->likedByUsers()->attach($user->id);
            $book->increment('likes');
            $message = 'Menyukai buku';
            $liked = true;

            // Send notification to author if they are a writer and not the liker themselves
            if ($book->user_id !== $user->id) {
                $author = $book->user;
                if ($author && $author->role === 'penulis') {
                    \App\Models\Notification::create([
                        'user_id' => $author->id,
                        'book_id' => $book->id,
                        'chapter_id' => null,
                        'message' => "{$user->name} telah menyukai buku Anda: '{$book->title}'",
                        'is_read' => false,
                    ]);
                }
            }
        }

        return back()->with(['success' => true, 'message' => $message]);
    }
}

