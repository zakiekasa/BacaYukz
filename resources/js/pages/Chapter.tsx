import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Notyf } from 'notyf';
import CKEditorBab from './CKEditorBab';
import 'notyf/notyf.min.css';

interface BookItem {
    id: number;
    title: string;
    slug: string;
}

interface ChapterProps {
    books: BookItem[];
}

interface ChapterForm {
    book_id: string;
    title: string;
    content: string;
}

export default function Chapter({ books = [] }: ChapterProps) {
    const { flash }: any = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    let notyf = new Notyf({
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

    const { data, setData, post, processing, errors, reset } = useForm<ChapterForm>({
        book_id: '',
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/chapters', {
            onSuccess: () => reset('title', 'content')
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

            {/* --- SIDEBAR --- */}
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
                    <Link href="/dashboard" className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold">
                        <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-house"></i>
                        </div>
                        Dashboard
                    </Link>

                    {/* Menu Buku */}
                    <Link href="/dashboard/books" className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold">
                        <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-book"></i>
                        </div>
                        Buku
                    </Link>

                    {/* Menu Bab Baru (Aktif) */}
                    <Link href="/dashboard/chapters" className="d-flex align-items-center p-2 rounded-3 text-dark text-decoration-none fw-bold mb-1">
                        <div className="text-white rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px', backgroundColor: '#f28b50' }}>
                            <i className="fa-solid fa-file-lines"></i>
                        </div>
                        Bab Baru
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
                                Halaman <span className="mx-1">/</span> <span className="text-dark">Upload Karya</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Tambah Bab Baru</h4>
                        </div>
                    </div>
                </div>

                {/* Form Terpusat */}
                <div className="row justify-content-center py-2 flex-grow-1 align-items-center">
                    <div className="col-12 col-md-11 col-lg-10 col-xl-9">
                        {/* CARD CONTENT */}
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', color: '#f28b50' }}>
                                    <i className="fa-solid fa-file-pen fs-4" style={{ color: '#f28b50' }}></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">Tambah Bab Baru</h5>
                                <p className="text-secondary small">Tulis naskah bab baru cerita Anda langsung di editor modern di bawah ini.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Pilih Buku Induk */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small">Pilih Buku Induk <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select rounded-3 py-2.5 text-secondary border-light bg-body-tertiary ${errors.book_id && 'is-invalid'}`}
                                        required
                                        value={data.book_id}
                                        onChange={e => setData('book_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Buku Anda --</option>
                                        {books.map((e: BookItem) => (
                                            <option key={e.id} value={e.id}>{e.title}</option>
                                        ))}
                                    </select>
                                    {errors.book_id && <div className="invalid-feedback">{errors.book_id}</div>}
                                </div>

                                {/* Judul Bab */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small">Judul Bab <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control rounded-3 py-2.5 text-secondary border-light bg-body-tertiary ${errors.title && 'is-invalid'}`}
                                        placeholder="Contoh: Bab 1: Pertemuan Tak Terduga"
                                        required
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                {/* Isi Cerita Bab */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-dark small">Isi Cerita Bab <span className="text-danger">*</span></label>
                                    <div className={errors.content ? 'border border-danger rounded-3' : ''}>
                                        <CKEditorBab
                                            value={data.content}
                                            onChange={(html: string) => setData('content', html)}
                                            placeholder="Tumpahkan imajinasimu di sini..."
                                        />
                                    </div>
                                    {errors.content && <div className="text-danger small mt-1">{errors.content}</div>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                    style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                                    disabled={processing}
                                >
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    {processing ? 'Sedang Menerbitkan...' : 'Terbitkan Bab Sekarang'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
