import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';

interface LeaderboardUser {
    rank: number;
    user_id: number;
    name: string;
    avatar: string | null;
    role: string;
    duration_minutes?: number; // for weekly
    duration_hours?: number; // for all-time
    streak: number;
}

interface LeaderboardProps {
    weeklyRankings: LeaderboardUser[];
    allTimeRankings: LeaderboardUser[];
    currentUserStats: {
        id: number | null;
        weekly_rank: number | null;
        all_time_rank: number | null;
        streak: number;
    };
}

export default function Leaderboard({ weeklyRankings = [], allTimeRankings = [], currentUserStats }: LeaderboardProps) {
    const { auth } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');

    const currentRankings = activeTab === 'weekly' ? weeklyRankings : allTimeRankings;
    
    // Split podium (ranks 1, 2, 3) from the rest of the list
    const podiumUsers = currentRankings.slice(0, 3);
    const listUsers = currentRankings.slice(3);

    // Reorder podium to display as: 2nd Place | 1st Place | 3rd Place
    const reorderedPodium = React.useMemo(() => {
        if (podiumUsers.length === 0) return [];
        const podium = [...podiumUsers];
        const result = [];
        
        // 2nd place
        if (podium[1]) result.push(podium[1]);
        // 1st place
        if (podium[0]) result.push(podium[0]);
        // 3rd place
        if (podium[2]) result.push(podium[2]);
        
        return result;
    }, [podiumUsers]);

    const getPodiumBadgeColor = (rank: number) => {
        if (rank === 1) return '#FFD700'; // Gold
        if (rank === 2) return '#C0C0C0'; // Silver
        return '#CD7F32'; // Bronze
    };

    const getPodiumHeight = (rank: number) => {
        if (rank === 1) return '190px';
        if (rank === 2) return '160px';
        return '140px';
    };

    const myRank = activeTab === 'weekly' ? currentUserStats.weekly_rank : currentUserStats.all_time_rank;

    return (
        <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title="Leaderboard Membaca - BacaYukz" />
            <Navbar />

            {/* Hero Banner */}
            <div className="position-relative overflow-hidden text-center bg-dark text-white py-5 mb-5 shadow-sm" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255, 90, 0, 0.95) 0%, rgba(224, 79, 0, 0.95) 100%), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div className="container py-4 position-relative z-1">
                    <h1 className="display-4 fw-extrabold mb-3">Papan Peringkat Membaca</h1>
                    <p className="lead fs-5 mb-0 mx-auto text-white-50" style={{ maxWidth: '600px' }}>
                        Lihat siapa saja pembaca paling berdedikasi minggu ini dan sepanjang masa. Nyalakan streak Anda dan raih puncak klasemen!
                    </p>
                </div>
            </div>

            <div className="container px-4 px-lg-5 pb-5 flex-grow-1">
                {/* Tab Navigation */}
                <div className="card border-0 shadow-sm rounded-4 p-3 mb-5 bg-white">
                    <div className="d-flex justify-content-center">
                        <div className="btn-group bg-light p-1 rounded-pill" role="group" style={{ maxWidth: '400px', width: '100%' }}>
                            <button
                                type="button"
                                className={`btn rounded-pill border-0 fw-bold px-4 py-2 ${activeTab === 'weekly' ? 'bg-primary text-white' : 'text-secondary bg-transparent'}`}
                                onClick={() => setActiveTab('weekly')}
                                style={{ transition: 'all 0.2s' }}
                            >
                                Peringkat Mingguan
                            </button>
                            <button
                                type="button"
                                className={`btn rounded-pill border-0 fw-bold px-4 py-2 ${activeTab === 'alltime' ? 'bg-primary text-white' : 'text-secondary bg-transparent'}`}
                                onClick={() => setActiveTab('alltime')}
                                style={{ transition: 'all 0.2s' }}
                            >
                                Sepanjang Masa
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top 3 Podium Area */}
                {podiumUsers.length > 0 ? (
                    <div className="row justify-content-center align-items-end g-3 mb-5 mt-2">
                        {reorderedPodium.map((user) => {
                            const isMainUser = auth.user && user.user_id === auth.user.id;
                            const rankColor = getPodiumBadgeColor(user.rank);
                            const isFirst = user.rank === 1;

                            return (
                                <div key={user.user_id} className={`col-4 col-md-3 text-center d-flex flex-column align-items-center ${isFirst ? 'order-1 order-md-2' : user.rank === 2 ? 'order-0 order-md-1' : 'order-2 order-md-3'}`}>
                                    {/* Avatar with Crown/Trophy */}
                                    <div className="position-relative mb-2">
                                        <div className="position-absolute start-50 translate-middle-x" style={{ top: '-30px', zIndex: 5 }}>
                                            {isFirst ? (
                                                <i className="fa-solid fa-crown text-warning fs-3 animate-bounce"></i>
                                            ) : (
                                                <i className="fa-solid fa-trophy fs-4" style={{ color: rankColor }}></i>
                                            )}
                                        </div>
                                        <img
                                            src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150'}
                                            alt={user.name}
                                            className="rounded-circle object-fit-cover shadow"
                                            style={{ 
                                                width: isFirst ? '100px' : '80px', 
                                                height: isFirst ? '100px' : '80px',
                                                border: `4px solid ${rankColor}`,
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        <span className="position-absolute bottom-0 start-50 translate-middle-x badge rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{
                                            width: '28px',
                                            height: '28px',
                                            backgroundColor: rankColor,
                                            color: isFirst ? '#000' : '#fff',
                                            fontSize: '0.85rem'
                                        }}>
                                            {user.rank}
                                        </span>
                                    </div>

                                    {/* User Details and Podium Stand */}
                                    <div className="w-100 d-flex flex-column align-items-center">
                                        <h6 className={`fw-bold text-truncate mb-0 px-2 ${isMainUser ? 'text-primary' : 'text-dark'}`} style={{ maxWidth: '100%', fontSize: '0.95rem' }}>
                                            {user.name}
                                        </h6>
                                        <span className="badge bg-light text-secondary rounded-pill py-0.5 px-2 mb-3" style={{ fontSize: '0.65rem' }}>
                                            {user.role === 'penulis' ? 'Penulis' : 'Pembaca'}
                                        </span>

                                        {/* The Podium block itself */}
                                        <div 
                                            className="w-100 rounded-top-4 d-flex flex-column align-items-center justify-content-center shadow-sm"
                                            style={{ 
                                                height: getPodiumHeight(user.rank),
                                                backgroundColor: isMainUser ? 'rgba(255, 90, 0, 0.08)' : '#ffffff',
                                                border: isMainUser ? '2px solid #FF5A00' : '1px solid rgba(0,0,0,0.05)',
                                                borderBottom: 'none'
                                            }}
                                        >
                                            <div className="small fw-semibold text-secondary" style={{ fontSize: '0.75rem' }}>DURASI BACA</div>
                                            <div className="fw-extrabold text-dark fs-5 mt-1">
                                                {activeTab === 'weekly' 
                                                    ? `${user.duration_minutes}m` 
                                                    : `${user.duration_hours}h`
                                                }
                                            </div>
                                            {user.streak > 0 && (
                                                <div className="text-danger small fw-bold mt-2" style={{ fontSize: '0.75rem' }}>
                                                    <i className="fa-solid fa-fire me-1"></i>{user.streak} Hari
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white mb-4">
                        <div className="py-4">
                            <i className="fa-solid fa-trophy text-muted display-3 mb-3 opacity-50"></i>
                            <h5 className="fw-bold">Belum Ada Catatan Membaca</h5>
                            <p className="text-secondary small mb-0">Jadilah pembaca pertama yang memulai streak membaca hari ini!</p>
                        </div>
                    </div>
                )}

                {/* List for rankings 4+ */}
                {listUsers.length > 0 && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-5">
                        <h6 className="fw-bold text-dark mb-4">Peringkat Lainnya</h6>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle border-0 mb-0">
                                <thead>
                                    <tr className="text-secondary small border-bottom">
                                        <th className="fw-bold border-0 pb-3" style={{ width: '80px' }}>RANK</th>
                                        <th className="fw-bold border-0 pb-3">PENGGUNA</th>
                                        <th className="fw-bold border-0 pb-3 text-center">ROLE</th>
                                        <th className="fw-bold border-0 pb-3 text-center">STREAK BACA</th>
                                        <th className="fw-bold border-0 pb-3 text-end">TOTAL DURASI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsers.map((user) => {
                                        const isMainUser = auth.user && user.user_id === auth.user.id;
                                        return (
                                            <tr key={user.user_id} className={isMainUser ? 'table-warning' : ''} style={{
                                                backgroundColor: isMainUser ? 'rgba(255, 90, 0, 0.05)' : undefined
                                            }}>
                                                {/* Rank badge */}
                                                <td className="border-0 py-3">
                                                    <span className="badge bg-light text-secondary rounded-pill py-1.5 px-2.5 fw-bold" style={{ fontSize: '0.8rem' }}>
                                                        #{user.rank}
                                                    </span>
                                                </td>

                                                {/* User profile */}
                                                <td className="border-0 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=80'}
                                                            alt={user.name}
                                                            className="rounded-circle object-fit-cover border"
                                                            style={{ width: '40px', height: '40px' }}
                                                        />
                                                        <span className={`fw-bold ${isMainUser ? 'text-primary' : 'text-dark'}`}>{user.name}</span>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="border-0 py-3 text-center">
                                                    <span className={`badge rounded-pill px-2.5 py-1 ${user.role === 'penulis' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'}`} style={{ fontSize: '0.7rem' }}>
                                                        {user.role === 'penulis' ? 'Penulis' : 'Pembaca'}
                                                    </span>
                                                </td>

                                                {/* Streak */}
                                                <td className="border-0 py-3 text-center">
                                                    {user.streak > 0 ? (
                                                        <span className="text-danger fw-bold small">
                                                            <i className="fa-solid fa-fire me-1"></i> {user.streak} Hari
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                {/* Total Duration */}
                                                <td className="border-0 py-3 text-end fw-bold text-dark">
                                                    {activeTab === 'weekly' 
                                                        ? `${user.duration_minutes} Menit` 
                                                        : `${user.duration_hours} Jam`
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sticky Bar: Personal Stats for Logged-In User OR CTA for Guests */}
            <div className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg p-3 z-3 d-flex justify-content-center align-items-center" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <div className="container-fluid px-4 px-lg-5 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3" style={{ maxWidth: '1200px' }}>
                    {auth.user ? (
                        <>
                            <div className="d-flex align-items-center gap-3">
                                <i className="fa-solid fa-medal text-warning fs-3"></i>
                                <div>
                                    <span className="small text-secondary fw-semibold">Status Peringkat Anda</span>
                                    <div className="text-dark fw-bold" style={{ fontSize: '0.95rem' }}>
                                        {myRank 
                                            ? `Anda berada di peringkat #${myRank} (${activeTab === 'weekly' ? 'Mingguan' : 'Sepanjang Masa'})` 
                                            : `Anda belum masuk peringkat (${activeTab === 'weekly' ? 'Mingguan' : 'Sepanjang Masa'})`
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            {currentUserStats.streak > 0 ? (
                                <div className="text-danger fw-bold" style={{ fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-fire me-1.5 fs-5"></i> Streak Aktif: {currentUserStats.streak} Hari
                                </div>
                            ) : (
                                <div className="text-secondary small fw-semibold">
                                    Mulai membaca bab sekarang untuk menyalakan streak!
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="d-flex align-items-center gap-3">
                                <i className="fa-solid fa-circle-question text-primary fs-3"></i>
                                <div>
                                    <span className="small text-secondary fw-semibold">Ingin masuk ke papan peringkat?</span>
                                    <div className="text-dark fw-bold" style={{ fontSize: '0.95rem' }}>
                                        Daftar atau masuk untuk mencatat durasi baca harian Anda!
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Link href="/login" className="btn btn-primary rounded-pill btn-sm px-4 fw-bold text-white" style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}>
                                    Masuk
                                </Link>
                                <Link href="/register" className="btn btn-light rounded-pill btn-sm border px-4 fw-semibold text-secondary">
                                    Daftar
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
