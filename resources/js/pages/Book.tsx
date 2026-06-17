import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

type Book = {
    title: string,
    description: string,
    cover: File | null,
};

const Book = ({ books }: { books: [] }) => {
    const { flash }: any = usePage().props;
    let notyf = new Notyf({
        position: { x: 'right', y: 'top' }
    });

    useEffect(() => {
        if (flash.success === true) {
            notyf.success(flash.message)
        } else if (flash.success === false) {
            notyf.error(flash.message)
        }
        flash.success = null
        setCoverPreview(null)
    }, [flash])

    // State untuk kontrol sidebar mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<Book>({
        title: '',
        description: '',
        cover: null
    });

    function handleSubmitBook(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/dashboard/books', {
            onSuccess: () => reset('title', 'description', 'cover')
        });
    }


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

                    {/* Menu Buku (Aktif) */}
                    <Link href="/dashboard/books" className="d-flex align-items-center p-2 rounded-3 text-dark text-decoration-none fw-bold mb-1">
                        <div className="text-white rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px', backgroundColor: '#f28b50' }}>
                            <i className="fa-solid fa-book"></i>
                        </div>
                        Buku
                    </Link>

                    {/* Menu Bab Baru */}
                    <Link href="/dashboard/chapters" className="d-flex align-items-center p-2 rounded-3 text-secondary text-decoration-none fw-semibold">
                        <div className="bg-light text-secondary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
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
                            <h4 className="fw-bold text-dark mb-0">Buat Buku Baru</h4>
                        </div>
                    </div>
                </div>

                {/* Form Terpusat */}
                <div className="row justify-content-center py-2 flex-grow-1 align-items-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">

                        {/* CARD CONTENT */}
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">

                            <div className="animate-fade-in">
                                <div className="text-center mb-4">
                                    <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', color: '#f28b50' }}>
                                        <i className="fa-solid fa-book-open fs-4" style={{ color: '#f28b50' }}></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">Buat Buku</h5>
                                    <p className="text-secondary small">Buat judul buku anda terlebih dahulu sebelum mengunggah bab setiap buku.</p>
                                </div>

                                <form encType="multipart/form-data" onSubmit={handleSubmitBook}>
                                    {/* Judul Buku */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark small">Judul Buku <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control rounded-3 py-2.5 text-secondary border-light bg-body-tertiary ${errors.title && 'is-invalid'}`}
                                            placeholder="Ketik judul buku buatan Anda..."
                                            required
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>

                                    {/* Sinopsis / Deskripsi */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark small">Sinopsis / Deskripsi <span className="text-danger">*</span></label>
                                        <textarea
                                            rows={4}
                                            className={`form-control rounded-3 py-2.5 text-secondary border-light bg-body-tertiary ${errors.description && 'is-invalid'}`}
                                            placeholder="Tulis sinopsis cerita atau deskripsi singkat isi buku..."
                                            required
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                        ></textarea>
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>

                                    {/* Cover Buku */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-dark small">Cover Buku (Gambar) <span className="text-danger">*</span></label>
                                        <div className={`${errors.cover && 'border-danger'} border border-dashed rounded-3 bg-body-tertiary d-flex flex-column align-items-center justify-content-center p-4 text-center cursor-pointer`} style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                                            {!coverPreview ?
                                                < i className="fa-regular fa-image fs-3 text-muted mb-2"></i>
                                                :
                                                <img
                                                    src={coverPreview || ''}
                                                    alt="Pratinjau Cover"
                                                    className="rounded-3 shadow-sm border border-light mb-2 d-block mx-auto animate-fade-in"
                                                    style={{ width: '90px', height: '126px', objectFit: 'cover' }}
                                                />
                                            }

                                            <label htmlFor="cover-upload" className="btn btn-white btn-sm border-light shadow-sm rounded-3 fw-semibold text-dark cursor-pointer px-3 mb-1">
                                                Pilih Cover Buku
                                            </label>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>PNG, JPG atau WEBP (Maks. 2MB)</span>

                                            <input
                                                id="cover-upload"
                                                type="file"
                                                accept="image/*"
                                                className="d-none"
                                                value={data.cover === null ? "" : undefined}
                                                onChange={e => {
                                                    const file = e.target.files?.[0] || null;
                                                    setData('cover', file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setCoverPreview(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setCoverPreview(null);
                                                    }
                                                }}
                                            />
                                        </div>
                                        {errors.cover && <div className="text-danger">{errors.cover}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                                        disabled={processing}
                                    >
                                        <i className="fa-solid fa-folder-plus"></i>
                                        Tambahkan Buku
                                    </button>
                                </form>
                            </div>

                        </div>

                    </div>
                </div >

            </main >
        </div >
    );
};

export default Book;
