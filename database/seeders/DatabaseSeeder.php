<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\Genre;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [];
        $names = [
            'Budi Santoso',
            'Siti Aminah',
            'Rian Wijaya',
            'Dewi Lestari',
            'Andi Pratama'
        ];

        foreach ($names as $index => $name) {
            $users[] = User::factory()->create([
                'name' => $name,
                'email' => 'user' . ($index + 1) . '@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'penulis',
            ]);
        }

        // 2. Create Default Genres
        $genresData = ['Drama', 'Psikologi', 'Romantis', 'Komedi', 'Coding', 'Novel'];
        $genres = [];
        foreach ($genresData as $name) {
            $genres[] = Genre::create([
                'name' => $name,
            ]);
        }

        // 3. Define 10 Books (Menggunakan Judul Asli Buku Terbitan Gramedia/Toko Gramedia)
        $booksData = [
            ['title' => 'Laut Bercerita', 'view' => 120],
            ['title' => 'Gadis Kretek', 'view' => 250],
            ['title' => 'Laskar Pelangi', 'view' => 89],
            ['title' => 'Bumi Manusia', 'view' => 310],
            ['title' => 'Cantik Itu Luka', 'view' => 420],
            ['title' => 'Filosofi Teras', 'view' => 175],
            ['title' => 'Home Sweet Loan', 'view' => 95],
            ['title' => 'Dikta dan Hukum', 'view' => 205],
            ['title' => 'Ronggeng Dukuh Paruk', 'view' => 140],
            ['title' => 'Aroma Karsa', 'view' => 510],
        ];

        // 4. Create Books and distribute them to users (2 books per user)
        foreach ($booksData as $bookIndex => $data) {
            // Distribute books among our 5 users
            $user = $users[$bookIndex % 5];
            
            // Generate slug berdasarkan title
            $slug = Str::slug($data['title']);
            
            // Generate deskripsi 3 paragraf menggunakan fake data
            $description = collect(fake()->paragraphs(3))
                ->map(fn($p) => "<p>{$p}</p>")
                ->implode("\n");

            $book = Book::create([
                'user_id' => $user->id,
                'title' => $data['title'],
                'slug' => $slug,
                'description' => $description,
                'cover' => $slug . '.png', // Cover disesuaikan dengan slug + .png
                'view' => $data['view'],
            ]);

            usleep(2000000);

            // Attach 1 to 3 random genres to this book
            $randomGenreIds = collect($genres)->random(rand(1, 3))->pluck('id');
            $book->genres()->sync($randomGenreIds);

            // 5. Create 5 Chapters for each book
            $chapterTitles = [
                'Bab 1: Langkah Awal',
                'Bab 2: Pertemuan yang Tak Terduga',
                'Bab 3: Riak di Air Tenang',
                'Bab 4: Badai Datang Menghampiri',
                'Bab 5: Titik Terang Harapan'
            ];

            foreach ($chapterTitles as $chapIndex => $chapTitle) {
                // Generate content bab sebanyak 13 paragraf menggunakan fake data
                $content = collect(fake()->paragraphs(13))
                    ->map(fn($p) => "<p>$p</p>")
                    ->implode("\n");

                Chapter::create([
                    'book_id' => $book->id,
                    'user_id' => $user->id,
                    'title' => $chapTitle,
                    'content' => $content,
                    'view' => rand(10, 100),
                ]);

                usleep(2000000);
            }

            
        }   
    }
}
