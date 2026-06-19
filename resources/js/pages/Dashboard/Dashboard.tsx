import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { BookItem } from '../../types/models';

/** @internal Default mock books shown when no props are passed (dev fallback). */
const DEFAULT_BOOKS: BookItem[] = [
    {
        id: 1,
        title: 'Belajar Pemrograman Web untuk Pemula',
        cover: 'https://placehold.co/100x140/1e3a8a/FFFFFF?text=Belajar+Web&font=Montserrat',
        description: 'Panduan praktis belajar HTML, CSS, dan JavaScript dari nol.',
        chaptersCount: 5,
        viewsSum: 250,
        createdAt: '2026-06-08',
        slug: 'belajar-web',
    },
    {
        id: 2,
        title: 'Kisah Kancil Modern abad 21',
        cover: 'https://placehold.co/100x140/f28b50/FFFFFF?text=Kancil+21&font=Montserrat',
        description: 'Fabel jenaka yang diadaptasi dengan teknologi modern.',
        chaptersCount: 2,
        viewsSum: 100,
        createdAt: '2026-06-07',
        slug: 'kancil-abad-21',
    },
];

interface DashboardProps {
    books?: BookItem[];
    totalBooks?: number;
    totalChapters?: number;
    totalReaders?: number;
}

import { sortBooks, type SortOption } from '../../utils/bookHelpers';

/**
 * Main author dashboard page — displays stats cards and a filterable/searchable
 * table of the authenticated writer's books.
 */
const Dashboard = ({ books, totalBooks, totalChapters, totalReaders }: DashboardProps) => {
    useFlashNotification();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');

    const booksList = books ?? DEFAULT_BOOKS;
    const finalTotalBooks   = totalBooks   ?? booksList.length;
    const finalTotalChapters = totalChapters ?? booksList.reduce((acc, b) => acc + b.chaptersCount, 0);
    const finalTotalReaders = totalReaders ?? 350;

    /** Filtered + sorted books derived from current search query and sort selection. */
    const filteredAndSortedBooks = React.useMemo(() => {
        const filtered = searchQuery.trim()
            ? booksList.filter(
                (book) =>
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : booksList;

        return sortBooks(filtered, sortBy);
    }, [booksList, searchQuery, sortBy]);

    /**
     * Shows a SweetAlert2 confirmation dialog before deleting a book.
     * On confirmation, sends a DELETE request via Inertia.
     */
    const handleDeleteBook = (id: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Buku dan semua bab di dalamnya akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f28b50',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/dashboard/books/${id}`);
            }
        });
    };

    return (
        <DashboardLayout active="dashboard">
            <PageHeader
                title="Dashboard"
                breadcrumbs={['Dashboard']}
                actions={
                    <div className="d-flex gap-2" style={{ maxWidth: '480px' }}>
                        <input
                            type="text"
                            className="form-control rounded-3 border-light shadow-sm px-3"
                            placeholder="Cari judul atau sinopsis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div style={{ width: '170px' }}>
                            <select
                                className="form-select rounded-3 border-light shadow-sm text-secondary"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                }
            />

            {/* Stats Cards */}
            <div className="row g-3 g-lg-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-primary">
                        <i className="fa-solid fa-glasses fs-4 mb-3" />
                        <h2 className="fw-bold mb-1">{finalTotalReaders}</h2>
                        <div style={{ fontSize: '0.9rem' }}>Total Pembaca</div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-success">
                        <i className="fa-solid fa-book-open fs-3 mb-3" />
                        <h2 className="fw-bold mb-1">{finalTotalBooks}</h2>
                        <div style={{ fontSize: '0.9rem' }}>Total Buku</div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center" style={{ backgroundColor: '#2d2d2d' }}>
                        <i className="fa-solid fa-file-lines fs-3 mb-3" />
                        <h2 className="fw-bold mb-1">{finalTotalChapters}</h2>
                        <div style={{ fontSize: '0.9rem' }}>Total Chapter</div>
                    </div>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4">
                <h5 className="fw-bold text-dark mb-4">Buku Buatan Saya</h5>

                {booksList.length === 0 ? (
                    <EmptyState
                        icon="fa-solid fa-book-open"
                        heading="Belum ada buku"
                        description="Unggah karya orisinal Anda untuk melihatnya di sini."
                        action={{ label: 'Upload Buku', href: '/dashboard/books', icon: 'fa-solid fa-plus' }}
                    />
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
                                            <i className="fa-solid fa-magnifying-glass fs-3 mb-2 d-block" />
                                            Tidak ada buku yang cocok dengan pencarian "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAndSortedBooks.map((book, index) => (
                                        <tr key={book.id}>
                                            <td className="text-secondary py-3">{index + 1}</td>
                                            <td className="py-3">
                                                <img
                                                    src={book.cover ?? ''}
                                                    alt={book.title}
                                                    className="rounded-2 shadow-sm border border-light"
                                                    style={{ width: '55px', height: '80px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td className="py-3 text-wrap">
                                                <div className="text-dark fw-bold mb-1">{book.title}</div>
                                                <p className="text-secondary small mb-1" style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                                                    {book.description}
                                                </p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-light text-dark border border-light small font-monospace">
                                                        <i className="fa-solid fa-list-ol text-secondary me-1" />
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
                                                    <i className="fa-solid fa-eye text-white me-1" />
                                                    Chapter
                                                </Link>
                                                <Link
                                                    href={`/dashboard/books/${book.id}/edit`}
                                                    className="btn btn-success btn-sm rounded-3 me-2 border-0 shadow-sm text-white"
                                                    title="Edit Buku"
                                                >
                                                    <i className="fa-solid fa-pen text-white" />
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm rounded-3 shadow-sm"
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    title="Hapus Buku"
                                                >
                                                    <i className="fa-solid fa-trash text-white" />
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
        </DashboardLayout>
    );
};

export default Dashboard;
