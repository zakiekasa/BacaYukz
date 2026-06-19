import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Sidebar from '../components/dashboard/Sidebar';

export type LikedBookItem = {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
    description: string;
    chaptersCount: number;
    createdAt: string;
    likes: number;
};

interface DashboardLikesProps {
    books?: LikedBookItem[];
}

const DashboardLikes = ({ books = [] }: DashboardLikesProps) => {
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
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = React.useMemo(() => {
        if (searchQuery.trim() === '') {
            return books;
        }
        return books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [books, searchQuery]);

    const handleUnlike = (id: number) => {
        Swal.fire({
            title: 'Hapus dari buku disukai?',
            text: 'Anda tidak akan lagi menyukai buku ini.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f28b50',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/dashboard/books/${id}/like`);
            }
        });
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex font-sans position-relative">
            {/* Backdrop Mobile */}
            {isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 d-lg-none"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar active="likes" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column overflow-x-hidden">
                {/* Header */}
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
                                Halaman <span className="mx-1">/</span> <span className="text-dark">Buku Disukai</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Buku Disukai</h4>
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="d-flex gap-2 w-100" style={{ maxWidth: '360px' }}>
                        <input
                            type="text"
                            className="form-control rounded-3 border-light shadow-sm px-3 w-100"
                            placeholder="Cari buku disukai..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4 flex-grow-1">
                    <h5 className="fw-bold text-dark mb-4">Daftar Buku Favorit Saya</h5>

                    {books.length === 0 ? (
                        <div className="text-center py-5 my-auto">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                                <i className="fa-regular fa-heart fs-3 text-secondary"></i>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">Belum ada buku yang disukai</h6>
                            <p className="text-secondary small mb-3">Jelajahi karya menarik di halaman utama dan berikan tombol suka.</p>
                            <Link href="/" className="btn btn-primary btn-sm rounded-3 px-4 py-2" style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}>
                                Cari Buku
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
                                    {filteredBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-5 text-secondary">
                                                <i className="fa-solid fa-magnifying-glass fs-3 mb-2 d-block"></i>
                                                Tidak ada buku yang cocok dengan pencarian "{searchQuery}"
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBooks.map((book, index) => {
                                            const coverUrl = book.cover
                                                ? (book.cover.startsWith('http') ? book.cover : `/storage/covers/${book.cover}`)
                                                : `https://picsum.photos/300/400?random=${book.id + 10}`;

                                            return (
                                                <tr key={book.id}>
                                                    <td className="text-secondary py-3">{index + 1}</td>
                                                    <td className="py-3">
                                                        <img
                                                            src={coverUrl}
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
                                                            <span className="badge bg-light text-danger border border-light-subtle small font-monospace">
                                                                <i className="fa-solid fa-heart text-danger me-1"></i>
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
                                                            <i className="fa-solid fa-book-open text-white me-1"></i>
                                                            Baca
                                                        </Link>
                                                        <button 
                                                            className="btn btn-danger btn-sm rounded-3 shadow-sm text-white" 
                                                            onClick={() => handleUnlike(book.id)}
                                                            title="Batal Suka"
                                                        >
                                                            <i className="fa-solid fa-heart-broken text-white"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
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

export default DashboardLikes;
