import { Head, Link } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';

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
    };
};

export default function BookDetail({ book }: BookProps) {
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
                    border-color: #2b5876;
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
                        filter: 'blur(25px) brightness(0.45)',
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

                        {/* Info Box */}
                        <div className="bg-light rounded-3 p-4 border border-light-subtle shadow-sm mb-4">
                            <div className="mb-3">
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Published
                                </span>
                                <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                    {formatDate(book.created_at)}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted d-block small fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                    Total Chapter
                                </span>
                                <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                    {book.chapters?.length || 0} Chapter
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="col-12 col-md-8 col-lg-9 ps-md-4">
                        {/* Title for Mobile Screens */}
                        <div className="d-md-none text-center mb-4">
                            <h2 className="fw-bold text-dark">{book.title}</h2>
                        </div>

                        {/* Genre Tags (Static list matches mockup) */}
                        <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-md-start">
                            {['Music', 'Romance', 'School', 'Seinen', 'Shoujo Ai'].map((genre, idx) => (
                                <span
                                    key={idx}
                                    className="bg-light text-secondary border border-light-subtle px-3 py-2 rounded-1 fw-medium"
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Description / Synopsis */}
                        <div className="mb-5">
                            <p className="text-secondary leading-relaxed" style={{ fontSize: '0.95rem', textAlign: 'justify', lineHeight: '1.6' }}>
                                {book.description || 'Tidak ada deskripsi untuk buku ini.'}
                            </p>
                        </div>

                        {/* Chapter List */}
                        <div className="mb-4">
                            <h4 className="fw-bold mb-3">
                                <span style={{ color: '#2b5876' }}>Chapter</span> List
                            </h4>

                            {book.chapters && book.chapters.length > 0 ? (
                                <div className="d-flex flex-column gap-2">
                                    {book.chapters.map((chapter, idx) => {
                                        // Highlight the first chapter card with a right border indicator
                                        const isFirst = idx === 0;

                                        return (
                                            <Link
                                                key={chapter.id}
                                                href={`/book/${book.slug}/${chapter.slug}`}
                                                className="chapter-card card border-0 bg-light rounded-2 text-decoration-none"
                                                style={{
                                                    borderRight: isFirst ? '4px solid #0d6efd' : 'none',
                                                }}
                                            >
                                                <div className="card-body p-3 d-flex align-items-center gap-3">
                                                    <div
                                                        className="bg-white rounded border d-flex align-items-center justify-content-center text-secondary shadow-sm"
                                                        style={{ width: '40px', height: '40px', flexShrink: 0 }}
                                                    >
                                                        <i className="fa-regular fa-file-lines fs-5"></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0 fw-bold text-dark">{chapter.title}</h6>
                                                        <small className="text-muted">{formatDate(chapter.created_at)}</small>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
