import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Notyf } from 'notyf';
import CKEditorBab from './CKEditorBab';
import 'notyf/notyf.min.css';
import Sidebar from '../components/dashboard/Sidebar';

interface BookItem {
    id: number;
    title: string;
    slug: string;
}

interface ChapterDetail {
    id: number;
    title: string;
    content: string;
    book: BookItem;
}

interface ChapterEditProps {
    chapter: ChapterDetail;
}

export default function ChapterEdit({ chapter }: ChapterEditProps) {
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

    const { data, setData, put, processing, errors } = useForm({
        title: chapter.title,
        content: chapter.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/chapters/${chapter.id}`);
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

            <Sidebar active="chapters" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
                                Halaman <span className="mx-1">/</span> <Link href="/dashboard" className="text-decoration-none text-secondary">Dashboard</Link> <span className="mx-1">/</span> <Link href={`/dashboard/books/${chapter.book.id}/chapters`} className="text-decoration-none text-secondary">Kelola Bab</Link> <span className="mx-1">/</span> <span className="text-dark">Edit Bab</span>
                            </div>
                            <h4 className="fw-bold text-dark mb-0">Edit Bab: {chapter.title}</h4>
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
                                <h5 className="fw-bold text-dark mb-1">Edit Bab</h5>
                                <p className="text-secondary small">Perbarui naskah atau judul bab cerita Anda menggunakan editor di bawah.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Buku Induk (Read Only) */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small">Buku Induk</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3 py-2.5 text-secondary border-light bg-body-secondary"
                                        disabled
                                        value={chapter.book.title}
                                    />
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

                                {/* Action Buttons */}
                                <div className="d-flex gap-3">
                                    <Link
                                        href={`/dashboard/books/${chapter.book.id}/chapters`}
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
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
