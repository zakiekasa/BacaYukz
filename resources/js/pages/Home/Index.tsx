import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Book from '../../components/home/Book';
import Navbar from '../../components/home/Navbar';

interface GenreItem {
    id: number;
    name: string;
    slug: string;
}

interface BookItem {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
    description: string;
    view?: number;
    likes?: number;
    genres?: GenreItem[];
    user?: {
        id: number;
        name: string;
        avatar: string | null;
    };
}

interface IndexProps {
    popularBooks?: BookItem[];
}

const Home = ({ popularBooks = [] }: IndexProps) => {
    const { auth } = usePage().props as any;

    const bookCollage = React.useMemo(() => {
        return popularBooks.slice(0, 4).map((book, idx) => {
            const coverUrl = book.cover
                ? ((book.cover.startsWith('http') || book.cover.startsWith('data:')) ? book.cover : `/storage/covers/${book.cover}`)
                : `https://picsum.photos/300/400?random=${book.id + 10}`;
            return {
                id: book.id,
                title: book.title,
                coverUrl
            };
        });
    }, [popularBooks]);

    return (
        <div className="bg-white min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title="Beranda - BacaYukz" />
            <Navbar />

            {/* Custom Wattpad-inspired Styles */}
            <style>{`
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0) rotate(-6deg); }
                    50% { transform: translateY(-8px) rotate(-4deg); }
                }
                @keyframes float-gentle-reverse {
                    0%, 100% { transform: translateY(0) rotate(6deg); }
                    50% { transform: translateY(-8px) rotate(4deg); }
                }
                .float-1 { animation: float-gentle 5s ease-in-out infinite; }
                .float-2 { animation: float-gentle-reverse 6s ease-in-out infinite; }
                
                .wattpad-orange {
                    color: #FF5A00 !important;
                }
                .btn-wattpad-primary {
                    background-color: #FF5A00 !important;
                    border-color: #FF5A00 !important;
                    color: #fff !important;
                    transition: all 0.2s ease;
                }
                .btn-wattpad-primary:hover {
                    background-color: #e04f00 !important;
                    border-color: #e04f00 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 90, 0, 0.2);
                }
                .btn-wattpad-secondary {
                    background-color: transparent !important;
                    border-color: #fff !important;
                    color: #fff !important;
                    transition: all 0.2s ease;
                }
                .btn-wattpad-secondary:hover {
                    background-color: rgba(255, 255, 255, 0.15) !important;
                    transform: translateY(-2px);
                }
                .btn-wattpad-outline {
                    background-color: transparent !important;
                    border-color: #FF5A00 !important;
                    color: #FF5A00 !important;
                    transition: all 0.2s ease;
                }
                .btn-wattpad-outline:hover {
                    background-color: rgba(255, 90, 0, 0.05) !important;
                    transform: translateY(-2px);
                }
                .wattpad-hero {
                    background: linear-gradient(135deg, #FF5A00 0%, #FF7B25 100%);
                    position: relative;
                    overflow: hidden;
                    border-radius: 1.5rem;
                }
                [data-bs-theme="dark"] .wattpad-hero {
                    background: linear-gradient(135deg, #cc4800 0%, #1e120c 100%);
                }
                [data-bs-theme="dark"] .text-dark {
                    color: #ffffff !important;
                }
                .hover-scale {
                    transition: all 0.2s ease-in-out;
                }
                .hover-scale:hover {
                    transform: translateY(-5px) !important;
                    box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.1) !important;
                }
                .pillar-section {
                    padding: 80px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                [data-bs-theme="dark"] .pillar-section {
                    border-bottom-color: #222;
                }
                .book-collage-item {
                    width: 120px;
                    height: 175px;
                    border-radius: 6px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    background-color: #eee;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }
                .book-collage-item:hover {
                    transform: scale(1.08);
                    z-index: 10;
                }
            `}</style>

            {/* 2. MAIN CONTENT CONTAINER */}
            <div className="container px-4 px-lg-5 py-5 flex-grow-1">
                {/* WATTPAD HERO SECTION */}
                <div className="wattpad-hero py-5 px-4 px-md-5 mb-5 shadow-sm position-relative">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7 text-center text-lg-start text-white position-relative z-1">
                            <h1 className="display-3 fw-bold mb-3 lh-sm" style={{ letterSpacing: '-0.03em' }}>
                                BacaYukz. Platform Bercerita Sosial Paling Dicintai.
                            </h1>
                            <p className="lead mb-4 opacity-90" style={{ fontSize: '1.15rem', lineHeight: '1.7' }}>
                                BacaYukz menghubungkan komunitas pecinta cerita di seluruh tanah air. Tulis kisah inspiratifmu sendiri, atau selami ribuan cerita seru dari para kreator berbakat kami secara gratis.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                                <Link href="/books" className="btn btn-lg rounded px-4 py-2.5 fw-bold btn-wattpad-secondary">
                                    <i className="fa-solid fa-book-open me-2"></i>Mulai Membaca
                                </Link>
                                {auth.user ? (
                                    <Link href="/dashboard" className="btn btn-lg rounded px-4 py-2.5 fw-bold btn-wattpad-secondary border-white">
                                        <i className="fa-solid fa-pen me-2"></i>Menjadi Penulis
                                    </Link>
                                ) : (
                                    <Link href="/register" className="btn btn-lg rounded px-4 py-2.5 fw-bold btn-wattpad-secondary border-white">
                                        <i className="fa-solid fa-user-plus me-2"></i>Mulai Menulis
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-5 d-none d-lg-flex justify-content-center position-relative" style={{ height: '300px' }}>
                            {/* Wattpad-style rotated book collage stack */}
                            <div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center">
                                {bookCollage.map((book, idx) => {
                                    const rotateAngle = idx === 0 ? '-12deg' : idx === 1 ? '8deg' : idx === 2 ? '-4deg' : '10deg';
                                    const topOffset = idx === 0 ? '10px' : idx === 1 ? '-20px' : idx === 2 ? '30px' : '0px';
                                    const leftOffset = idx === 0 ? '-80px' : idx === 1 ? '10px' : idx === 2 ? '100px' : '-10px';
                                    const zIndex = idx === 1 ? 4 : idx === 3 ? 3 : 2;
                                    const animationClass = idx % 2 === 0 ? 'float-1' : 'float-2';

                                    return (
                                        <img
                                            key={book.id}
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className={`position-absolute book-collage-item ${animationClass}`}
                                            style={{
                                                transform: `rotate(${rotateAngle})`,
                                                top: `calc(50% - 85px + ${topOffset})`,
                                                left: `calc(50% - 60px + ${leftOffset})`,
                                                zIndex: zIndex
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEATURE HIGHLIGHTS (STREAKS & LEADERBOARDS & COMMUNITIES) */}
                <section className="py-5">
                    <h3 className="fw-bold text-center mb-5 text-dark">Mengapa BacaYukz Lebih Menarik?</h3>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 hover-scale bg-white">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                                    <i className="fa-solid fa-fire fs-3"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Streak Harian (Gaya Strava)</h5>
                                <p className="text-secondary small mb-3">Tantang dirimu sendiri untuk membaca setiap hari secara konsisten. Hasilkan kartu prestasi story 9:16 premium untuk dibagikan di Instagram!</p>
                                {auth.user ? (
                                    <Link href="/dashboard/streak" className="btn btn-outline-primary btn-sm rounded-pill px-4 py-1.5 fw-semibold mt-auto">
                                        Lihat Streak Saya
                                    </Link>
                                ) : (
                                    <Link href="/login" className="btn btn-outline-primary btn-sm rounded-pill px-4 py-1.5 fw-semibold mt-auto">
                                        Mulai Catat Streak
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 hover-scale bg-white">
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px', backgroundColor: '#198754' }}>
                                    <i className="fa-solid fa-location-dot fs-3"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Komunitas Membaca Lokal</h5>
                                <p className="text-secondary small mb-3">Cari klub membaca di kota atau provinsi masing-masing. Bertukar cerita, adakan diskusi bersama, dan hilangkan rasa malas membaca.</p>
                                <Link href="/communities" className="btn btn-outline-success btn-sm rounded-pill px-4 py-1.5 fw-semibold mt-auto" style={{ color: '#198754', borderColor: '#198754' }}>
                                    Cari Komunitas
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 hover-scale bg-white">
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px', backgroundColor: '#ffc107' }}>
                                    <i className="fa-solid fa-trophy fs-3"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Papan Peringkat Kompetitif</h5>
                                <p className="text-secondary small mb-3">Lihat siapa saja pembaca teraktif minggu ini. Kejar peringkat teratas dan bersaing secara ramah dengan pecinta buku se-tanah air!</p>
                                <Link href="/leaderboard" className="btn btn-outline-warning btn-sm rounded-pill px-4 py-1.5 fw-semibold mt-auto" style={{ color: '#ffc107', borderColor: '#ffc107' }}>
                                    Buka Leaderboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WATTPAD PILLAR 1: WRITE */}
                <div className="row align-items-center pillar-section g-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <h2 className="display-5 fw-bold text-dark mb-3">Tulis ceritamu. Bangun komunitasmu.</h2>
                        <p className="lead text-secondary mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                            Apakah kamu memiliki cerita hebat yang ingin dibagikan? Di BacaYukz, kamu bisa merilis karya per bab, mendapatkan masukan langsung dari pembaca, dan perlahan membangun basis penggemar setiamu sendiri.
                        </p>
                        {auth.user ? (
                            <Link href="/dashboard/books" className="btn btn-wattpad-primary rounded-pill px-4 py-2 fw-bold shadow-sm">
                                <i className="fa-solid fa-pen-nib me-2"></i>Tulis Karya Sekarang
                            </Link>
                        ) : (
                            <Link href="/register" className="btn btn-wattpad-primary rounded-pill px-4 py-2 fw-bold shadow-sm">
                                <i className="fa-solid fa-feather-alt me-2"></i>Mulai Menulis
                            </Link>
                        )}
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="bg-light rounded-5 p-5 w-100 text-center border position-relative overflow-hidden" style={{ maxWidth: '480px' }}>
                            <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow mb-4" style={{ width: '80px', height: '80px' }}>
                                <i className="fa-solid fa-pencil-alt fs-2 text-warning"></i>
                            </div>
                            <h4 className="fw-bold text-dark mb-2">Editor Draf Praktis</h4>
                            <p className="text-secondary small mb-0 mx-auto" style={{ maxWidth: '320px' }}>Simpan draf tulisanmu dengan aman, kelola bab-bab cerita secara teratur, dan terbitkan saat kamu sudah merasa yakin.</p>
                        </div>
                    </div>
                </div>

                {/* WATTPAD PILLAR 2: READ */}
                <div className="row align-items-center pillar-section flex-lg-row-reverse g-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <h2 className="display-5 fw-bold text-dark mb-3">Baca cerita orisinal dari mana saja.</h2>
                        <p className="lead text-secondary mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                            Jelajahi petualangan fantasi, kisah romantis yang menghangatkan hati, misteri menegangkan, hingga cerita fiksi ilmiah seru. BacaYukz memudahkanmu menemukan ragam karya terbaik dari kreator lokal langsung di browsermu.
                        </p>
                        <Link href="/books" className="btn btn-wattpad-outline rounded-pill px-4 py-2 fw-bold shadow-sm">
                            <i className="fa-solid fa-magnifying-glass me-2"></i>Jelajahi Perpustakaan
                        </Link>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="row row-cols-2 g-3 w-100" style={{ maxWidth: '440px' }}>
                            {bookCollage.slice(0, 4).map((book, idx) => (
                                <div key={idx} className="col">
                                    <div className="rounded-3 overflow-hidden shadow-sm" style={{ aspectRatio: '3/4' }}>
                                        <img src={book.coverUrl} alt={book.title} className="w-100 h-100 object-fit-cover hover-scale" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION: Buku Terpopuler */}
                <section className="py-5" id="popular-books">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bolder text-dark mb-0">Buku Terpopuler Saat Ini</h3>
                        <Link href="/books" className="btn btn-sm btn-link text-primary text-decoration-none fw-bold">
                            Lihat Semua Buku <i className="fa-solid fa-arrow-right ms-1"></i>
                        </Link>
                    </div>

                    {popularBooks.length === 0 ? (
                        <div className="bg-light rounded-3 p-5 text-center border">
                            <i className="fa-solid fa-box-open text-muted fs-3 mb-2"></i>
                            <p className="text-muted mb-0">Belum ada koleksi buku yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                            {popularBooks.map((item) => (
                                <div key={item.id} className="col d-flex">
                                    <Book
                                        id={item.id}
                                        title={item.title}
                                        cover={item.cover}
                                        genre={item.genres && item.genres.length > 0 ? item.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                        href={`/book/${item.slug}`}
                                        authorName={item.user?.name}
                                        authorAvatar={item.user?.avatar}
                                        authorId={item.user?.id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA WRITE BANNER */}
                <section className="mb-5 py-4">
                    <div className="wattpad-hero p-5 rounded-4 shadow-sm text-center position-relative overflow-hidden">
                        <div className="position-relative z-1 text-white">
                            <h3 className="fw-bolder mb-2 fs-2">Tulis ceritamu di BacaYukz.</h3>
                            <p className="opacity-90 mx-auto mb-4" style={{ maxWidth: '550px' }}>Bergabunglah dengan komunitas pembaca dan penulis terbesar di tanah air. Mulailah menulis bab pertamamu hari ini!</p>
                            {auth.user ? (
                                <Link href="/dashboard" className="btn btn-light rounded-pill px-4 py-2.5 fw-bold shadow-sm border-0 text-dark">
                                    <i className="fa-solid fa-pen-nib me-2"></i>Mulai Menulis Sekarang
                                </Link>
                            ) : (
                                <Link href="/register" className="btn btn-light rounded-pill px-4 py-2.5 fw-bold shadow-sm border-0 text-dark">
                                    <i className="fa-solid fa-user-plus me-2"></i>Daftar Akun Gratis
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* FOOTER */}
            <footer className="bg-light border-top mt-auto py-5">
                <div className="container px-4 px-lg-5">
                    <div className="row g-4 justify-content-between">
                        <div className="col-lg-4">
                            <h5 className="fw-bold text-dark mb-3">BacaYukz</h5>
                            <p className="text-secondary small mb-3">Platform bercerita sosial digital terbesar untuk mengekspresikan imajinasi dan kreativitas menulismu secara bebas.</p>
                            <div className="d-flex gap-3 text-secondary">
                                <a href="https://x.com/zakiekas" className="text-secondary text-decoration-none"><i className="fa-brands fa-twitter fs-5"></i></a>
                                <a href="https://www.instagram.com/zakiekas_/" className="text-secondary text-decoration-none"><i className="fa-brands fa-instagram fs-5"></i></a>
                                <a href="https://github.com/zakiekasa/" className="text-secondary text-decoration-none"><i className="fa-brands fa-github fs-5"></i></a>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <h6 className="fw-bold text-dark mb-3">Hubungi Kami</h6>
                            <p className="text-secondary small mb-2"><i className="fa-regular fa-envelope me-2"></i> zakieka82@gmail.com</p>
                            <p className="text-secondary small"><i className="fa-solid fa-location-dot me-2"></i> Yogyakarta, Indonesia</p>
                        </div>
                    </div>
                    <hr className="my-4 border-light-subtle" />
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <span className="text-secondary small">© {new Date().getFullYear()} BacaYukz. Terinspirasi oleh platform sosial bercerita dunia. Hak Cipta Dilindungi.</span>
                        <div className="d-flex gap-3 small">
                            <Link href="/download" className="text-secondary text-decoration-none">Unduh Aplikasi</Link>
                            <a href="#" className="text-secondary text-decoration-none">Kebijakan Privasi</a>
                            <a href="#" className="text-secondary text-decoration-none">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;