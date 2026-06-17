import { usePage, Link } from '@inertiajs/react';


export default function Navbar() {
    const { auth } = usePage().props;

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
            <div className="container-fluid px-4 px-lg-5">


                {/* Logo */}
                < a className="navbar-brand d-flex align-items-center me-5 fw-bold" href="#" >
                    BacaYukz
                </a >

                {/* Left Links */}
                < div className="navbar-collapse" >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                        <li className="nav-item"><a className="nav-link text-dark" href="#">Home</a></li>
                        <li className="nav-item"><a className="nav-link text-dark" href="#">Category</a></li>
                        <li className="nav-item"><a className="nav-link text-dark" href="#">Populer</a></li>
                    </ul>

                    {/* Right Links & Buttons */}
                    <div className="d-flex align-items-center gap-3">
                        {auth.user ?
                            <Link href="/dashboard" className="text-dark text-decoration-none fw-bold small mx-2">Dashboard</Link>
                            :
                            <Link href="/login" className="text-dark text-decoration-none fw-bold small mx-2">Login</Link>
                        }
                        <button className="btn btn-light rounded-circle shadow-sm px-2 py-1">
                            <i className="fa-solid fa-search"></i>
                        </button>
                    </div>
                </div >
            </div>
        </nav>
    )
}