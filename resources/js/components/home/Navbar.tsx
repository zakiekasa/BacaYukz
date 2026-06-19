import { usePage, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', nextTheme);
            document.documentElement.setAttribute('data-bs-theme', nextTheme);
        }
    };

    const notifications = auth?.user?.notifications ?? [];
    const unreadCount = notifications.filter((notif: any) => !notif.is_read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (id: number) => {
        setIsNotificationOpen(false);
        router.post(`/notifications/${id}/read`);
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post('/notifications/read-all');
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Baru saja';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit yang lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam yang lalu`;
        const days = Math.floor(hours / 24);
        return `${days} hari yang lalu`;
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim() !== '') {
            router.get(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
            <style>{`
                .navbar-collapse.collapse {
                    visibility: visible !important;
                }
                .notification-item {
                    background-color: #ffffff;
                }
                .notification-item:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
            <div className="container-fluid px-4 px-lg-5">

                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center fw-bold text-dark text-decoration-none" href="/">
                    BacaYukz
                </Link>

                {/* Responsive Hamburger Toggle Button */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Content */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3 pt-3 pt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-dark" href="/">Home</Link>
                        </li>
                        <li className="nav-item"><a className="nav-link text-dark" href="/#kategori">Category</a></li>
                    </ul>

                    {/* Right Links & Buttons */}
                    <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0 pt-2 pt-lg-0 border-top border-light border-lg-0">
                        {auth.user ? (
                            <div className="d-flex align-items-center gap-3 w-100 justify-content-between justify-content-lg-start">
                                <Link href="/dashboard" className="text-dark text-decoration-none fw-bold small my-1 my-lg-0">Dashboard</Link>

                                {/* Notification Icon & Dropdown */}
                                <div className="position-relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center position-relative border"
                                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                        style={{ width: '38px', height: '38px', backgroundColor: '#f8f9fa' }}
                                    >
                                        <i className="fa-regular fa-bell text-secondary fs-5"></i>
                                        {unreadCount > 0 && (
                                            <span
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-white"
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    fontSize: '0.65rem',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transform: 'translate(-30%, -10%)'
                                                }}
                                            >
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {isNotificationOpen && (
                                        <div
                                            className="position-absolute bg-white border border-light-subtle rounded-3 shadow-lg p-2 mt-2 animate-fade-in"
                                            style={{
                                                width: '320px',
                                                right: 0,
                                                zIndex: 1050
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center px-2 py-2 border-bottom border-light mb-1">
                                                <span className="fw-bold text-dark small">Notifikasi Baru</span>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className="btn btn-link text-primary p-0 text-decoration-none small fw-semibold"
                                                        style={{ fontSize: '0.75rem', color: '#f28b50' }}
                                                    >
                                                        Tandai semua dibaca
                                                    </button>
                                                )}
                                            </div>
                                            <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
                                                {notifications.length === 0 ? (
                                                    <div className="text-center text-muted py-4 small">
                                                        <i className="fa-regular fa-bell-slash fs-4 d-block mb-2 text-secondary opacity-50"></i>
                                                        Tidak ada notifikasi
                                                    </div>
                                                ) : (
                                                    notifications.map((notif: any) => (
                                                        <div
                                                            key={notif.id}
                                                            className="p-2 rounded-2 border-bottom border-light cursor-pointer small d-flex flex-column gap-1 transition-all notification-item"
                                                            onClick={() => handleNotificationClick(notif.id)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.15s ease',
                                                                backgroundColor: !notif.is_read ? 'rgba(242, 139, 80, 0.08)' : undefined
                                                            }}
                                                        >
                                                            <div className={`text-dark ${!notif.is_read ? 'fw-bold' : ''}`} style={{ lineHeight: '1.4', fontSize: '0.85rem' }}>
                                                                {notif.message}
                                                            </div>
                                                            <div className="text-secondary small d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                                <i className="fa-regular fa-clock text-muted"></i>
                                                                <span>{formatTimeAgo(notif.created_at)}</span>
                                                                {!notif.is_read && (
                                                                    <span className="badge rounded-pill bg-danger ms-auto" style={{ fontSize: '0.6rem' }}>Baru</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="text-dark text-decoration-none fw-bold small my-1 my-lg-0">Login</Link>
                        )}

                        <form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-2">
                            {/* Theme Toggle Button */}
                            <button
                                type="button"
                                className="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border"
                                onClick={toggleTheme}
                                style={{ width: '38px', height: '38px', backgroundColor: '#f8f9fa' }}
                                title={theme === 'light' ? 'Ganti ke Mode Gelap' : 'Ganti ke Mode Terang'}
                            >
                                <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-secondary' : 'fa-sun text-warning'} fs-5`}></i>
                            </button>

                            {isSearchOpen && (
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill border-light shadow-sm px-3 animate-fade-in"
                                    placeholder="Cari judul / deskripsi..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ width: '170px' }}
                                    autoFocus
                                />
                            )}
                            <button
                                type="button"
                                className="btn btn-light rounded-circle shadow-sm px-2 py-1"
                                onClick={() => {
                                    if (isSearchOpen && searchQuery.trim() !== '') {
                                        handleSearchSubmit();
                                    } else {
                                        setIsSearchOpen(!isSearchOpen);
                                    }
                                }}
                            >
                                <i className="fa-solid fa-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
}