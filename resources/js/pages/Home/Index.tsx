import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
}

const Home = ({ books = [], genres = [] }: { books: BookItem[]; genres: GenreItem[] }) => {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('latest');

    // Filter and sort books based on selected category pill and sort option
    const filteredBooks = React.useMemo(() => {
        let result = [...books];

        // 1. Filter by category
        if (activeCategory !== 'Semua') {
            result = result.filter((book) =>
                book.genres?.some((genre) => genre.name.toLowerCase() === activeCategory.toLowerCase())
            );
        }

        // 2. Sort books
        if (sortBy === 'latest') {
            result.sort((a, b) => b.id - a.id);
        } else if (sortBy === 'popular') {
            result.sort((a, b) => (b.view ?? 0) - (a.view ?? 0));
        } else if (sortBy === 'liked') {
            result.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        }

        return result;
    }, [books, activeCategory, sortBy]);

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const searchParamQuery = urlParams ? urlParams.get('search') || '' : '';

    // Filter and sort search results based on search input, category, and sorting selection
    const filteredSearchResults = React.useMemo(() => {
        if (!searchParamQuery) return [];

        let result = books.filter(book =>
            book.title.toLowerCase().includes(searchParamQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchParamQuery.toLowerCase())
        );

        if (activeCategory !== 'Semua') {
            result = result.filter((book) =>
                book.genres?.some((genre) => genre.name.toLowerCase() === activeCategory.toLowerCase())
            );
        }

        if (sortBy === 'latest') {
            result.sort((a, b) => b.id - a.id);
        } else if (sortBy === 'popular') {
            result.sort((a, b) => (b.view ?? 0) - (a.view ?? 0));
        } else if (sortBy === 'liked') {
            result.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        }

        return result;
    }, [books, searchParamQuery, activeCategory, sortBy]);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(false);

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftBtn(scrollLeft > 5);
            setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            checkScrollPosition();
        }, 100);

        window.addEventListener('resize', checkScrollPosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [books]);

    return (
        <div className="bg-white min-vh-100 font-sans">
            <Head title="Home - BacaYukz" />
            <Navbar />

            {/* 2. MAIN CONTENT CONTAINER */}
            <div className="container px-4 px-lg-5 py-5">
                <style>{`
                    .custom-horizontal-scroll {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE and Edge */
                    }
                    .custom-horizontal-scroll::-webkit-scrollbar {
                        display: none; /* Chrome, Safari and Opera */
                    }
                    .hover-scale {
                        transition: all 0.2s ease-in-out;
                    }
                    .hover-scale:hover {
                        transform: translateY(-50%) scale(1.1) !important;
                        background-color: #ffffff !important;
                        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
                    }
                `}</style>

                {searchParamQuery ? (
                    <section className="mb-5 animate-fade-in" id="search-results">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                            <div>
                                <h3 className="fw-bolder text-dark mb-1">Hasil Pencarian</h3>
                                <p className="text-secondary small mb-0">Ditemukan {filteredSearchResults.length} buku untuk kata kunci: <strong className="text-dark">"{searchParamQuery}"</strong></p>
                            </div>
                            <Link href="/" className="btn btn-light btn-sm rounded-pill border px-3 fw-semibold text-dark text-decoration-none shadow-sm">
                                <i className="fa-solid fa-xmark me-1"></i>Bersihkan Pencarian
                            </Link>
                        </div>

                        {/* Filter & Sort Bar for Search Results */}
                        <div className="bg-light rounded-4 p-3 border border-light-subtle mb-4 animate-fade-in">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                {/* Category filter pills */}
                                <div className="d-flex gap-2 overflow-x-auto pb-1 w-100" style={{ whiteSpace: 'nowrap' }}>
                                    <button
                                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === 'Semua' ? 'btn-dark' : 'btn-white border text-dark bg-white'}`}
                                        onClick={() => setActiveCategory('Semua')}
                                    >
                                        Semua Kategori
                                    </button>
                                    {genres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === genre.name ? 'btn-dark' : 'btn-white border text-dark bg-white'}`}
                                            onClick={() => setActiveCategory(genre.name)}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort selection dropdown */}
                                <div className="d-flex align-items-center gap-2 ms-md-auto text-nowrap">
                                    <span className="text-secondary small fw-semibold"><i className="fa-solid fa-sort me-1"></i>Urutkan:</span>
                                    <select
                                        className="form-select form-select-sm rounded-pill border shadow-sm px-3 py-1.5 text-secondary cursor-pointer"
                                        style={{ width: '140px', fontSize: '0.8rem' }}
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value)}
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="popular">Terpopuler</option>
                                        <option value="liked">Disukai</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredSearchResults.length === 0 ? (
                            <div className="bg-light rounded-4 py-5 text-center border border-dashed border-light-subtle shadow-sm">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
                                    <i className="fa-solid fa-magnifying-glass text-secondary fs-4"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">Tidak ditemukan hasil</h5>
                                <p className="text-secondary small mb-3">Coba gunakan kata kunci lain, bersihkan filter, atau periksa ejaan Anda.</p>
                                <button onClick={() => { setActiveCategory('Semua'); setSortBy('latest'); }} className="btn btn-primary btn-sm rounded-pill px-4 py-2 text-decoration-none fw-bold shadow-sm" style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}>Reset Filter</button>
                            </div>
                        ) : (
                            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                                {filteredSearchResults.map((item) => (
                                    <Book
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        cover={item.cover}
                                        genre={item.genres && item.genres.length > 0 ? item.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                        href={`/book/${item.slug}`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* SECTION 1: Buku Terbaru (Scrollable Horizontal Carousel) */}
                        <section className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bolder text-dark mb-0">Buku Terbaru</h4>
                            </div>

                            {books.length === 0 ? (
                                <div className="bg-light rounded-3 p-5 text-center border border-dashed border-light-subtle">
                                    <i className="fa-regular fa-folder-open text-muted fs-3 mb-2"></i>
                                    <p className="text-muted mb-0">Belum ada buku terbaru saat ini.</p>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    {showLeftBtn && (
                                        <button
                                            onClick={scrollLeft}
                                            className="btn btn-white shadow border rounded-circle position-absolute top-50 start-0 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center hover-scale"
                                            style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#f28b50', left: '-22px' }}
                                            aria-label="Scroll left"
                                        >
                                            <i className="fa-solid fa-chevron-left fs-5"></i>
                                        </button>
                                    )}
                                    {showRightBtn && (
                                        <button
                                            onClick={scrollRight}
                                            className="btn btn-white shadow border rounded-circle position-absolute top-50 end-0 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center hover-scale"
                                            style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#f28b50', right: '-22px' }}
                                            aria-label="Scroll right"
                                        >
                                            <i className="fa-solid fa-chevron-right fs-5"></i>
                                        </button>
                                    )}
                                    <div ref={scrollRef} onScroll={checkScrollPosition} className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 flex-nowrap overflow-x-auto pb-3 custom-horizontal-scroll" style={{ scrollSnapType: 'x mandatory' }}>
                                        {books.map((item) => (
                                            <Book
                                                key={item.id}
                                                id={item.id}
                                                title={item.title}
                                                cover={item.cover}
                                                href={`/book/${item.slug}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* SECTION 2: Buku Berdasarkan Kategori (Filterable Grid) */}
                        <section className="mb-5 mt-5 pt-3" id="kategori">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                                <h4 className="fw-bolder text-dark mb-0 text-truncate">Buku Berdasarkan Kategori</h4>

                                {/* Sort Dropdown */}
                                <div className="d-flex align-items-center gap-2 ms-md-auto">
                                    <span className="text-secondary small fw-semibold text-nowrap"><i className="fa-solid fa-sort me-1"></i>Urutkan:</span>
                                    <select
                                        className="form-select form-select-sm rounded-pill border shadow-sm px-3 py-1.5 text-secondary cursor-pointer"
                                        style={{ width: '150px', fontSize: '0.85rem' }}
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value)}
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="popular">Terpopuler</option>
                                        <option value="liked">Disukai</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter Pills */}
                            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
                                <button
                                    className={`btn rounded-pill px-4 fw-semibold ${activeCategory === 'Semua' ? 'btn-dark' : 'btn-light border bg-white text-dark'}`}
                                    onClick={() => setActiveCategory('Semua')}
                                >
                                    Semua
                                </button>
                                {genres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        className={`btn rounded-pill px-3 fw-semibold ${activeCategory === genre.name ? 'btn-dark' : 'btn-light border bg-white text-dark'}`}
                                        onClick={() => setActiveCategory(genre.name)}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>

                            {/* Filtered Grid */}
                            {filteredBooks.length === 0 ? (
                                <div className="bg-light rounded-3 p-5 text-center border border-dashed border-light-subtle">
                                    <i className="fa-solid fa-box-open text-muted fs-3 mb-2"></i>
                                    <p className="text-muted mb-0">Tidak ada buku dalam kategori "{activeCategory}" saat ini.</p>
                                </div>
                            ) : (
                                <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                                    {filteredBooks.map((item) => (
                                        <Book
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            cover={item.cover}
                                            genre={item.genres && item.genres.length > 0 ? item.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                            href={`/book/${item.slug}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;