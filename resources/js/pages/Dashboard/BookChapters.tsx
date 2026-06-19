import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import DraftStatusBadge from '../../components/dashboard/DraftStatusBadge';
import { Link } from '@inertiajs/react';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { BookItem, ChapterItem } from '../../types/models';

interface BookChaptersProps {
    book: Pick<BookItem, 'id' | 'title' | 'slug' | 'cover'>;
    chapters?: ChapterItem[];
}

/**
 * Dashboard page for managing the chapters of a single book.
 * Displays a summary card for the book and a table of all its chapters,
 * with options to edit or delete each chapter.
 */
const BookChapters = ({ book, chapters = [] }: BookChaptersProps) => {
    useFlashNotification();

    /**
     * Shows a confirmation dialog before permanently deleting a chapter.
     * On confirmation, sends a DELETE request via Inertia.
     */
    const handleDeleteChapter = (chapterId: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Bab ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f28b50',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/dashboard/chapters/${chapterId}`);
            }
        });
    };

    return (
        <DashboardLayout active="books">
            <PageHeader
                title={`Kelola Bab: ${book.title}`}
                breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, 'Kelola Bab']}
            />

            {/* Book Summary Card */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
                    {book.cover && (
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="rounded-3 shadow-sm border border-light"
                            style={{ width: '90px', height: '130px', objectFit: 'cover' }}
                        />
                    )}
                    <div className="text-center text-sm-start flex-grow-1">
                        <h5 className="fw-bold text-dark mb-1">{book.title}</h5>
                        <p className="text-secondary small mb-3">
                            Total {chapters.length} bab yang telah diterbitkan untuk buku ini.
                        </p>
                        <Link
                            href={`/dashboard/chapters?book_id=${book.id}`}
                            className="btn btn-primary btn-sm rounded-3 px-4 py-2 fw-semibold"
                            style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                        >
                            <i className="fa-solid fa-plus me-2" />
                            Tambah Bab Baru
                        </Link>
                    </div>
                </div>
            </div>

            {/* Chapters Table */}
            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4">
                <h5 className="fw-bold text-dark mb-4">Daftar Bab</h5>

                {chapters.length === 0 ? (
                    <EmptyState
                        icon="fa-solid fa-file-invoice"
                        heading="Belum ada bab"
                        description='Buku ini belum memiliki bab. Klik "Tambah Bab Baru" di atas untuk mulai menulis.'
                    />
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle border-light text-nowrap" style={{ minWidth: '600px' }}>
                            <thead>
                                <tr className="border-bottom">
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '8%', borderBottomWidth: '2px' }}>NO</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '42%', borderBottomWidth: '2px' }}>JUDUL BAB</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-center" style={{ width: '10%', borderBottomWidth: '2px' }}>DIBACA</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-center" style={{ width: '15%', borderBottomWidth: '2px' }}>STATUS</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '15%', borderBottomWidth: '2px' }}>TANGGAL TERBIT</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-end" style={{ width: '10%', borderBottomWidth: '2px' }}>AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {chapters.map((chapter, index) => (
                                    <tr key={chapter.id}>
                                        <td className="text-secondary py-3">{index + 1}</td>
                                        <td className="py-3 text-wrap fw-bold text-dark">{chapter.title}</td>
                                        <td className="py-3 text-center">
                                            <span className="badge bg-light text-secondary border border-light font-monospace">
                                                <i className="fa-solid fa-eye me-1" />
                                                {chapter.view}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <DraftStatusBadge isDraft={chapter.is_draft} />
                                        </td>
                                        <td className="py-3 text-secondary">{chapter.createdAt}</td>
                                        <td className="py-3 text-end">
                                            <Link
                                                href={`/dashboard/chapters/${chapter.id}/edit`}
                                                className="btn btn-success btn-sm rounded-3 me-2 border-0 shadow-sm text-white"
                                                title="Edit Bab"
                                            >
                                                <i className="fa-solid fa-pen text-white" />
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm rounded-3 shadow-sm"
                                                onClick={() => handleDeleteChapter(chapter.id)}
                                                title="Hapus Bab"
                                            >
                                                <i className="fa-solid fa-trash text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BookChapters;
