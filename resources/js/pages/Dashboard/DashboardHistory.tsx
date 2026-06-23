import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import { resolveCoverUrl } from '../../utils/bookHelpers';

interface ReadBookItem {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
    description: string;
    total_minutes: number;
    last_read_at: string | null;
    last_read_date: string;
    authorName?: string;
    genres: string[];
}

interface DashboardHistoryProps {
    history?: ReadBookItem[];
}

/**
 * Dashboard page displaying books the authenticated user has read.
 * Shows total minutes spent reading each book, genres, and last read date.
 */
const DashboardHistory = ({ history = [] }: DashboardHistoryProps) => {
    useFlashNotification();

    const [searchQuery, setSearchQuery] = useState('');

    /** Filtered reading history list based on search query. */
    const filteredHistory = React.useMemo(() => {
        if (!searchQuery.trim()) return history;
        return history.filter(
            (item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.authorName && item.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [history, searchQuery]);

    return (
        <DashboardLayout active="history">
            <PageHeader
                title="Riwayat Membaca"
                breadcrumbs={['Riwayat Membaca']}
                actions={
                    <input
                        type="text"
                        className="form-control rounded-3 border-light shadow-sm px-3"
                        placeholder="Cari dalam riwayat..."
                        style={{ width: '280px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                }
            />

            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4 flex-grow-1">
                <h5 className="fw-bold text-dark mb-4">Riwayat Buku Yang Saya Baca</h5>

                {history.length === 0 ? (
                    <EmptyState
                        icon="fa-solid fa-clock-rotate-left"
                        heading="Belum ada riwayat membaca"
                        description="Mulai jelajahi buku yang tersedia di perpustakaan kami sekarang!"
                        action={{ label: 'Jelajahi Buku', href: '/books' }}
                    />
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle border-light text-nowrap" style={{ minWidth: '600px' }}>
                            <thead>
                                <tr className="border-bottom">
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '5%', borderBottomWidth: '2px' }}>NO</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '15%', borderBottomWidth: '2px' }}>COVER</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '45%', borderBottomWidth: '2px' }}>INFO BUKU</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-center" style={{ width: '15%', borderBottomWidth: '2px' }}>WAKTU BACA</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-center" style={{ width: '15%', borderBottomWidth: '2px' }}>TERAKHIR DIBACA</th>
                                    <th className="text-secondary fw-semibold small pb-3 text-end" style={{ width: '5%', borderBottomWidth: '2px' }}>AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-secondary">
                                            <i className="fa-solid fa-magnifying-glass fs-3 mb-2 d-block" />
                                            Tidak ada riwayat yang cocok dengan pencarian "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="text-secondary py-3">{index + 1}</td>
                                            <td className="py-3">
                                                <img
                                                    src={resolveCoverUrl(item.cover, item.id)}
                                                    alt={item.title}
                                                    className="rounded-2 shadow-sm border border-light"
                                                    style={{ width: '55px', height: '80px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td className="py-3 text-wrap">
                                                <div className="text-dark fw-bold mb-1">{item.title}</div>
                                                {item.authorName && (
                                                    <div className="text-secondary small mb-1" style={{ fontSize: '0.8rem' }}>
                                                        Oleh: <span className="fw-semibold">{item.authorName}</span>
                                                    </div>
                                                )}
                                                <p className="text-secondary small mb-2" style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                                                    {item.description}
                                                </p>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {item.genres.map((genre, idx) => (
                                                        <span key={idx} className="badge bg-light text-secondary border border-light-subtle small fw-normal">
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="badge bg-light text-primary border border-light-subtle px-2 py-1.5 font-monospace">
                                                    <i className="fa-regular fa-clock me-1 text-primary" />
                                                    {item.total_minutes} Menit
                                                </span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="text-secondary small">
                                                    {item.last_read_at || item.last_read_date}
                                                </span>
                                            </td>
                                            <td className="py-3 text-end">
                                                <Link
                                                    href={`/book/${item.slug}`}
                                                    className="btn btn-primary btn-sm rounded-3 border-0 shadow-sm fw-semibold text-white px-3 py-1.5"
                                                    title="Baca Buku"
                                                    style={{ fontSize: '0.85rem' }}
                                                >
                                                    <i className="fa-solid fa-book-open text-white me-1" />
                                                    Lanjutkan
                                                </Link>
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

export default DashboardHistory;
