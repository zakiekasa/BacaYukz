const Home = () => {
    // Data statis untuk meniru konten pada gambar    
    const trendingData = [
        { id: 1, title: 'FOG LAND', genre: 'Fantasi', rank: 1, change: '+ 3', isNew: false },
        { id: 2, title: 'Meet My Ex Again As His ...', genre: 'Romantis', rank: 2, change: '+ 33', isNew: true },
        { id: 3, title: 'Designated Bully', genre: 'Aksi', rank: 3, change: '- 1', isNew: false },
        { id: 4, title: 'The Tiger Next Door', genre: 'Romantis', rank: 4, change: '+ 4', isNew: false },
        { id: 5, title: 'How to Win My Husband ...', genre: 'Kerajaan', rank: 5, change: '', isNew: false },
    ];

    const categoryData = [
        { id: 1, title: "Girl's World", views: '331JTx Dibaca' },
        { id: 2, title: 'On the Way to Meet Mom', views: '9JTx Dibaca' },
        { id: 3, title: 'GOOD/BAD FORTUNE', views: '171JTx Dibaca' },
        { id: 4, title: 'Change Me', views: '27JTx Dibaca' },
        { id: 5, title: 'Reborn Rich', views: '23JTx Dibaca' },
        { id: 6, title: 'Asa Untuk Ayah', views: '1JTx Dibaca' },
    ];

    return (
        <div className="bg-white min-vh-100 font-sans">

            {/* 1. NAVBAR */}
            <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
                <div className="container-fluid px-4 px-lg-5">
                    {/* Logo */}
                    <a className="navbar-brand d-flex align-items-center me-5 fw-bold" href="#">
                        BacaYukz
                    </a>

                    {/* Left Links */}
                    <div className="navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                            <li className="nav-item"><a className="nav-link text-dark" href="#">Home</a></li>
                            <li className="nav-item"><a className="nav-link text-dark" href="#">Category</a></li>
                            <li className="nav-item"><a className="nav-link text-dark" href="#">Populer</a></li>
                        </ul>

                        {/* Right Links & Buttons */}
                        <div className="d-flex align-items-center gap-3">
                            <a href="/login" className="text-dark text-decoration-none fw-bold small mx-2">Login</a>
                            <button className="btn btn-light rounded-circle shadow-sm px-2 py-1">
                                <i className="fa-solid fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 2. MAIN CONTAINER */}
            <div className="container px-4 px-lg-5 py-5">

                {/* SECTION 1: Serial Trending & Populer */}
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bolder text-dark mb-0">Buku Terbaru</h3>
                        <a href="#" className="text-secondary text-decoration-none small">Lihat semua <i className="fa-solid fa-chevron-right ms-1"></i></a>
                    </div>

                    {/* Cards Grid + Carousel Wrapper */}
                    <div className="position-relative">
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 flex-nowrap overflow-hidden">
                            {trendingData.map((item) => (
                                <div className="col" key={item.id}>
                                    <div className="position-relative rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '3/4' }}>
                                        {/* Placeholder Image */}
                                        <img src={`https://picsum.photos/300/400?random=${item.id + 10}`} alt={item.title} className="w-100 h-100 object-fit-cover" />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-truncate text-dark">{item.title}</h6>
                                    <small className="text-secondary">{item.genre}</small>
                                </div>
                            ))}
                        </div>
                        {/* Right Arrow */}
                        <button className="btn btn-white bg-white shadow rounded-circle position-absolute top-50 start-100 translate-middle p-2 d-flex align-items-center justify-content-center">
                            <i className="fa-solid fa-chevron-right text-secondary"></i>
                        </button>
                    </div>
                </section>

                {/* SECTION 2: Serial populer berdasarkan kategori */}
                <section className="mb-5 mt-5 pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bolder text-dark mb-0">Buku Berdasarkan Kategori</h3>
                        <a href="#" className="text-secondary text-decoration-none small">Lihat semua <i className="fa-solid fa-chevron-right ms-1"></i></a>
                    </div>

                    {/* Filter Pills */}
                    <div className="d-flex gap-2 mb-4 overflow-x-auto" style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-dark rounded-pill px-4 fw-medium">Drama</button>
                        <button className="btn btn-light border bg-white rounded-pill px-3 fw-medium text-dark">Psikologi</button>
                        <button className="btn btn-light border bg-white rounded-pill px-3 fw-medium text-dark">Romantis</button>
                        <button className="btn btn-light border bg-white rounded-pill px-3 fw-medium text-dark">Komedi</button>
                        <button className="btn btn-light border bg-white rounded-pill px-3 fw-medium text-dark">Coding</button>
                        <button className="btn btn-light border bg-white rounded-pill px-3 fw-medium text-dark">Novel</button>
                    </div>

                    {/* Cards Grid */}
                    <div className="position-relative">
                        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3 flex-nowrap overflow-hidden">
                            {categoryData.map((item) => (
                                <div className="col" key={`cat-${item.id}`}>
                                    <div className="rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '3/4' }}>
                                        <img src={`https://picsum.photos/300/400?random=${item.id + 20}`} alt={item.title} className="w-100 h-100 object-fit-cover" />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-truncate text-dark" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                    <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.views}</small>
                                </div>
                            ))}
                        </div>
                        {/* Right Arrow */}
                        <button className="btn btn-white bg-white shadow rounded-circle position-absolute top-50 start-100 translate-middle p-2 d-flex align-items-center justify-content-center">
                            <i className="fa-solid fa-chevron-right text-secondary"></i>
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Home;