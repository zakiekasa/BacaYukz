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

            usleep(100000); // Speed up book loop

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

                usleep(100000); // Speed up slightly to 0.1s
            }

            
        }   

        // 6. Create Reading Communities
        $communitiesData = [
            [
                'name' => 'Klub Buku Jogja',
                'description' => 'Komunitas berkumpulnya para pecinta buku di Yogyakarta. Kami rutin mengadakan book-talk setiap akhir pekan di kafe-kafe lokal.',
                'city' => 'Yogyakarta',
                'province' => 'DI Yogyakarta',
                'whatsapp_url' => 'https://chat.whatsapp.com/sample-jogja',
                'instagram_username' => 'klubbuku.jogja',
                'member_count' => 125,
            ],
            [
                'name' => 'Jakarta Book Club',
                'description' => 'Membaca bersama, bertukar cerita, dan menyebarkan literasi di tengah hiruk pikuk kota Jakarta. Terbuka untuk umum.',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'whatsapp_url' => 'https://chat.whatsapp.com/sample-jakarta',
                'instagram_username' => 'jakartabookclub',
                'member_count' => 340,
            ],
            [
                'name' => 'Bandung Membaca',
                'description' => 'Wadah silaturahmi para pembaca di wilayah Bandung dan sekitarnya. Yuk gabung untuk berbagi ulasan buku favorit!',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'whatsapp_url' => 'https://chat.whatsapp.com/sample-bandung',
                'instagram_username' => 'bandung.membaca',
                'member_count' => 88,
            ],
            [
                'name' => 'Surabaya Read & Share',
                'description' => 'Cangkrukan bareng pencinta buku di Surabaya. Saling review, ngobrol santai, dan adakan bursa buku bekas gratis.',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'whatsapp_url' => 'https://chat.whatsapp.com/sample-surabaya',
                'instagram_username' => 'sub.readshare',
                'member_count' => 150,
            ],
            [
                'name' => 'Medan Book Society',
                'description' => 'Kolektif pembaca buku di Medan. Berkomitmen menumbuhkan minat baca melalui sharing session bulanan.',
                'city' => 'Medan',
                'province' => 'Sumatera Utara',
                'whatsapp_url' => 'https://chat.whatsapp.com/sample-medan',
                'instagram_username' => 'medanbooksociety',
                'member_count' => 45,
            ]
        ];

        foreach ($communitiesData as $cData) {
            \App\Models\Community::create(array_merge($cData, [
                'created_by' => $users[rand(0, count($users) - 1)]->id,
                'avatar_url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&h=150&q=80',
            ]));
        }

        // 7. Create Dummy Reading Logs for Streaks and Leaderboard
        $chapters = Chapter::all();
        foreach ($users as $uIndex => $user) {
            // Generate a streak of 3 to 7 consecutive days ending today
            $streakDays = rand(3, 7);
            for ($day = 0; $day < $streakDays; $day++) {
                $readDate = now()->subDays($day)->format('Y-m-d');
                
                // Read 1-2 random chapters per day
                $dailyChapters = $chapters->random(rand(1, 2));
                foreach ($dailyChapters as $chapter) {
                    \App\Models\ReadingLog::create([
                        'user_id' => $user->id,
                        'chapter_id' => $chapter->id,
                        'read_date' => $readDate,
                        // Make some users read more to differentiate leaderboard ranking
                        'duration_seconds' => rand(900, 3600) + (($uIndex === 0) ? 5000 : 0),
                    ]);
                }
            }
        }
    }
}

