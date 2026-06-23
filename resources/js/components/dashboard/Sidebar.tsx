import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface SidebarProps {
    active: 'dashboard' | 'books' | 'chapters' | 'likes' | 'profile' | 'streak' | 'leaderboard' | 'history' | 'none';
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ active, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    const { auth }: any = usePage().props;
    const isReader = auth?.user?.role === 'pembaca';

    return (
        <aside
            className={`bg-white rounded-4 shadow-sm p-4 flex-column z-3 transition-all ${isSidebarOpen
                ? 'd-flex position-fixed top-0 start-0 bottom-0 m-3 shadow-lg'
                : 'd-none d-lg-flex m-3'
                }`}
            style={{ 
                width: '260px', 
                height: 'calc(100vh - 2rem)', 
                position: isSidebarOpen ? 'fixed' : 'sticky', 
                top: '1rem' 
            }}
        >
            {/* Header Sidebar */}
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div className="d-flex align-items-center">
                    <i className="fa-solid fa-layer-group fs-3 me-3 text-dark"></i>
                    <span className="fw-bold fs-5 text-dark">BacaYukz</span>
                </div>

                {/* Tombol "X" Close - Mobile Only */}
                <button
                    className="btn btn-light btn-sm d-lg-none rounded-circle d-flex align-items-center justify-content-center"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ width: '32px', height: '32px' }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Menu Items */}
            <nav className="d-flex flex-column gap-2">
                {/* Menu Dashboard */}
                {!isReader && (
                    <Link 
                        href="/dashboard" 
                        className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'dashboard' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                    >
                        <div 
                            className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'dashboard' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                            style={{ width: '40px', height: '40px', backgroundColor: active === 'dashboard' ? '#FF5A00' : undefined }}
                        >
                            <i className="fa-solid fa-house"></i>
                        </div>
                        Dashboard
                    </Link>
                )}

                {/* Menu Buku */}
                {!isReader && (
                    <Link 
                        href="/dashboard/books" 
                        className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'books' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                    >
                        <div 
                            className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'books' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                            style={{ width: '40px', height: '40px', backgroundColor: active === 'books' ? '#FF5A00' : undefined }}
                        >
                            <i className="fa-solid fa-book"></i>
                        </div>
                        Buku
                    </Link>
                )}

                {/* Menu Bab */}
                {!isReader && (
                    <Link 
                        href="/dashboard/chapters" 
                        className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'chapters' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                    >
                        <div 
                            className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'chapters' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                            style={{ width: '40px', height: '40px', backgroundColor: active === 'chapters' ? '#FF5A00' : undefined }}
                        >
                            <i className="fa-solid fa-file-lines"></i>
                        </div>
                        Bab
                    </Link>
                )}

                {/* Menu Suka */}
                <Link 
                    href="/dashboard/likes" 
                    className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'likes' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                >
                    <div 
                        className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'likes' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                        style={{ width: '40px', height: '40px', backgroundColor: active === 'likes' ? '#FF5A00' : undefined }}
                    >
                        <i className="fa-solid fa-heart"></i>
                    </div>
                    Suka
                </Link>

                {/* Menu Riwayat */}
                <Link 
                    href="/dashboard/history" 
                    className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'history' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                >
                    <div 
                        className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'history' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                        style={{ width: '40px', height: '40px', backgroundColor: active === 'history' ? '#FF5A00' : undefined }}
                    >
                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    Riwayat
                </Link>

                {/* Menu Streak */}
                <Link 
                    href="/dashboard/streak" 
                    className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'streak' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                >
                    <div 
                        className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'streak' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                        style={{ width: '40px', height: '40px', backgroundColor: active === 'streak' ? '#FF5A00' : undefined }}
                    >
                        <i className="fa-solid fa-fire"></i>
                    </div>
                    Streak
                </Link>

                {/* Menu Leaderboard */}
                <Link 
                    href="/leaderboard" 
                    className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'leaderboard' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                >
                    <div 
                        className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'leaderboard' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                        style={{ width: '40px', height: '40px', backgroundColor: active === 'leaderboard' ? '#FF5A00' : undefined }}
                    >
                        <i className="fa-solid fa-trophy"></i>
                    </div>
                    Leaderboard
                </Link>

                {/* Menu Profil */}
                <Link 
                    href="/dashboard/profile" 
                    className={`d-flex align-items-center p-2 rounded-3 text-decoration-none ${active === 'profile' ? 'text-dark fw-bold mb-1' : 'text-secondary fw-semibold'}`}
                >
                    <div 
                        className={`rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm ${active === 'profile' ? 'text-white' : 'bg-light text-secondary border border-light'}`}
                        style={{ width: '40px', height: '40px', backgroundColor: active === 'profile' ? '#FF5A00' : undefined }}
                    >
                        <i className="fa-solid fa-user-gear"></i>
                    </div>
                    Profil
                </Link>

                {/* Menu Home (under Bab button) */}
                <Link 
                    href="/" 
                    className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold"
                >
                    <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                        <i className="fa-solid fa-globe"></i>
                    </div>
                    Home
                </Link>

                {/* Menu Logout */}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold text-start border-0 bg-transparent w-100"
                >
                    <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    Logout
                </Link>
            </nav>
        </aside>
    );
}
