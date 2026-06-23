import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import DisqusComments from '../../components/home/DisqusComments';
import { DiscussionEmbed } from 'disqus-react';

type Chapter = {
    id: number;
    book_id: number;
    title: string;
    slug: string;
    content: string;
    view: number;
    created_at: string;
    updated_at: string;
};

type Genre = {
    id: number;
    name: string;
    slug: string;
};

type UserType = {
    id: number;
    name: string;
    role?: string;
    instagram?: string | null;
    twitter?: string | null;
    saweria?: string | null;
    avatar?: string | null;
};

type BookProps = {
    book: {
        id: number;
        title: string;
        slug: string;
        description: string;
        cover: string | null;
        view: number;
        created_at: string;
        updated_at: string;
        chapters: Chapter[];
        genres?: Genre[];
        likes: number;
        user?: UserType;
    };
    isLiked: boolean;
};

const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
    }
    return `https://${url}`;
};

export default function BookDetail({ book, isLiked }: BookProps) {
    const { flash, auth }: any = usePage().props;
    const authCheck = !!auth?.user;
    const [sortBy, setSortBy] = useState('newest');

    const sortedChapters = React.useMemo(() => {
        if (!book.chapters) return [];
        let chaptersCopy = [...book.chapters];

        if (sortBy === 'newest') {
            chaptersCopy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === 'oldest') {
            chaptersCopy.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else if (sortBy === 'views_desc') {
            chaptersCopy.sort((a, b) => (b.view ?? 0) - (a.view ?? 0));
        } else if (sortBy === 'views_asc') {
            chaptersCopy.sort((a, b) => (a.view ?? 0) - (b.view ?? 0));
        }

        return chaptersCopy;
    }, [book.chapters, sortBy]);

    useEffect(() => {
        const notyf = new Notyf({
            position: { x: 'right', y: 'top' }
        });
        if (flash?.success === true) {
            notyf.success(flash.message);
        } else if (flash?.success === false) {
            notyf.error(flash.message);
        }
        if (flash) {
            flash.success = null;
        }
    }, [flash]);

    const handleLikeToggle = () => {
        router.post(`/dashboard/books/${book.id}/like`, {}, {
            preserveScroll: true
        });
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    const notyf = new Notyf({
                        position: { x: 'right', y: 'top' }
                    });
                    notyf.success('Link buku berhasil disalin!');
                })
                .catch(() => {
                    alert('Gagal menyalin link.');
                });
        }
    };
    const coverUrl = book.cover
        ? book.cover.startsWith('http')
            ? book.cover
            : `/storage/covers/${book.cover}`
        : `https://picsum.photos/300/400?random=${book.id + 10}`;

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return '-';
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '-';
        }

        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="bg-white min-vh-100 font-sans">
            <Head title={book.title} />

            <style>{`
                .book-cover-overlap {
                    margin-top: -140px;
                }
                @media (max-width: 767.98px) {
                    .book-cover-overlap {
                        margin-top: -70px;
                    }
                }
                .chapter-card {
                    transition: all 0.2s ease-in-out;
                    border: 1px solid #eaeaea;
                }
                .chapter-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border-color: #FF5A00;
                }
                .hover-opacity:hover {
                    opacity: 0.8;
                }
            `}</style>

            {/* 1. NAVBAR */}
            <Navbar />

            {/* 2. BLURRED BANNER SECTION */}
            <div className="position-relative overflow-hidden w-100" style={{ height: '300px', backgroundColor: '#1a1a1a' }}>
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backgroundImage: `url(${coverUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(3px) brightness(0.7)',
                        transform: 'scale(1.15)',
                        zIndex: 1,
                    }}
                />
                <div className="container px-4 px-lg-5 h-100 position-relative d-flex align-items-end pb-4" style={{ zIndex: 2 }}>
                    <div className="row w-100">
                        <div className="col-md-4 col-lg-3 d-none d-md-block" />
                        <div className="col-12 col-md-8 col-lg-9 ps-md-4">
                            <h1 className="fw-bold text-white mb-0 fs-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {book.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT CONTAINER */}
            <div className="container px-4 px-lg-5 py-4">
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-12 col-md-4 col-lg-3">
                        <div className="book-cover-overlap text-center text-md-start mb-4">
                            <div
                                className="mx-auto mx-md-0 rounded-3 overflow-hidden shadow-lg border border-white border-4"
                                style={{ width: '220px', aspectRatio: '3/4', position: 'relative', zIndex: 10 }}
                            >
                                <img src={coverUrl} alt={book.title} className="w-100 h-100 object-fit-cover" />
                            </div>
                        </div>

                        {/* Like Button and Total Views */}
                        <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 mb-4">
                            {authCheck ? (
                                <button
                                    onClick={handleLikeToggle}
                                    className={`btn btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm border ${isLiked ? 'btn-danger border-danger text-white bg-danger' : 'btn-outline-danger'
                                        }`}
                                    style={{ transition: 'all 0.2s ease' }}
                                >
                                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                                    <span>{book.likes ?? 0}</span>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="btn btn-sm btn-outline-danger px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm text-decoration-none"
                                >
                                    <i className="fa-regular fa-heart"></i>
                                    <span>Suka ({book.likes ?? 0})</span>
                                </Link>
                            )}
                            <div className="btn btn-sm btn-outline-secondary px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm border border-secondary-subtle bg-light-subtle" style={{ pointerEvents: 'none' }}>
                                <i className="fa-regular fa-eye"></i>
                                <span>{book.chapters ? book.chapters.reduce((sum, ch) => sum + (ch.view ?? 0), 0) : 0}</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="btn btn-sm btn-outline-primary px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm border border-primary-subtle bg-light-subtle"
                                style={{ transition: 'all 0.2s ease' }}
                            >
                                <i className="fa-regular fa-share-from-square"></i>
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-light rounded-3 p-4 border border-light-subtle shadow-sm mb-4">
                            <div className="mb-3">
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Penulis
                                </span>
                                {book.user ? (
                                    <Link href={`/author/${book.user.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark hover-opacity">
                                        <img
                                            src={book.user.avatar ? (book.user.avatar.startsWith('http') ? book.user.avatar : `/storage/avatars/${book.user.avatar}`) : 'https://www.gravatar.com/avatar/?d=mp&s=40'}
                                            alt={book.user.name}
                                            className="rounded-circle object-fit-cover shadow-sm border border-white border-2"
                                            style={{ width: '32px', height: '32px' }}
                                        />
                                        <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                                            {book.user.name}
                                        </span>
                                    </Link>
                                ) : (
                                    <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>Anonim</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Published
                                </span>
                                <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                    {formatDate(book.created_at)}
                                </span>
                            </div>
                            <div className="mb-3">
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Total Chapter
                                </span>
                                <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                    {book.chapters?.length || 0} Chapter
                                </span>
                            </div>
                            <div className="mb-3">
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Ikuti & Dukung Penulis
                                </span>
                                {book.user && book.user.role === 'penulis' && (book.user.instagram || book.user.twitter || book.user.saweria) ? (
                                    <div className="d-flex align-items-center gap-4">
                                        {book.user.instagram && (
                                            <a
                                                href={normalizeUrl(book.user.instagram)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-danger hover-opacity"
                                                title="Instagram"
                                            >
                                                <i className="fa-brands fa-instagram fa-2x"></i>
                                            </a>
                                        )}
                                        {book.user.twitter && (
                                            <a
                                                href={normalizeUrl(book.user.twitter)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-info hover-opacity"
                                                title="Twitter"
                                            >
                                                <i className="fa-brands fa-twitter fa-2x"></i>
                                            </a>
                                        )}
                                        {book.user.saweria && (
                                            <a
                                                href={normalizeUrl(book.user.saweria)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-warning hover-opacity"
                                                title="Saweria"
                                            >
                                                <i className="fa-solid fa-wallet fa-2x"></i>
                                            </a>
                                        )}
                                    </div>
                                )
                                    :
                                    (<span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>Penulis tidak menambahkan sosial medianya</span>)
                                }
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="col-12 col-md-8 col-lg-9 ps-md-4">
                        {/* Title for Mobile Screens */}
                        <div className="d-md-none text-center mb-4">
                            <h2 className="fw-bold text-dark">{book.title}</h2>
                        </div>

                        {/* Genre Tags */}
                        <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-md-start">
                            {book.genres && book.genres.length > 0 ? (
                                book.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="bg-light text-secondary border border-light-subtle px-3 py-2 rounded-1 fw-medium"
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {genre.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-secondary small">Tanpa Genre</span>
                            )}
                        </div>

                        {/* Description / Synopsis */}
                        <div className="mb-5">
                            <p className="text-secondary leading-relaxed" style={{ fontSize: '0.95rem', textAlign: 'justify', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: book.description }}>
                            </p>
                        </div>

                        {/* Chapter List */}
                        <div className="mb-4">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
                                <h4 className="fw-bold mb-0">
                                    <span style={{ color: '#FF5A00' }}>Chapter</span> List
                                </h4>
                                <div style={{ width: '200px' }}>
                                    <select
                                        className="form-select form-select-sm rounded-3 border-light-subtle shadow-sm text-secondary"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Chapter Terbaru</option>
                                        <option value="oldest">Chapter Terlama</option>
                                        <option value="views_desc">View Terbesar</option>
                                        <option value="views_asc">View Terkecil</option>
                                    </select>
                                </div>
                            </div>

                            {sortedChapters && sortedChapters.length > 0 ? (
                                <div className="d-flex flex-column gap-2">
                                    {sortedChapters.map((chapter, idx) => {
                                        // Highlight the first chapter card with a right border indicator
                                        const isFirst = idx === 0;

                                        return (
                                            <Link
                                                key={chapter.id}
                                                href={`/book/${book.slug}/${chapter.slug}`}
                                                className="chapter-card card border-0 bg-light rounded-2 text-decoration-none"
                                                style={{
                                                    borderRight: isFirst ? '4px solid #FF5A00' : 'none',
                                                }}
                                            >
                                                <div className="card-body p-3 d-flex align-items-center gap-3">
                                                    <div
                                                        className="bg-white rounded border d-flex align-items-center justify-content-center text-secondary shadow-sm"
                                                        style={{ width: '40px', height: '40px', flexShrink: 0 }}
                                                    >
                                                        <i className="fa-regular fa-file-lines fs-5"></i>
                                                    </div>
                                                    <div className="flex-grow-1 d-flex justify-content-between align-items-center gap-2">
                                                        <div>
                                                            <h6 className="mb-0 fw-bold text-dark">{chapter.title}</h6>
                                                            <small className="text-muted">{formatDate(chapter.created_at)}</small>
                                                        </div>
                                                        <div className="text-secondary small fw-medium d-flex align-items-center gap-1">
                                                            <i className="fa-regular fa-eye text-muted"></i>
                                                            <span>{chapter.view ?? 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-light rounded-3 p-5 text-center border border-dashed border-light-subtle">
                                    <i className="fa-regular fa-folder-open text-muted fs-2 mb-3"></i>
                                    <p className="text-muted mb-0">Belum ada chapter untuk buku ini.</p>
                                </div>
                            )}
                        </div>

                        {/* Disqus Comments Section */}
                        <DisqusComments
                            shortname="bintang-4"
                            config={{
                                url: typeof window !== 'undefined' ? `${window.location.origin}/book/${book.slug}` : '',
                                identifier: `book-${book.id}`,
                                title: book.title,
                            }}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}
