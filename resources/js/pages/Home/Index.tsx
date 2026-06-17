import { Link } from '@inertiajs/react'
import Book from '../../components/home/Book'
import Navbar from '../../components/home/Navbar'

const Home = ({ books }: { books: { id: number; title: string; slug: string; cover: string | null; description: string }[] }) => {

    const categoryData = [
        { id: 1, title: "Girl's World", views: 331 },
        { id: 2, title: 'On the Way to Meet Mom', views: 100 },
        { id: 3, title: 'GOOD/BAD FORTUNE', views: 230 },
        { id: 4, title: 'Change Me', views: 500 },
        { id: 5, title: 'Reborn Rich', views: 789 },
        { id: 6, title: 'Asa Untuk Ayah', views: 123 },
    ];

    return (
        <div className="bg-white min-vh-100 font-sans">

            {/* 1. NAVBAR */}
            <Navbar />

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
                            {books.map((item) => (
                                <Link href={`/book/${item.slug}`}>
                                    <Book key={item.id} id={item.id} title={item.title} cover={item.cover} />
                                </Link>
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
                                <Book key={item.id} id={item.id} title={item.title} views={item.views} />
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