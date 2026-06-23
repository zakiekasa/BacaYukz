import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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

interface BooksProps {
    books: BookItem[];
    genres: GenreItem[];
}

export default function Books({ books = [], genres = [] }: BooksProps) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('latest');

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const searchParamQuery = urlParams ? urlParams.get('search') || '' : '';

    const [searchQuery, setSearchQuery] = useState(searchParamQuery);

    useEffect(() => {
        setSearchQuery(searchParamQuery);
    }, [searchParamQuery]);

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

    // Filter and sort search results based on search input, category, and sorting selection
    const filteredSearchResults = React.useMemo(() => {
        if (!searchParamQuery) return [];

        let result = books.filter(book =>
            book.title.toLowerCase().includes(searchParamQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchParamQuery.toLowerCase()) ||
            (book.user && book.user.name.toLowerCase().includes(searchParamQuery.toLowerCase()))
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            router.get(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.get('/books');
        }
    };

    return (
        <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title="Katalog Buku - BacaYukz" />
            <Navbar />

            <div className="container px-4 px-lg-5 py-5 flex-grow-1">
                {/* Search Bar Section */}
                <div className="mb-4">
                    <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                        <div className="input-group shadow-sm rounded-pill overflow-hidden border bg-white">
                            <span className="input-group-text bg-white border-0 ps-3">
                                <i className="fa-solid fa-magnifying-glass text-secondary"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 py-2.5 ps-2 shadow-none"
                                placeholder="Cari judul buku, deskripsi, atau nama penulis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="btn btn-white border-0 pe-3"
                                    onClick={() => {
                                        setSearchQuery('');
                                        router.get('/books');
                                    }}
                                >
                                    <i className="fa-solid fa-xmark text-secondary"></i>
                                </button>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Search query header banner if active */}
                {searchParamQuery && (
                    <div className="alert alert-light border-0 shadow-sm rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center">
                        <div>
                            <span className="text-secondary small fw-semibold d-block">Hasil Pencarian untuk:</span>
                            <h4 className="fw-bold mb-0 text-primary">"{searchParamQuery}"</h4>
                        </div>
                        <Link href="/books" className="btn btn-light rounded-pill border fw-bold text-secondary">
                            Hapus Pencarian
                        </Link>
                    </div>
                )}

                {/* Genre Filters & Sorting Options */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        {/* Genre Pills */}
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${activeCategory === 'Semua' ? 'btn-primary' : 'btn-light border text-secondary'}`}
                                onClick={() => setActiveCategory('Semua')}
                            >
                                Semua
                            </button>
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${activeCategory === genre.name ? 'btn-primary' : 'btn-light border text-secondary'}`}
                                    onClick={() => setActiveCategory(genre.name)}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>

                        {/* Sorting Dropdown */}
                        <div className="d-flex align-items-center gap-2" style={{ minWidth: '180px' }}>
                            <i className="fa-solid fa-arrow-down-wide-short text-secondary"></i>
                            <select
                                className="form-select rounded-3 shadow-none border-light-subtle text-secondary"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="latest">Urutkan: Terbaru</option>
                                <option value="popular">Urutkan: Terpopuler</option>
                                <option value="liked">Urutkan: Paling Disukai</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Catalog Grid */}
                <h3 className="fw-bold mb-4 d-flex align-items-center">
                    <i className="fa-solid fa-book-open text-primary me-3"></i> 
                    {searchParamQuery ? `Ditemukan (${filteredSearchResults.length}) Buku` : 'Semua Koleksi Buku'}
                </h3>

                <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                    {searchParamQuery ? (
                        filteredSearchResults.length > 0 ? (
                            filteredSearchResults.map((book) => (
                                <div key={book.id} className="col d-flex">
                                    <Book
                                        id={book.id}
                                        title={book.title}
                                        cover={book.cover}
                                        genre={book.genres && book.genres.length > 0 ? book.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                        href={`/book/${book.slug}`}
                                        authorName={book.user?.name}
                                        authorAvatar={book.user?.avatar}
                                        authorId={book.user?.id}
                                        views={book.view}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="fa-solid fa-magnifying-glass-minus text-muted display-3 mb-3 opacity-50"></i>
                                <h5 className="fw-bold">Tidak Ada Hasil Cocok</h5>
                                <p className="text-secondary small">Coba kata kunci lain atau ubah filter kategori Anda.</p>
                            </div>
                        )
                    ) : (
                        filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <div key={book.id} className="col d-flex">
                                    <Book
                                        id={book.id}
                                        title={book.title}
                                        cover={book.cover}
                                        genre={book.genres && book.genres.length > 0 ? book.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                        href={`/book/${book.slug}`}
                                        authorName={book.user?.name}
                                        authorAvatar={book.user?.avatar}
                                        authorId={book.user?.id}
                                        views={book.view}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="fa-regular fa-folder-open text-muted display-3 mb-3 opacity-50"></i>
                                <h5 className="fw-bold">Belum Ada Buku</h5>
                                <p className="text-secondary small">Tidak ada buku dalam kategori ini untuk sementara waktu.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
