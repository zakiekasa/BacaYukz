import React, { useState } from 'react';

const Dashboard = () => {
    // State untuk mengontrol buka-tutup sidebar di perangkat mobile/tablet
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            {/* Logika Class:
        Jika isSidebarOpen = true (di klik): position-fixed, z-3 agar melayang di atas konten.
        Jika default (di Desktop): d-none d-lg-flex agar menyatu dengan layout kiri.
      */}
            <aside
                className={`bg-white rounded-4 shadow-sm p-4 flex-column z-3 transition-all ${isSidebarOpen
                        ? 'd-flex position-fixed top-0 start-0 bottom-0 m-3 shadow-lg'
                        : 'd-none d-lg-flex m-3'
                    }`}
                style={{ width: '260px' }}
            >

                {/* Header Sidebar */}
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-layer-group fs-3 me-3 text-dark"></i>
                        <span className="fw-bold fs-5 text-dark">BacaYukz</span>
                    </div>

                    {/* Tombol "X" Close - Hanya terlihat di Mobile/Tablet */}
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
                    {/* Menu Dashboard (Aktif) */}
                    <a href="#" className="d-flex align-items-center p-2 rounded-3 text-dark text-decoration-none fw-bold mb-1">
                        <div className="text-white rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px', backgroundColor: '#f28b50' }}>
                            <i className="fa-solid fa-house"></i>
                        </div>
                        Dashboard
                    </a>

                    {/* Menu Buku (Tidak Aktif) */}
                    <a href="#" className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold">
                        <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-building"></i>
                        </div>
                        Buku
                    </a>
                </nav>
            </aside>

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

                    {/* Kolom Pencarian */}
                    <div className="w-100" style={{ maxWidth: '300px' }}>
                        <input
                            type="text"
                            className="form-control rounded-3 border-light shadow-sm px-3 w-100"
                            placeholder="Ketik Judul..."
                        />
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="row g-3 g-lg-4 mb-4">
                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-primary">
                            <i className="fa-solid fa-glasses fs-4 mb-3"></i>
                            <h2 className="fw-bold mb-1">350</h2>
                            <div style={{ fontSize: '0.9rem' }}>Total Pembaca</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center bg-success">
                            <i className="fa-solid fa-book-open fs-3 mb-3"></i>
                            <h2 className="fw-bold mb-1">1</h2>
                            <div style={{ fontSize: '0.9rem' }}>Total Buku</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="rounded-4 p-4 text-white shadow-sm h-100 d-flex flex-column justify-content-center" style={{ backgroundColor: '#2d2d2d' }}>
                            <i className="fa-solid fa-wallet fs-3 mb-3"></i>
                            <h2 className="fw-bold mb-1">Rp. 2.000.000</h2>
                            <div style={{ fontSize: '0.9rem' }}>Pendapatan</div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-4 shadow-sm p-3 p-lg-4 mb-4">
                    <h5 className="fw-bold text-dark mb-4">Projects</h5>

                    <div className="table-responsive">
                        <table className="table align-middle border-light text-nowrap" style={{ minWidth: '600px' }}>
                            <thead>
                                <tr className="border-bottom">
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '5%', borderBottomWidth: '2px' }}>NO</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '15%', borderBottomWidth: '2px' }}>COVER</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '60%', borderBottomWidth: '2px' }}>JUDUL</th>
                                    <th className="text-secondary fw-semibold small pb-3" style={{ width: '20%', borderBottomWidth: '2px' }}>AKSI</th>
                                </tr>
                            </thead>

                            <tbody className="border-0">
                                <tr>
                                    <td className="text-secondary py-3">1</td>
                                    <td className="py-3">
                                        <img
                                            src="https://placehold.co/100x140/1e3a8a/FFFFFF?text=Belajar\nWeb&font=Montserrat"
                                            alt="Cover"
                                            className="rounded-2 shadow-sm"
                                            style={{ width: '55px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td className="text-secondary fw-medium py-3 text-wrap">
                                        Belajar Pemrograman Web untuk pemula
                                    </td>
                                    <td className="py-3">
                                        <button className="btn btn-success btn-sm me-2 rounded-3 px-2 py-1 shadow-sm" style={{ backgroundColor: '#4ade80', borderColor: '#4ade80' }}>
                                            <i className="fa-solid fa-pen text-white"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm rounded-3 px-2 py-1 shadow-sm" style={{ backgroundColor: '#f87171', borderColor: '#f87171' }}>
                                            <i className="fa-solid fa-trash text-white"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
