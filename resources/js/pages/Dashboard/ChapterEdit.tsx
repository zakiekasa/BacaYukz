import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import CKEditorBab from '../../components/dashboard/CKEditorBab';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { ChapterDetail } from '../../types/models';

interface ChapterEditProps {
    chapter: ChapterDetail;
}

/**
 * Dashboard page for editing an existing chapter.
 *
 * Displays the parent book as a read-only reference, and lets the writer
 * edit the chapter title, content, and draft/published status.
 */
export default function ChapterEdit({ chapter }: ChapterEditProps) {
    useFlashNotification();

    const { data, setData, put, processing, errors } = useForm({
        title: chapter.title,
        content: chapter.content,
        is_draft: chapter.is_draft,
    });

    /** Submits the chapter update request via Inertia PUT. */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/chapters/${chapter.id}`);
    };

    return (
        <DashboardLayout active="chapters">
            <PageHeader
                title={`Edit Bab: ${chapter.title}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Kelola Bab', href: `/dashboard/books/${chapter.book.id}/chapters` },
                    'Edit Bab',
                ]}
            />

            <div className="row justify-content-center py-2 flex-grow-1 align-items-center">
                <div className="col-12 col-md-11 col-lg-10 col-xl-9">
                    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">

                        {/* Card header */}
                        <div className="text-center mb-4">
                            <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{ width: '60px', height: '60px' }}
                            >
                                <i className="fa-solid fa-file-pen fs-4" style={{ color: '#FF5A00' }} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Edit Bab</h5>
                            <p className="text-secondary small">
                                Perbarui naskah atau judul bab cerita Anda menggunakan editor di bawah.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Buku Induk (read-only) */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small">Buku Induk</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3 text-secondary border-light bg-body-secondary"
                                    disabled
                                    value={chapter.book.title}
                                    />
                            </div>

                            {/* Judul Bab */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small">
                                    Judul Bab <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control rounded-3 text-secondary border-light bg-body-tertiary ${errors.title && 'is-invalid'}`}
                                    placeholder="Contoh: Bab 1: Pertemuan Tak Terduga"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            {/* Isi Cerita */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-dark small">
                                    Isi Cerita Bab <span className="text-danger">*</span>
                                </label>
                                <div className={errors.content ? 'border border-danger rounded-3' : ''}>
                                    <CKEditorBab
                                        value={data.content}
                                        onChange={(html) => setData('content', html)}
                                        placeholder="Tumpahkan imajinasimu di sini..."
                                    />
                                </div>
                                {errors.content && <div className="text-danger small mt-1">{errors.content}</div>}
                            </div>

                            {/* Status Bab */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-dark small">
                                    Status Bab <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select rounded-3 text-secondary border-light bg-body-tertiary"
                                    value={data.is_draft ? 'true' : 'false'}
                                    onChange={(e) => setData('is_draft', e.target.value === 'true')}
                                >
                                    <option value="false">Diterbitkan (Terbit &amp; Kirim Notifikasi)</option>
                                    <option value="true">Draft (Simpan Sementara)</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <Link
                                    href={`/dashboard/books/${chapter.book.id}/chapters`}
                                    className="btn btn-light w-50 py-2 rounded-3 fw-semibold border border-light text-dark text-center"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-50 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                    style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                    disabled={processing}
                                >
                                    <i className="fa-solid fa-save" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
