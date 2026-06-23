import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import GenreCheckboxList from '../../components/dashboard/GenreCheckboxList';
import CoverUploadField from '../../components/dashboard/CoverUploadField';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { BookDetail, GenreItem } from '../../types/models';

interface BookEditProps {
    book: BookDetail;
    genres: GenreItem[];
}

/**
 * Dashboard page for editing an existing book's metadata.
 * Pre-populates all fields from the existing book and submits via
 * a POST request with `_method: 'put'` (Laravel method spoofing).
 */
const BookEdit = ({ book, genres = [] }: BookEditProps) => {
    useFlashNotification();

    const [coverPreview, setCoverPreview] = useState<string | null>(book.cover);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: book.title,
        description: book.description,
        cover: null as File | null,
        genres: book.genres ? book.genres.map((g) => g.id) : [] as number[],
    });

    /**
     * Toggles a genre ID in the selected genres array.
     * If the genre is already selected it will be removed; otherwise it is added.
     */
    const handleGenreChange = (genreId: number) => {
        setData(
            'genres',
            data.genres.includes(genreId)
                ? data.genres.filter((id) => id !== genreId)
                : [...data.genres, genreId]
        );
    };

    /** Submits the book update form using POST + method spoofing. */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/dashboard/books/${book.id}`);
    };

    return (
        <DashboardLayout active="books">
            <PageHeader
                title="Edit Buku"
                breadcrumbs={['Edit Karya']}
            />

            <div className="row justify-content-center py-2 flex-grow-1 align-items-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">

                        {/* Card header */}
                        <div className="text-center mb-4">
                            <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{ width: '60px', height: '60px' }}
                            >
                                <i className="fa-solid fa-pen-to-square fs-4" style={{ color: '#FF5A00' }} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Edit Info Buku</h5>
                            <p className="text-secondary small">
                                Perbarui detail karya orisinal Anda menggunakan formulir di bawah.
                            </p>
                        </div>

                        <form encType="multipart/form-data" onSubmit={handleSubmit}>
                            {/* Judul Buku */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small">
                                    Judul Buku <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control rounded-3 text-secondary border-light bg-body-tertiary ${errors.title && 'is-invalid'}`}
                                    placeholder="Ketik judul buku buatan Anda..."
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            {/* Sinopsis */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small">
                                    Sinopsis / Deskripsi <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    className={`form-control rounded-3 text-secondary border-light bg-body-tertiary ${errors.description && 'is-invalid'}`}
                                    placeholder="Tulis sinopsis cerita atau deskripsi singkat isi buku..."
                                    required
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>

                            {/* Genre */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small d-block">
                                    Genre Buku <span className="text-danger">*</span>
                                </label>
                                <GenreCheckboxList
                                    genres={genres}
                                    selectedIds={data.genres}
                                    onToggle={handleGenreChange}
                                    error={errors.genres as string | undefined}
                                />
                            </div>

                            {/* Cover */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-dark small">
                                    Cover Buku (Gambar)
                                </label>
                                <CoverUploadField
                                    previewUrl={coverPreview}
                                    buttonLabel="Ganti Cover Buku"
                                    onFileChange={(file) => {
                                        setData('cover', file);
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setCoverPreview(reader.result as string);
                                            reader.readAsDataURL(file);
                                        } else {
                                            setCoverPreview(book.cover);
                                        }
                                    }}
                                    error={errors.cover as string | undefined}
                                />
                                <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>
                                    Biarkan kosong jika tidak ingin mengubah cover.
                                </small>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3">
                                <Link
                                    href="/dashboard"
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
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookEdit;
