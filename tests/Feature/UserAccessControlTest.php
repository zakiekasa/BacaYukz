<?php

use App\Models\User;
use App\Models\Book;
use App\Models\Chapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a user can create a book and a chapter', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'penulis']);
    $genre1 = App\Models\Genre::create(['name' => 'Drama']);
    $genre2 = App\Models\Genre::create(['name' => 'Novel']);

    $response = $this->actingAs($user)->post(route('dashboard.books.store'), [
        'title' => 'My Test Book',
        'description' => 'A wonderful book description.',
        'cover' => UploadedFile::fake()->image('cover.jpg', 720, 1152),
        'genres' => [$genre1->id, $genre2->id],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('books', [
        'title' => 'My Test Book',
        'user_id' => $user->id,
    ]);

    $book = Book::where('title', 'My Test Book')->first();
    $this->assertDatabaseHas('book_genre', [
        'book_id' => $book->id,
        'genre_id' => $genre1->id,
    ]);
    $this->assertDatabaseHas('book_genre', [
        'book_id' => $book->id,
        'genre_id' => $genre2->id,
    ]);

    $book = Book::where('title', 'My Test Book')->first();

    // Now try creating a chapter for this book
    $chapterResponse = $this->actingAs($user)->post(route('dashboard.chapter.store'), [
        'book_id' => $book->id,
        'title' => 'First Chapter',
        'content' => 'This is the first chapter content.',
    ]);

    $chapterResponse->assertSessionHasNoErrors();
    $this->assertDatabaseHas('chapters', [
        'title' => 'First Chapter',
        'book_id' => $book->id,
        'user_id' => $user->id,
    ]);
});

test('a user cannot edit or delete another user\'s book', function () {
    Storage::fake('public');

    $user1 = User::factory()->create(['role' => 'penulis']);
    $user2 = User::factory()->create(['role' => 'penulis']);

    // Create a book for user1
    $book = Book::create([
        'user_id' => $user1->id,
        'title' => 'User One Book',
        'description' => 'Description of user one book',
        'cover' => 'user-one-book.jpg',
    ]);

    // User2 tries to edit, update, delete user1's book
    $this->actingAs($user2)->get(route('dashboard.books.edit', $book->id))
        ->assertStatus(403);

    $this->actingAs($user2)->put(route('dashboard.books.update', $book->id), [
        'title' => 'Updated Title',
        'description' => 'Updated Description',
    ])->assertStatus(403);

    $this->actingAs($user2)->delete(route('dashboard.books.destroy', $book->id))
        ->assertStatus(403);
});

test('a user cannot create a chapter under another user\'s book', function () {
    $user1 = User::factory()->create(['role' => 'penulis']);
    $user2 = User::factory()->create(['role' => 'penulis']);

    $book = Book::create([
        'user_id' => $user1->id,
        'title' => 'User One Book',
        'description' => 'Description of user one book',
        'cover' => 'user-one-book.jpg',
    ]);

    $this->actingAs($user2)->post(route('dashboard.chapter.store'), [
        'book_id' => $book->id,
        'title' => 'Hijacked Chapter',
        'content' => 'Some content.',
    ])->assertStatus(403);

    $this->assertDatabaseMissing('chapters', [
        'title' => 'Hijacked Chapter',
    ]);
});

test('a user cannot view, edit, update, or delete another user\'s chapter', function () {
    $user1 = User::factory()->create(['role' => 'penulis']);
    $user2 = User::factory()->create(['role' => 'penulis']);

    $book = Book::create([
        'user_id' => $user1->id,
        'title' => 'User One Book',
        'description' => 'Description',
        'cover' => 'user-one-book.jpg',
    ]);

    $chapter = Chapter::create([
        'book_id' => $book->id,
        'user_id' => $user1->id,
        'title' => 'User One Chapter',
        'content' => 'Chapter content.',
    ]);

    // User2 tries to edit/update/delete User1's chapter
    $this->actingAs($user2)->get(route('dashboard.chapter.edit', $chapter->id))
        ->assertStatus(403);

    $this->actingAs($user2)->put(route('dashboard.chapter.update', $chapter->id), [
        'title' => 'New Title',
        'content' => 'New Content',
    ])->assertStatus(403);

    $this->actingAs($user2)->delete(route('dashboard.chapter.destroy', $chapter->id))
        ->assertStatus(403);
});

test('dashboard and books dropdown lists are scoped to the authenticated user', function () {
    $user1 = User::factory()->create(['role' => 'penulis']);
    $user2 = User::factory()->create(['role' => 'penulis']);

    Book::create([
        'user_id' => $user1->id,
        'title' => 'User One Book',
        'description' => 'Description 1',
        'cover' => 'cover1.jpg',
    ]);

    Book::create([
        'user_id' => $user2->id,
        'title' => 'User Two Book',
        'description' => 'Description 2',
        'cover' => 'cover2.jpg',
    ]);

    // Get dashboard for user1
    $response = $this->actingAs($user1)->get(route('dashboard'));
    $response->assertStatus(200);

    // Get books index for user1
    $booksResponse = $this->actingAs($user1)->get(route('dashboard.books'));
    $booksResponse->assertStatus(200);

    // Inertia returns books in the page props
    $books = $booksResponse->original->getData()['page']['props']['books'];
    expect($books)->toHaveCount(1);
    expect($books[0]['title'])->toBe('User One Book');

    // Get chapter upload page for user1, where books dropdown is shown
    $chaptersResponse = $this->actingAs($user1)->get(route('dashboard.chapter'));
    $chaptersResponse->assertStatus(200);
    $dropdownBooks = $chaptersResponse->original->getData()['page']['props']['books'];
    expect($dropdownBooks)->toHaveCount(1);
    expect($dropdownBooks[0]['title'])->toBe('User One Book');
});

test('a new user can register as a penulis or a pembaca', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'John Doe',
        'email' => 'john.doe@gmail.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'penulis',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john.doe@gmail.com',
        'role' => 'penulis',
    ]);

    expect(auth()->check())->toBeTrue();
    expect(auth()->user()->name)->toBe('John Doe');
});

test('an authenticated user can like and unlike a book', function () {
    $user = User::factory()->create();
    $book = Book::create([
        'user_id' => $user->id,
        'title' => 'My Likeable Book',
        'description' => 'A wonderful book description.',
        'cover' => 'like-book.jpg',
    ]);

    // 1. Like the book
    $response = $this->actingAs($user)->post(route('dashboard.books.like', $book->id));
    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    
    // Assert relationship exists and counter incremented
    $this->assertDatabaseHas('book_likes', [
        'user_id' => $user->id,
        'book_id' => $book->id,
    ]);
    expect($book->refresh()->likes)->toBe(1);

    // 2. View liked books in dashboard
    $likesResponse = $this->actingAs($user)->get(route('dashboard.likes'));
    $likesResponse->assertStatus(200);
    $likedBooks = $likesResponse->original->getData()['page']['props']['books'];
    expect($likedBooks)->toHaveCount(1);
    expect($likedBooks[0]['title'])->toBe('My Likeable Book');

    // 3. Unlike the book (toggle again)
    $unlikeResponse = $this->actingAs($user)->post(route('dashboard.books.like', $book->id));
    $unlikeResponse->assertSessionHasNoErrors();
    $unlikeResponse->assertRedirect();

    // Assert relationship is gone and counter decremented
    $this->assertDatabaseMissing('book_likes', [
        'user_id' => $user->id,
        'book_id' => $book->id,
    ]);
    expect($book->refresh()->likes)->toBe(0);
});

test('a pembaca user is redirected to dashboard.likes when accessing writer dashboard views', function () {
    $reader = User::factory()->create([
        'role' => 'pembaca',
    ]);

    // Try accessing /dashboard (main dashboard)
    $this->actingAs($reader)->get(route('dashboard'))
        ->assertRedirect(route('dashboard.likes'));

    // Try accessing /dashboard/books
    $this->actingAs($reader)->get(route('dashboard.books'))
        ->assertRedirect(route('dashboard.likes'));

    // Try accessing /dashboard/chapters
    $this->actingAs($reader)->get(route('dashboard.chapter'))
        ->assertRedirect(route('dashboard.likes'));
});

test('notifications are generated for book likers when a new chapter is added and can be read', function () {
    $author = User::factory()->create(['role' => 'penulis']);
    $reader = User::factory()->create(['role' => 'pembaca']);

    $book = Book::create([
        'user_id' => $author->id,
        'title' => 'Notify Book',
        'description' => 'A book description.',
        'cover' => 'notify-book.jpg',
    ]);

    // 1. Reader likes the book
    $this->actingAs($reader)->post(route('dashboard.books.like', $book->id));

    // 2. Author creates a new chapter
    $this->actingAs($author)->post(route('dashboard.chapter.store'), [
        'book_id' => $book->id,
        'title' => 'New Chapter Alert',
        'content' => 'Chapter content notification test.',
    ]);

    // Assert notification database record exists
    $this->assertDatabaseHas('notifications', [
        'user_id' => $reader->id,
        'book_id' => $book->id,
        'is_read' => false,
    ]);

    $notification = \App\Models\Notification::where('user_id', $reader->id)->first();
    expect($notification->message)->toContain('New Chapter Alert');

    // 3. Reader reads notification and gets redirected to the chapter show page
    $readResponse = $this->actingAs($reader)->post(route('notifications.read', $notification->id));
    $readResponse->assertRedirect(route('chapter.show', [$book->slug, 'new-chapter-alert']));
    expect($notification->refresh()->is_read)->toBeTrue();

    // 4. Test mark all as read
    $notification2 = \App\Models\Notification::create([
        'user_id' => $reader->id,
        'book_id' => $book->id,
        'chapter_id' => $notification->chapter_id,
        'message' => 'Another notification',
        'is_read' => false,
    ]);

    $this->actingAs($reader)->post(route('notifications.read-all'))
        ->assertRedirect();
    expect($notification2->refresh()->is_read)->toBeTrue();
});

test('an authenticated user can view and update their profile settings', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original.email@gmail.com',
        'password' => Hash::make('oldpassword'),
    ]);

    // 1. Visit profile page
    $this->actingAs($user)->get(route('dashboard.profile'))
        ->assertStatus(200);

    // 2. Update profile name and email
    $response = $this->actingAs($user)->put(route('dashboard.profile.update'), [
        'name' => 'Updated Name',
        'email' => 'updated.email@gmail.com',
    ]);
    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated.email@gmail.com',
    ]);

    // 3. Update password
    $passwordResponse = $this->actingAs($user)->put(route('dashboard.profile.update'), [
        'name' => 'Updated Name',
        'email' => 'updated.email@gmail.com',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);
    $passwordResponse->assertSessionHasNoErrors();
    $passwordResponse->assertRedirect();

    expect(Hash::check('newpassword123', $user->refresh()->password))->toBeTrue();
});
