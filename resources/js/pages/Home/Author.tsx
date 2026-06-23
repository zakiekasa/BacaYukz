import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';
import Book from '../../components/home/Book';

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
    genres?: GenreItem[];
}

interface AuthorType {
    id: number;
    name: string;
    avatar_url: string | null;
    instagram?: string | null;
    twitter?: string | null;
    saweria?: string | null;
    role?: string;
}

interface AuthorProps {
    author: AuthorType;
    books: BookItem[];
}

const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
    }
    return `https://${url}`;
};

export default function AuthorProfile({ author, books = [] }: AuthorProps) {
    return (
        <div className="bg-white min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title={`Penulis: ${author.name} - BacaYukz`} />
            <Navbar />

            {/* Main Content Container */}
            <div className="container px-4 px-lg-5 py-5 flex-grow-1">
                {/* Author Info Card */}
                <div className="card border-0 bg-light rounded-4 p-4 p-md-5 mb-5 shadow-sm">
                    <div className="row align-items-center g-4">
                        <div className="col-md-auto text-center">
                            <img
                                src={author.avatar_url ?? 'https://www.gravatar.com/avatar/?d=mp&s=150'}
                                alt={author.name}
                                className="rounded-circle object-fit-cover border border-3 border-white shadow"
                                style={{ width: '130px', height: '130px' }}
                            />
                        </div>
                        <div className="col text-center text-md-start">
                            <span className="badge rounded-pill bg-white text-secondary border px-3 py-1.5 mb-2 fw-bold shadow-xs text-uppercase" style={{ color: '#FF5A00', fontSize: '0.7rem' }}>
                                <i className="fa-solid fa-pen-fancy me-1"></i>{author.role ?? 'Penulis'}
                            </span>
                            <h2 className="fw-bolder text-dark mb-2">{author.name}</h2>
                            <p className="text-secondary small mb-3">
                                Bergabung bersama BacaYukz untuk berbagi cerita, berkreasi, dan menginspirasi jutaan pembaca.
                            </p>

                            {/* Social Links */}
                            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mt-3">
                                {author.instagram && (
                                    <a
                                        href={normalizeUrl(author.instagram)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1.5 shadow-sm bg-white"
                                        title="Instagram"
                                    >
                                        <i className="fa-brands fa-instagram fs-6"></i>
                                        <span className="small fw-semibold">Instagram</span>
                                    </a>
                                )}
                                {author.twitter && (
                                    <a
                                        href={normalizeUrl(author.twitter)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-info rounded-pill px-3 d-flex align-items-center gap-1.5 shadow-sm bg-white"
                                        title="Twitter"
                                    >
                                        <i className="fa-brands fa-twitter fs-6"></i>
                                        <span className="small fw-semibold">Twitter</span>
                                    </a>
                                )}
                                {author.saweria && (
                                    <a
                                        href={normalizeUrl(author.saweria)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-warning rounded-pill px-3 d-flex align-items-center gap-1.5 shadow-sm bg-white"
                                        title="Saweria"
                                    >
                                        <i className="fa-solid fa-wallet fs-6"></i>
                                        <span className="small fw-semibold">Dukung Penulis</span>
                                    </a>
                                )}
                                {!author.instagram && !author.twitter && !author.saweria && (
                                    <span className="text-muted small italic"><i className="fa-solid fa-link-slash me-1"></i>Belum ada link sosial media</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Author's Books list */}
                <section className="mb-5">
                    <h3 className="fw-bolder text-dark mb-4 pb-2 border-bottom">
                        Daftar Buku Oleh <span className="wattpad-orange">{author.name}</span> ({books.length})
                    </h3>

                    {books.length === 0 ? (
                        <div className="bg-light rounded-4 py-5 text-center border border-dashed shadow-sm">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
                                <i className="fa-regular fa-folder-open text-secondary fs-4"></i>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Belum Ada Karya</h5>
                            <p className="text-secondary small mb-0">Penulis ini belum mempublikasikan buku atau karyanya di platform.</p>
                        </div>
                    ) : (
                        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                            {books.map((book) => (
                                <div key={book.id} className="col d-flex">
                                    <Book
                                        id={book.id}
                                        title={book.title}
                                        cover={book.cover}
                                        genre={book.genres && book.genres.length > 0 ? book.genres.map(g => g.name).join(', ') : 'Tanpa Genre'}
                                        href={`/book/${book.slug}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
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
                            <a href="#" className="text-secondary text-decoration-none">Kebijakan Privasi</a>
                            <a href="#" className="text-secondary text-decoration-none">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
