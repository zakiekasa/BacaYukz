import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Sidebar from '../components/dashboard/Sidebar';

export type BookItem = {
    id: number;
    title: string;
    cover: string;
    description: string;
    chaptersCount: number;
    viewsSum?: number;
    createdAt: string;
};

interface DashboardProps {
    books?: BookItem[];
    totalBooks?: number;
    totalChapters?: number;
    totalReaders?: number;
}

const Dashboard = ({ books, totalBooks, totalChapters, totalReaders }: DashboardProps) => {
    const { flash }: any = usePage().props;
    const notyf = new Notyf({
        position: { x: 'right', y: 'top' }
    });

    useEffect(() => {
        if (flash?.success === true) {
            notyf.success(flash.message);
        } else if (flash?.success === false) {
            notyf.error(flash.message);
        }
        if (flash) {
            flash.success = null;
        }
    }, [flash]);

    // Default mock data untuk pengujian statis jika props tidak dikirim
    const defaultBooks: BookItem[] = [
        {
            id: 1,
            title: 'Belajar Pemrograman Web untuk Pemula',
            cover: 'https://placehold.co/100x140/1e3a8a/FFFFFF?text=Belajar\nWeb&font=Montserrat',
            description: 'Panduan praktis belajar HTML, CSS, dan JavaScript dari nol untuk membangun website modern.',
            chaptersCount: 5,
            viewsSum: 250,
            createdAt: '2026-06-08',
        },
        {
            id: 2,
            title: 'Kisah Kancil Modern abad 21',
            cover: 'https://placehold.co/100x140/f28b50/FFFFFF?text=Kancil\nAbad+21&font=Montserrat',
            description: 'Fabel jenaka yang diadaptasi dengan teknologi modern untuk anak-anak kreatif masa kini.',
            chaptersCount: 2,
            viewsSum: 100,
            createdAt: '2026-06-07',
        }
    ];

    const booksList = books !== undefined ? books : defaultBooks;
    const finalTotalBooks = totalBooks !== undefined ? totalBooks : booksList.length;
    const finalTotalChapters = totalChapters !== undefined ? totalChapters : booksList.reduce((acc, b) => acc + b.chaptersCount, 0);
    const finalTotalReaders = totalReaders !== undefined ? totalReaders : 350;

    const handleDeleteBook = (id: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Buku dan semua bab di dalamnya akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f28b50',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/dashboard/books/${id}`);
            }
        });
    };
    // State untuk mengontrol buka-tutup sidebar di perangkat mobile/tablet
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    const filteredAndSortedBooks = React.useMemo(() => {
        let result = [...booksList];

        if (searchQuery.trim() !== '') {
            result = result.filter(book => 
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                book.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === 'latest') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'oldest') {
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (sortBy === 'chapters_desc') {
            result.sort((a, b) => b.chaptersCount - a.chaptersCount);
        } else if (sortBy === 'chapters_asc') {
            result.sort((a, b) => a.chaptersCount - b.chaptersCount);
        } else if (sortBy === 'views_desc') {
            result.sort((a, b) => (b.viewsSum ?? 0) - (a.viewsSum ?? 0));
        } else if (sortBy === 'views_asc') {
            result.sort((a, b) => (a.viewsSum ?? 0) - (b.viewsSum ?? 0));
        }

        return result;
    }, [booksList, searchQuery, sortBy]);

    return (
        // Wrapper utama: d-flex (row)
        <div className="bg-body-tertiary min-vh-100 d-flex font-sans position-relative">

            {/* --- BACKDROP MOBILE --- */}
            {/* Munculkan layar gelap transparan di belakang sidebar saat terbuka di mobile */}
            {isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 d-lg-none"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR --- */}
            <Sidebar active="dashboard" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column overflow-x-hidden">

                {/* Header (Hamburger, Breadcrumb, Search) */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 pt-2 gap-3">

                    <div className="d-flex align-items-center gap-3">
                        {/* Tombol Hamburger - Hanya terlihat di Tablet/HP (d-lg-none) */}
                        <button
                            className="btn btn-white bg-white border-light shadow-sm rounded-3 px-3 py-2 d-lg-none"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <i className="fa-solid fa-bars text-dark fs-5"></i>
                        </button>

                        {/* Breadcrumb & Judul */}
                        <div>
                            <div className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                                Halaman <span className="mx-1">/</span> <span className="text-dark">Dashboard</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Dashboard</h4>
                        </div>
                    </div>

                    {/* Kolom Pencarian & Filter */}
                    <div className="d-flex gap-2 w-100" style={{ maxWidth: '480px' }}>
                        <div className="flex-grow-1">
                            <input
                                type="text"
                                className="form-control rounded-3 border-light shadow-sm px-3 w-100"
                                placeholder="Cari judul atau sinopsis..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '170px' }}>
                            <select
                                className="form-select rounded-3 border-light shadow-sm text-secondary"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                            >
                                <option value="latest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="chapters_desc">Bab Terbanyak</option>
                                <option value="chapters_asc">Bab Terdikit</option>
                                <option value="views_desc">View Terbanyak</option>
                                <option value="views_asc">View Terdikit</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="row g-3 g-lg-4 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-primary">
                            <i className="fa-solid fa-glasses fs-4 mb-3"></i>
                            <h2 className="fw-bold mb-1">{finalTotalReaders}</h2>
                            <div style={{ fontSize: '0.9rem' }}>Total Pembaca</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-success">
                            <i className="fa-solid fa-book-open fs-3 mb-3"></i>
                            <h2 className="fw-bold mb-1">{finalTotalBooks}</h2>
                            <div style={{ fontSize: '0.9rem' }}>Total Buku</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center" style={{ backgroundColor: '#2d2d2d' }}>
                            <i className="fa-solid fa-file-lines fs-3 mb-3"></i>
                            <h2 className="fw-bold mb-1">{finalTotalChapters}</h2>
                            <div style={{ fontSize: '0.9rem' }}>Total Chapter</div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4">
                    <h5 className="fw-bold text-dark mb-4">Buku Buatan Saya</h5>

                    {booksList.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                                <i className="fa-solid fa-book-open fs-3 text-secondary"></i>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">Belum ada buku</h6>
                            <p className="text-secondary small mb-3">Unggah karya orisinal Anda untuk melihatnya di sini.</p>
                            <Link href="/dashboard/books" className="btn btn-primary btn-sm rounded-3 px-4 py-2" style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}>
                                <i className="fa-solid fa-plus me-2"></i>Upload Buku
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle border-light text-nowrap" style={{ minWidth: '600px' }}>
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="text-secondary fw-semibold small pb-3" style={{ width: '5%', borderBottomWidth: '2px' }}>NO</th>
                                        <th className="text-secondary fw-semibold small pb-3" style={{ width: '15%', borderBottomWidth: '2px' }}>COVER</th>
                                        <th className="text-secondary fw-semibold small pb-3" style={{ width: '60%', borderBottomWidth: '2px' }}>INFO BUKU</th>
                                        <th className="text-secondary fw-semibold small pb-3 text-end" style={{ width: '20%', borderBottomWidth: '2px' }}>AKSI</th>
                                    </tr>
                                </thead>

                                <tbody className="border-0">
                                    {filteredAndSortedBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-5 text-secondary">
                                                <i className="fa-solid fa-magnifying-glass fs-3 mb-2 d-block"></i>
                                                Tidak ada buku yang cocok dengan pencarian "{searchQuery}"
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAndSortedBooks.map((book, index) => (
                                            <tr key={book.id}>
                                                <td className="text-secondary py-3">{index + 1}</td>
                                                <td className="py-3">
                                                    <img
                                                        src={book.cover}
                                                        alt={book.title}
                                                        className="rounded-2 shadow-sm border border-light"
                                                        style={{ width: '55px', height: '80px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td className="py-3 text-wrap">
                                                    <div className="text-dark fw-bold mb-1">{book.title}</div>
                                                    <p className="text-secondary small mb-1 line-clamp-2" style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                                                        {book.description}
                                                    </p>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="badge bg-light text-dark border border-light small font-monospace">
                                                            <i className="fa-solid fa-list-ol text-secondary me-1"></i>
                                                            {book.chaptersCount} Bab
                                                        </span>
                                                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                                                            Diunggah: {book.createdAt}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-end">
                                                    <Link 
                                                        href={`/dashboard/books/${book.id}/chapters`} 
                                                        className="btn btn-primary btn-sm rounded-3 me-2 border-0 shadow-sm fw-semibold text-white"
                                                        title="Kelola Bab"
                                                        style={{ fontSize: '0.85rem' }}
                                                    >
                                                        <i className="fa-solid fa-eye text-white me-1"></i>
                                                        Chapter
                                                    </Link>
                                                    <Link 
                                                        href={`/dashboard/books/${book.id}/edit`} 
                                                        className="btn btn-success btn-sm rounded-3 me-2 border-0 shadow-sm text-white"
                                                        title="Edit Buku"
                                                    >
                                                        <i className="fa-solid fa-pen text-white"></i>
                                                    </Link>
                                                    <button 
                                                        className="btn btn-danger btn-sm rounded-3 shadow-sm" 
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        title="Hapus Buku"
                                                    >
                                                        <i className="fa-solid fa-trash text-white"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
