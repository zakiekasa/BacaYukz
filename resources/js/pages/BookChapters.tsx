import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Sidebar from '../components/dashboard/Sidebar';

interface BookItem {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
}

interface ChapterItem {
    id: number;
    title: string;
    slug: string;
    view: number;
    createdAt: string;
}

interface BookChaptersProps {
    book: BookItem;
    chapters: ChapterItem[];
}

const BookChapters = ({ book, chapters = [] }: BookChaptersProps) => {
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDeleteChapter = (chapterId: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Bab ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f28b50',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/dashboard/chapters/${chapterId}`);
            }
        });
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex font-sans position-relative">
            {/* --- BACKDROP MOBILE --- */}
            {isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 d-lg-none"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Sidebar active="books" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column overflow-x-hidden">
                {/* Header (Hamburger, Breadcrumb) */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 pt-2 gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-white bg-white border-light shadow-sm rounded-3 px-3 py-2 d-lg-none"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <i className="fa-solid fa-bars text-dark fs-5"></i>
                        </button>
                        <div>
                            <div className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                                Halaman <span className="mx-1">/</span> <Link href="/dashboard" className="text-decoration-none text-secondary">Dashboard</Link> <span className="mx-1">/</span> <span className="text-dark">Kelola Bab</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Kelola Bab: {book.title}</h4>
                        </div>
                    </div>
                </div>

                {/* Book Details Summary Card */}
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
                            <p className="text-secondary small mb-3">Total {chapters.length} bab yang telah diterbitkan untuk buku ini.</p>
                            <Link
                                href={`/dashboard/chapters?book_id=${book.id}`}
                                className="btn btn-primary btn-sm rounded-3 px-4 py-2 fw-semibold"
                                style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                            >
                                <i className="fa-solid fa-plus me-2"></i>Tambah Bab Baru
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Chapters Table */}
                <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4">
                    <h5 className="fw-bold text-dark mb-4">Daftar Bab</h5>

                    {chapters.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                                <i className="fa-solid fa-file-invoice fs-3 text-secondary"></i>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">Belum ada bab</h6>
                            <p className="text-secondary small mb-0">Buku ini belum memiliki bab. Klik "Tambah Bab Baru" di atas untuk mulai menulis.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle border-light text-nowrap" style={{ minWidth: '600px' }}>
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="text-secondary fw-semibold small pb-3" style={{ width: '8%', borderBottomWidth: '2px' }}>NO</th>
                                        <th className="text-secondary fw-semibold small pb-3" style={{ width: '52%', borderBottomWidth: '2px' }}>JUDUL BAB</th>
                                        <th className="text-secondary fw-semibold small pb-3 text-center" style={{ width: '15%', borderBottomWidth: '2px' }}>DIBACA</th>
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
                                                    <i className="fa-solid fa-eye me-1"></i>
                                                    {chapter.view}
                                                </span>
                                            </td>
                                            <td className="py-3 text-secondary">{chapter.createdAt}</td>
                                            <td className="py-3 text-end">
                                                <Link
                                                    href={`/dashboard/chapters/${chapter.id}/edit`}
                                                    className="btn btn-success btn-sm rounded-3 me-2 border-0 shadow-sm text-white"
                                                    title="Edit Bab"
                                                >
                                                    <i className="fa-solid fa-pen text-white"></i>
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm rounded-3 shadow-sm"
                                                    onClick={() => handleDeleteChapter(chapter.id)}
                                                    title="Hapus Bab"
                                                >
                                                    <i className="fa-solid fa-trash text-white"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BookChapters;
