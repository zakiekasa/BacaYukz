import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '../../components/home/Navbar';

type Book = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover: string | null;
    view: number;
    created_at: string;
    updated_at: string;
};

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

type ChapterProps = {
    book: Book;
    chapter: Chapter;
    previous_chapter: Chapter | null;
    next_chapter: Chapter | null;
};

export default function ChapterDetail({ book, chapter, previous_chapter, next_chapter }: ChapterProps) {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setScrollPercent(percent);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const calculateReadingTime = (text: string) => {
        if (!text) {
            return 1;
        }

        const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
        const wordsPerMinute = 200;

        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

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
            <Head title={`${chapter.title} - ${book.title}`} />

            <style>{`
                .medium-content p {
                    margin-bottom: 1.8rem;
                }
                .medium-content h2, .medium-content h3 {
                    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }
                .medium-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                    margin: 2rem 0;
                }
                .medium-content pre {
                    background-color: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 4px;
                    font-size: 0.95rem;
                    margin-bottom: 1.8rem;
                    overflow-x: auto;
                }
            `}</style>

            {/* Reading Scroll Progress Bar */}
            <div
                className="position-fixed top-0 start-0"
                style={{
                    height: '4px',
                    width: `${scrollPercent}%`,
                    backgroundColor: '#2b5876',
                    zIndex: 1060,
                    transition: 'width 0.1s ease-out',
                }}
            />

            {/* 1. NAVBAR */}
            <Navbar />

            {/* 2. MAIN READING CONTAINER */}
            <div className="container py-5" style={{ maxWidth: '720px' }}>
                {/* Back to Book Detail */}
                <div className="mb-4">
                    <Link
                        href={`/book/${book.slug}`}
                        className="text-secondary text-decoration-none d-inline-flex align-items-center small fw-semibold"
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Kembali ke {book.title}
                    </Link>
                </div>

                {/* Chapter Title & Metadata Header */}
                <header className="mb-5">
                    <h1 className="display-4 fw-bold text-dark mb-3" style={{ letterSpacing: '-1px', lineHeight: '1.2' }}>
                        {chapter.title}
                    </h1>
                    <div className="d-flex flex-wrap align-items-center text-secondary gap-3 small border-bottom border-light pb-4">
                        <div className="d-flex align-items-center">
                            <i className="fa-regular fa-calendar me-2"></i>
                            {formatDate(chapter.created_at)}
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-regular fa-eye me-2"></i>
                            {chapter.view} kali dibaca
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-regular fa-clock me-2"></i>
                            {calculateReadingTime(chapter.content)} menit membaca
                        </div>
                    </div>
                </header>

                {/* Chapter Content Area */}
                <article
                    className="medium-content text-dark mb-5"
                    style={{
                        fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                        fontSize: '1.25rem',
                        lineHeight: '1.9',
                        color: '#292929',
                        letterSpacing: '-0.003em',
                        wordBreak: 'break-word',
                        textAlign: 'justify',
                    }}
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                />

                {/* Footer Navigation */}
                <footer className="border-top border-light pt-5 pb-5">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-12 col-md-4 mb-3 mb-md-0 text-start">
                            {previous_chapter ? (
                                <Link
                                    href={`/book/${book.slug}/${previous_chapter.slug}`}
                                    className="btn btn-outline-secondary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                                >
                                    <i className="fa-solid fa-chevron-left small"></i>
                                    Sebelumnya
                                </Link>
                            ) : (
                                <span className="btn btn-outline-secondary rounded-pill px-4 py-2 disabled opacity-50">
                                    Chapter Pertama
                                </span>
                            )}
                        </div>

                        <div className="col-12 col-md-4 mb-3 mb-md-0 text-center">
                            <Link
                                href={`/book/${book.slug}`}
                                className="btn btn-light rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 border"
                            >
                                <i className="fa-solid fa-list-ul small"></i>
                                Daftar Chapter
                            </Link>
                        </div>

                        <div className="col-12 col-md-4 text-end">
                            {next_chapter ? (
                                <Link
                                    href={`/book/${book.slug}/${next_chapter.slug}`}
                                    className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#2b5876', borderColor: '#2b5876' }}
                                >
                                    Berikutnya
                                    <i className="fa-solid fa-chevron-right small"></i>
                                </Link>
                            ) : (
                                <span className="btn btn-outline-secondary rounded-pill px-4 py-2 disabled opacity-50">
                                    Chapter Terakhir
                                </span>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
