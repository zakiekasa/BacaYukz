import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { LikedBookItem } from '../../types/models';

interface DashboardLikesProps {
    books?: LikedBookItem[];
}

import { resolveCoverUrl } from '../../utils/bookHelpers';

/**
 * Dashboard page showing books that the authenticated user has liked.
 * Users can search their favourites and remove a like via a confirmation dialog.
 */
const DashboardLikes = ({ books = [] }: DashboardLikesProps) => {
    useFlashNotification();

    const [searchQuery, setSearchQuery] = useState('');

    /** Filtered list based on title/description search. */
    const filteredBooks = React.useMemo(() => {
        if (!searchQuery.trim()) return books;
        return books.filter(
            (book) =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [books, searchQuery]);

    /**
     * Shows a confirmation dialog and, on confirmation, sends a toggle-like
     * request to the server to remove the book from the user's liked list.
     */
    const handleUnlike = (id: number) => {
        Swal.fire({
            title: 'Hapus dari buku disukai?',
            text: 'Anda tidak akan lagi menyukai buku ini.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#FF5A00',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/dashboard/books/${id}/like`);
            }
        });
    };

    return (
        <DashboardLayout active="likes">
            <PageHeader
                title="Buku Disukai"
                breadcrumbs={['Buku Disukai']}
                actions={
                    <input
                        type="text"
                        className="form-control rounded-3 border-light shadow-sm px-3"
                        placeholder="Cari buku disukai..."
                        style={{ width: '280px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                }
            />

            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4 flex-grow-1">
                <h5 className="fw-bold text-dark mb-4">Daftar Buku Favorit Saya</h5>

                {books.length === 0 ? (
                    <EmptyState
                        icon="fa-regular fa-heart"
                        heading="Belum ada buku yang disukai"
                        description="Jelajahi karya menarik di halaman utama dan berikan tombol suka."
                        action={{ label: 'Cari Buku', href: '/' }}
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
                                {filteredBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-secondary">
                                            <i className="fa-solid fa-magnifying-glass fs-3 mb-2 d-block" />
                                            Tidak ada buku yang cocok dengan pencarian "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBooks.map((book, index) => (
                                        <tr key={book.id}>
                                            <td className="text-secondary py-3">{index + 1}</td>
                                            <td className="py-3">
                                                <img
                                                    src={resolveCoverUrl(book.cover, book.id)}
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
                                                    <span className="badge bg-light text-danger border border-light-subtle small font-monospace">
                                                        <i className="fa-solid fa-heart text-danger me-1" />
                                                        {book.likes} Suka
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-end">
                                                <Link
                                                    href={`/book/${book.slug}`}
                                                    className="btn btn-primary btn-sm rounded-3 me-2 border-0 shadow-sm fw-semibold text-white"
                                                    title="Baca Buku"
                                                    style={{ fontSize: '0.85rem' }}
                                                >
                                                    <i className="fa-solid fa-book-open text-white me-1" />
                                                    Baca
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm rounded-3 shadow-sm text-white"
                                                    onClick={() => handleUnlike(book.id)}
                                                    title="Batal Suka"
                                                >
                                                    <i className="fa-solid fa-heart-broken text-white" />
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

export default DashboardLikes;
