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
                'instagram' => 'https://instagram.com/zakiekas_',
                'twitter' => 'https://twitter.com/zakiekas',
                'saweria' => 'https://saweria.co',
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
            [
                'title' => 'Laut Bercerita',
                'view' => 120,
                'description' => "Novel ini menceritakan kisah pilu perjuangan para aktivis mahasiswa di era Orde Baru yang diculik, disiksa, dan beberapa di antaranya tidak pernah kembali, disuarakan dari sudut pandang Biru Laut dan keluarganya yang berduka. Dengan latar waktu tahun 1990-an dan 2000-an, buku ini membawa pembaca menyelami kekejaman rezim penguasa saat itu, rasa kehilangan mendalam dari keluarga yang ditinggalkan, serta harapan yang tak pernah padam akan keadilan dan kebenaran yang harus diungkap demi kemanusiaan."
            ],
            [
                'title' => 'Gadis Kretek',
                'view' => 250,
                'description' => "Mengisahkan penelusuran sejarah industri kretek di Indonesia yang berkelindan dengan kisah cinta segitiga antara Lebas, Soeraja, Jeng Yah, dan Purwanti, mengungkap rahasia keluarga dan aroma tembakau yang melegenda. Perjalanan pencarian sosok Jeng Yah membawa Lebas mengungkap lembaran masa lalu keluarganya yang penuh persaingan bisnis, intrik, cinta yang tak sampai, dan bagaimana industri kretek klobot tradisional bertransformasi menjadi industri rokok modern di tanah air."
            ],
            [
                'title' => 'Laskar Pelangi',
                'view' => 89,
                'description' => "Kisah inspiratif tentang perjuangan sepuluh anak di Pulau Belitung dari keluarga miskin yang bersekolah di sebuah SD Muhammadiyah reyot, memperjuangkan mimpi mereka bersama dua guru yang penuh dedikasi. Novel ini tidak hanya menyajikan keindahan persahabatan anak-anak Laskar Pelangi, tetapi juga menggambarkan kritik sosial mengenai kesenjangan pendidikan di daerah yang kaya akan sumber daya alam timah namun miskin secara ekonomi bagi rakyat kecilnya."
            ],
            [
                'title' => 'Bumi Manusia',
                'view' => 310,
                'description' => "Berlatar belakang akhir masa kolonial Belanda, novel ini menceritakan kisah cinta antara Minke, seorang priayi Jawa modern, dan Annelies Mellema, seorang gadis blasteran Indo-Belanda, di tengah diskriminasi dan pergulatan hukum kolonial. Melalui karakter Minke yang gemar menulis, Pramoedya Ananta Toer menggambarkan kebangkitan kesadaran nasional, pertentangan kelas sosial, serta perjuangan menegakkan keadilan dan kemanusiaan melawan penindasan penjajahan kolonial."
            ],
            [
                'title' => 'Cantik Itu Luka',
                'view' => 420,
                'description' => "Sebuah karya realisme magis yang menceritakan kehidupan Dewi Ayu, seorang pelacur legendaris di masa kolonial, dan anak-anak perempuannya yang menghadapi kutukan kecantikan, tragedi sejarah, dan trauma masa lalu. Dimulai dengan bangkitnya Dewi Ayu dari kubur setelah mati selama dua puluh satu tahun, novel ini menelusuri sejarah kelam Indonesia dari akhir masa kolonial Belanda, pendudukan Jepang, masa revolusi kemerdekaan, hingga tragedi berdarah pasca kemerdekaan."
            ],
            [
                'title' => 'Filosofi Teras',
                'view' => 175,
                'description' => "Buku panduan praktis filsafat Stoisisme atau Stoic untuk membantu generasi muda mengatasi kekhawatiran berlebih (overthinking), mengelola emosi negatif, dan menemukan kedamaian mental di dunia modern. Ditulis dengan bahasa yang santai, relevan dengan kehidupan masa kini, dan dilengkapi ilustrasi menarik, Henry Manampiring menunjukkan bagaimana filsafat Yunani-Romawi kuno yang berusia ribuan tahun masih sangat efektif diterapkan untuk menghadapi tantangan mental saat ini."
            ],
            [
                'title' => 'Home Sweet Loan',
                'view' => 95,
                'description' => "Mengisahkan perjuangan Kaluna, seorang pekerja kelas menengah (sandwich generation) di Jakarta, yang bercita-cita memiliki rumah sendiri di tengah beban finansial keluarga besarnya. Dengan realitas kehidupan kota besar yang keras, Kaluna harus memutar otak mencari cara menabung, menyisihkan pendapatan, menahan ego pribadi, dan menghadapi dilema emosional antara bakti kepada keluarga atau mengejar kemandirian finansial demi masa depannya."
            ],
            [
                'title' => 'Dikta dan Hukum',
                'view' => 205,
                'description' => "Sebuah kisah cinta mengharukan antara Dikta, mahasiswa hukum berprestasi yang diam-diam mengidap penyakit kronis, dan Nadhira, adik kelasnya yang manja, yang dijodohkan oleh orang tua mereka. Hubungan persahabatan masa kecil mereka yang berubah menjadi komitmen pernikahan tak terduga ini diisi dengan momen manis, perjuangan Dikta dalam mempersiapkan Nadhira menghadapi kehidupan tanpanya, serta pemahaman mendalam tentang arti cinta, persahabatan, dan perpisahan."
            ],
            [
                'title' => 'Ronggeng Dukuh Paruk',
                'view' => 140,
                'description' => "Trilogi novel yang mengisahkan kehidupan Srintil, seorang penari ronggeng di Dukuh Paruk, dan Rasus, tentara muda teman masa kecilnya, dengan latar peristiwa politik tragis tahun 1965. Novel ini menggambarkan dengan sangat apik tradisi kehidupan pedesaan yang kental dengan mistisisme dan kesenian ronggeng, serta bagaimana kepolosan masyarakat Dukuh Paruk hancur terseret arus konflik politik nasional yang tidak mereka pahami."
            ],
            [
                'title' => 'Aroma Karsa',
                'view' => 510,
                'description' => "Kisah pencarian tanaman mistis bernama Puspa Karsa yang mampu mengendalikan kehendak melalui aroma, mempertemukan Jati Wesi yang peka penciuman dengan Tanaya Paramita dalam petualangan penuh misteri. Berbekal obsesi obsesif dari seorang konglomerat kosmetik, pencarian tanaman legendaris ini membawa mereka masuk ke dalam misteri sejarah kuno, teka-teki genetika, intrik bisnis keluarga, serta takdir mistis tersembunyi yang mengikat mereka berdua."
            ],
        ];

        // 4. Create Books and distribute them to users (2 books per user)
        foreach ($booksData as $bookIndex => $data) {
            // Distribute books among our 5 users
            $user = $users[$bookIndex % 5];
            
            // Generate slug berdasarkan title
            $slug = Str::slug($data['title']);
            
            // Gunakan deskripsi riil yang sudah didefinisikan dalam bahasa Indonesia
            $description = $data['description'];

            $book = Book::create([
                'user_id' => $user->id,
                'title' => $data['title'],
                'slug' => $slug,
                'description' => $description,
                'cover' => $slug . '.png', // Cover disesuaikan dengan slug + .png
                'view' => $data['view'],
            ]);

            usleep(1000000); // Speed up book loop

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
                // Generate Indonesian content with 12 paragraphs and a CKEditor-style list matching the chapter title
                $bookEscaped = e($data['title']);
                $content = '';
                
                if (str_contains($chapTitle, 'Langkah Awal')) {
                    $content = "
<p>Kisah dari buku \"{$bookEscaped}\" ini dimulai dari sini. Langkah pertama selalu menjadi yang paling berat untuk dilalui, terutama ketika semua kenangan masa lalu masih membekas erat di ingatan.</p>
<p>Karakter utama berdiri di ambang pintu, menatap jalan panjang di hadapannya yang diselimuti kabut tipis pagi hari. Ada rasa enggan yang luar biasa, namun tekad di dadanya telah bulat untuk melangkah.</p>
<p>Suasana sunyi menyelimuti lingkungan sekitar, hanya terdengar deru angin pagi dan kicauan burung yang samar. Udara dingin merasuk hingga ke tulang, menambah kecemasan yang berkecamuk di dalam pikiran.</p>
<p>Keputusan besar harus diambil hari ini juga, tidak ada lagi waktu untuk menunda atau bersembunyi dari kenyataan yang menanti di luar sana.</p>
<p>Sebelum melangkah lebih jauh, beberapa persiapan penting telah dirangkum dalam benak sebagai panduan perjalanan:</p>
<ul>
    <li>Memantapkan niat dan mempersiapkan mental untuk segala kemungkinan terburuk yang bisa terjadi di perjalanan.</li>
    <li>Mengemas barang-barang penting secukupnya tanpa membebani langkah kaki yang harus bergerak cepat.</li>
    <li>Menyimpan kenangan manis sebagai bekal semangat, dan meninggalkan dendam yang hanya akan memperberat beban pundak.</li>
    <li>Menentukan koordinat atau tujuan awal yang realistis sebelum menjelajahi wilayah yang lebih luas.</li>
</ul>
<p>Langkah kaki pertama akhirnya mendarat di tanah basah, meninggalkan jejak yang akan segera terhapus oleh air hujan. Tidak ada jalan untuk kembali lagi sekarang.</p>
<p>Pertentangan batin berkecamuk di dalam dada, antara keinginan untuk tetap berada di zona nyaman dan dorongan untuk menemukan kebenaran sejati.</p>
<p>Angin berhembus kencang seolah memberi isyarat bahwa perjalanan dalam \"{$bookEscaped}\" ini tidak akan pernah mudah untuk dilalui.</p>
<p>Harapan kecil namun abadi tetap menyala di sudut hati yang paling dalam, menjadi lentera di tengah kegelapan yang mulai membentang.</p>
<p>Kilas balik singkat melintas di ingatan, mengingatkan kembali pada janji lama dan alasan mengapa perjalanan panjang ini harus dimulai.</p>
<p>Meskipun keyakinan sempat goyah diterpa keraguan, tekad yang kuat kembali membakar semangat untuk terus menapakkan kaki ke depan.</p>
<p>Hari pertama dari perjalanan panjang ini resmi dimulai dengan sejuta tanda tanya besar yang menanti untuk segera dijawab di bab-bab berikutnya.</p>";
                } elseif (str_contains($chapTitle, 'Pertemuan yang Tak Terduga')) {
                    $content = "
<p>Jalan yang dilalui dalam kisah \"{$bookEscaped}\" membawa langkah kaki ke sebuah persimpangan ramai di tengah kota yang tidak pernah tidur.</p>
<p>Di tempat inilah takdir bekerja dengan cara yang paling misterius, mempertemukan dua jiwa yang sebelumnya tidak pernah saling mengenal satu sama lain.</p>
<p>Pandangan mata mereka saling bertemu secara tidak sengaja di antara kerumunan orang yang berlalu-lalang dengan kesibukan masing-masing.</p>
<p>Waktu seolah berhenti berputar sejenak, membiarkan keheningan mengambil alih suasana di tengah kebisingan kota yang riuh rendah.</p>
<p>Ada beberapa hal penting yang disadari dari pertemuan mendadak ini, yang kemudian dicatat sebagai momen krusial:</p>
<ol>
    <li>Tatapan mata yang menyimpan rahasia mendalam, seolah mengisyaratkan luka masa lalu yang serupa.</li>
    <li>Gerak-gerik canggung yang menunjukkan bahwa pertemuan ini bukanlah sesuatu yang direncanakan oleh siapapun.</li>
    <li>Perubahan atmosfer sekitar yang mendadak terasa lebih hangat dan penuh dengan tanda tanya besar.</li>
    <li>Adanya rasa akrab yang aneh, seolah-olah mereka pernah bertemu di kehidupan atau mimpi yang lain.</li>
</ol>
<p>Percakapan awal dimulai dengan kalimat-kalimat sederhana yang canggung, namun perlahan mencairkan dinding pertahanan yang masing-masing bangun.</p>
<p>Kata demi kata mengalir layaknya aliran sungai yang tenang, membawa mereka pada pemahaman baru tentang arti dari sebuah kehadiran.</p>
<p>Pertemuan di dalam buku \"{$bookEscaped}\" ini perlahan mulai mengubah arah tujuan awal yang telah disusun rapi sebelumnya.</p>
<p>Ada ketakutan tersendiri akan keterikatan baru, namun rasa ingin tahu yang besar mengalahkan ego untuk tetap menjaga jarak aman.</p>
<p>Dunia terasa sedikit berbeda setelah pertemuan ini, memberikan warna baru pada kanvas kehidupan yang sebelumnya tampak monoton dan kelabu.</p>
<p>Mereka menyadari bahwa sejak detik ini, garis takdir mereka telah saling bertautan dalam sebuah simpul yang rumit namun indah.</p>
<p>Matahari mulai tenggelam di ufuk barat, meninggalkan bayangan panjang mereka yang kini berdampingan menyusuri jalan setapak.</p>
<p>Pertemuan yang tak terduga ini menutup hari dengan sebuah janji tak tertulis untuk kembali bertemu di esok hari yang penuh harapan.</p>";
                } elseif (str_contains($chapTitle, 'Riak di Air Tenang')) {
                    $content = "
<p>Kehidupan setelah peristiwa besar dalam \"{$bookEscaped}\" sempat berjalan dengan sangat tenang dan damai, hampir tanpa hambatan berarti.</p>
<p>Namun, kedamaian yang terlalu sempurna seringkali menjadi pertanda bahwa badai yang lebih besar sedang bersiap untuk datang menghampiri.</p>
<p>Riak kecil mulai muncul di permukaan air yang tenang, dipicu oleh sebuah kabar burung yang datang dari tempat yang sangat jauh.</p>
<p>Kabar tersebut membawa desas-desus tentang rahasia masa lalu yang selama ini terkubur rapat di bawah fondasi kehidupan yang baru.</p>
<p>Munculnya riak-riak ini ditandai dengan beberapa perubahan situasi yang cukup mengkhawatirkan di sekitar karakter:</p>
<ul>
    <li>Kehadiran orang asing yang kerap terlihat mengawasi kediaman dari kejauhan dengan gerak-gerik mencurigakan.</li>
    <li>Surat tanpa identitas pengirim yang berisi pesan-pesan misterius bernada peringatan halus namun mengancam.</li>
    <li>Perubahan sikap dari orang-orang terdekat yang mendadak menjadi lebih tertutup dan enggan berbagi cerita.</li>
    <li>Hilangnya beberapa dokumen penting secara misterius dari tempat penyimpanan yang seharusnya sangat aman.</li>
</ul>
<p>Kecemasan kembali merayap masuk ke dalam relung hati, merusak ketenangan malam yang selama ini menjadi tempat perlindungan terbaik.</p>
<p>Karakter utama mulai menyusun strategi untuk menyelidiki asal-usul dari riak pengganggu ini sebelum semuanya terlambat.</p>
<p>Setiap petunjuk kecil yang ditemukan di dalam kisah \"{$bookEscaped}\" ini dianalisis dengan sangat hati-hati demi menghindari jebakan.</p>
<p>Kepercayaan mulai diuji ketika kecurigaan mengarah pada lingkaran pertemanan terdekat yang selama ini dianggap paling setia.</p>
<p>Udara di sekitar terasa semakin menegang, membuat setiap tarikan napas terasa lebih berat dari biasanya.</p>
<p>Tidak ada pilihan lain selain menghadapi riak ini secara langsung sebelum ia membesar menjadi ombak yang mampu menenggelamkan segalanya.</p>
<p>Langkah-langkah penyelidikan mulai diambil secara sembunyi-sembunyi di bawah bayang-bayang kegelapan malam yang dingin.</p>
<p>Bab ini berakhir dengan penemuan sebuah bukti awal yang sangat mengejutkan, mengonfirmasi bahwa ancaman tersebut nyata adanya.</p>";
                } elseif (str_contains($chapTitle, 'Badai Datang Menghampiri')) {
                    $content = "
<p>Apa yang ditakutkan dalam alur cerita \"{$bookEscaped}\" akhirnya benar-benar terjadi dengan kekuatan yang meluluhlantakkan.</p>
<p>Badai masalah datang menghampiri tanpa peringatan terakhir, menghantam seluruh sendi kehidupan yang telah dibangun susah payah.</p>
<p>Langit di atas mendadak berubah menjadi hitam pekat, diiringi kilatan petir yang menyambar-nyambar seolah menggambarkan kemarahan alam.</p>
<p>Krisis besar pecah di berbagai lini, memaksa karakter utama untuk berdiri tegak di tengah gempuran badai yang tiada henti.</p>
<p>Dampak dari hantaman badai ini dirasakan secara langsung melalui serangkaian peristiwa buruk berikut:</p>
<ol>
    <li>Kehilangan dukungan finansial dan moral dari pihak-pihak yang sebelumnya berjanji akan selalu setia membantu.</li>
    <li>Fitnah keji yang tersebar luas ke publik, merusak reputasi baik yang telah dijaga dengan integritas tinggi selama bertahun-tahun.</li>
    <li>Konfrontasi fisik dan verbal secara terbuka dengan musuh utama yang akhirnya menampakkan diri seutuhnya.</li>
    <li>Rasa putus asa yang mendalam akibat kegagalan rencana cadangan yang sebelumnya sangat diandalkan.</li>
</ol>
<p>Dalam situasi yang serba kacau ini, kekuatan mental dan fisik benar-benar diuji hingga ke batas kemampuan paling maksimal.</p>
<p>Air mata dan keringat bercampur menjadi satu, membasahi bumi yang menjadi saksi bisu perjuangan hidup dan mati ini.</p>
<p>Buku \"{$bookEscaped}\" mencapai salah satu titik paling krusial di mana kehancuran tampak begitu dekat dan tak terhindarkan.</p>
<p>Teman sejati dan lawan palsu mulai terpisahkan dengan jelas di bawah tekanan situasi yang sangat ekstrem ini.</p>
<p>Setiap keputusan yang diambil di tengah badai membawa konsekuensi besar yang harus ditanggung dengan keberanian penuh.</p>
<p>Meskipun segalanya tampak runtuh di sekelilingnya, karakter utama menolak untuk berlutut dan menyerah pada keadaan yang kejam.</p>
<p>Dengan sisa-sisa kekuatan yang ada, pertahanan terakhir dibangun demi melindungi apa yang masih tersisa dari kehancuran total.</p>
<p>Bab ini ditutup dengan keheningan mencekam setelah badai pertama berlalu, menyisakan puing-puing perjuangan yang berserakan.</p>";
                } elseif (str_contains($chapTitle, 'Titik Terang Harapan')) {
                    $content = "
<p>Setelah malam yang begitu panjang dan melelahkan di dalam kisah \"{$bookEscaped}\", fajar akhirnya mulai menyingsing di ufuk timur.</p>
<p>Cahaya keemasan menembus celah-celah mendung yang mulai menipis, membawa kehangatan baru bagi jiwa-jiwa yang sempat membeku.</p>
<p>Titik terang harapan mulai kelihatan dari arah yang sama sekali tidak pernah diduga sebelumnya oleh siapapun.</p>
<p>Bantuan datang dari aliansi tak terduga, memberikan napas baru bagi perjuangan yang hampir saja menemui jalan buntu.</p>
<p>Beberapa tanda-tanda positif yang menandai datangnya titik terang ini antara lain meliputi hal-hal berikut:</p>
<ul>
    <li>Ditemukannya dokumen rahasia yang mampu membersihkan nama baik dari segala tuduhan dan fitnah keji.</li>
    <li>Kembalinya kepercayaan dari masyarakat dan orang-orang terdekat setelah kebenaran mulai terungkap ke permukaan.</li>
    <li>Pulihnya kekuatan fisik dan mental karakter utama setelah melewati masa-masa kritis yang sangat melelahkan.</li>
    <li>Terbukanya jalan keluar atau solusi konkret atas permasalahan rumit yang selama ini mengunci pergerakan.</li>
</ul>
<p>Rencana baru disusun dengan lebih matang, belajar dari kesalahan-kesalahan fatal yang terjadi di masa lalu.</p>
<p>Senyuman yang sempat hilang kini perlahan kembali menghiasi wajah-wajah yang lelah namun penuh dengan keyakinan baru.</p>
<p>Buku \"{$bookEscaped}\" membawa pembacanya pada pemahaman mendalam bahwa tidak ada badai yang abadi di dunia ini.</p>
<p>Perjalanan ini memang menyisakan luka dan bekas trauma, namun hal itu justru membuat karakter utama tumbuh jauh lebih kuat.</p>
<p>Setiap langkah kaki kini terasa lebih ringan dan mantap, dipandu oleh keyakinan yang telah teruji oleh kerasnya cobaan hidup.</p>
<p>Masa depan yang cerah kini membentang luas di hadapan, menanti untuk dijelajahi dengan lembaran kisah yang baru.</p>
<p>Kisah ini berakhir dengan pelukan hangat di bawah sinar matahari pagi, merayakan kemenangan atas diri sendiri dan keadaan.</p>
<p>Bab terakhir ini ditutup dengan penuh rasa syukur dan optimisme tinggi menyambut hari esok yang jauh lebih baik.</p>";
                }

                Chapter::create([
                    'book_id' => $book->id,
                    'user_id' => $user->id,
                    'title' => $chapTitle,
                    'content' => $content,
                    'view' => rand(10, 100),
                ]);

                usleep(1000000); // Jeda 1 detik (1.000.000 mikrodetik)
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

