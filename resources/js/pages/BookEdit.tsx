import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Sidebar from '../components/dashboard/Sidebar';

type BookDetail = {
    id: number;
    title: string;
    description: string;
    cover: string | null;
    genres: { id: number; name: string; slug: string }[];
};

interface BookEditProps {
    book: BookDetail;
    genres: { id: number; name: string; slug: string }[];
}

const BookEdit = ({ book, genres = [] }: BookEditProps) => {
    const { flash }: any = usePage().props;
    const notyf = new Notyf({
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(book.cover);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: book.title,
        description: book.description,
        cover: null as File | null,
        genres: book.genres ? book.genres.map(g => g.id) : [] as number[],
    });

    const handleGenreChange = (genreId: number) => {
        if (data.genres.includes(genreId)) {
            setData('genres', data.genres.filter(id => id !== genreId));
        } else {
            setData('genres', [...data.genres, genreId]);
        }
    };

    function handleSubmitBook(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(`/dashboard/books/${book.id}`);
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

            <Sidebar active="books" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
                                Halaman <span className="mx-1">/</span> <span className="text-dark">Edit Karya</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Edit Buku</h4>
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
                                        <i className="fa-solid fa-pen-to-square fs-4" style={{ color: '#f28b50' }}></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">Edit Info Buku</h5>
                                    <p className="text-secondary small">Perbarui detail karya orisinal Anda menggunakan formulir di bawah.</p>
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

                                    {/* Genre Buku */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark small d-block">
                                            Genre Buku <span className="text-danger">*</span>
                                        </label>
                                        <div className="row g-2">
                                            {genres.map((genre) => (
                                                <div className="col-6 col-sm-4" key={genre.id}>
                                                    <div className="form-check p-2 border border-light-subtle rounded bg-light hover-bg-light transition-all d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input ms-0 mt-0 cursor-pointer"
                                                            type="checkbox"
                                                            id={`genre-${genre.id}`}
                                                            value={genre.id}
                                                            checked={data.genres.includes(genre.id)}
                                                            onChange={() => handleGenreChange(genre.id)}
                                                        />
                                                        <label
                                                            className="form-check-label text-secondary small cursor-pointer flex-grow-1 select-none"
                                                            htmlFor={`genre-${genre.id}`}
                                                        >
                                                            {genre.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.genres && <div className="text-danger small mt-1">{errors.genres}</div>}
                                    </div>

                                    {/* Cover Buku */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-dark small">Cover Buku (Gambar)</label>
                                        <div className={`${errors.cover && 'border-danger'} border border-dashed rounded-3 bg-body-tertiary d-flex flex-column align-items-center justify-content-center p-4 text-center cursor-pointer`} style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                                            {!coverPreview ? (
                                                <i className="fa-regular fa-image fs-3 text-muted mb-2"></i>
                                            ) : (
                                                <img
                                                    src={coverPreview}
                                                    alt="Pratinjau Cover"
                                                    className="rounded-3 shadow-sm border border-light mb-2 d-block mx-auto animate-fade-in"
                                                    style={{ width: '90px', height: '126px', objectFit: 'cover' }}
                                                />
                                            )}

                                            <label htmlFor="cover-upload" className="btn btn-white btn-sm border-light shadow-sm rounded-3 fw-semibold text-dark cursor-pointer px-3 mb-1">
                                                Ganti Cover Buku
                                            </label>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>PNG, JPG atau WEBP (Maks. 2MB). Biarkan kosong jika tidak ingin mengubah.</span>

                                            <input
                                                id="cover-upload"
                                                type="file"
                                                accept="image/*"
                                                className="d-none"
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
                                                        setCoverPreview(book.cover);
                                                    }
                                                }}
                                            />
                                        </div>
                                        {errors.cover && <div className="text-danger small mt-1">{errors.cover}</div>}
                                    </div>

                                    {/* Submit and Cancel Buttons */}
                                    <div className="d-flex gap-3">
                                        <Link
                                            href="/dashboard"
                                            className="btn btn-light w-50 py-2.5 rounded-3 fw-semibold border border-light text-dark text-center"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-50 py-2.5 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                            style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                                            disabled={processing}
                                        >
                                            <i className="fa-solid fa-save"></i>
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookEdit;
