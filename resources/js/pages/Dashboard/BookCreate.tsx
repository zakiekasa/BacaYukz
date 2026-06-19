import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import GenreCheckboxList from '../../components/dashboard/GenreCheckboxList';
import CoverUploadField from '../../components/dashboard/CoverUploadField';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { GenreItem } from '../../types/models';

interface BookPageProps {
    books: any[];
    genres: GenreItem[];
}

type BookForm = {
    title: string;
    description: string;
    cover: File | null;
    genres: number[];
};

/**
 * Dashboard page for creating a new book.
 * Handles the book creation form including title, synopsis, genre selection,
 * and cover image upload with live preview.
 */
const BookCreate = ({ genres = [] }: BookPageProps) => {
    useFlashNotification();

    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<BookForm>({
        title: '',
        description: '',
        cover: null,
        genres: [],
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

    /** Submits the book creation form and resets the form state on success. */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/dashboard/books', {
            onSuccess: () => {
                reset('title', 'description', 'cover', 'genres');
                setCoverPreview(null);
            },
        });
    };

    return (
        <DashboardLayout active="books">
            <PageHeader
                title="Buat Buku Baru"
                breadcrumbs={['Upload Karya']}
            />

            <div className="row justify-content-center py-2 flex-grow-1 align-items-center">
                <div className="col-12 col-md-10 col-lg-10">
                    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">

                        {/* Card header */}
                        <div className="text-center mb-4">
                            <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{ width: '60px', height: '60px' }}
                            >
                                <i className="fa-solid fa-book-open fs-4" style={{ color: '#f28b50' }} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Buat Buku</h5>
                            <p className="text-secondary small">
                                Buat judul buku anda terlebih dahulu sebelum mengunggah bab setiap buku.
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
                                    Cover Buku (Gambar) <span className="text-danger">*</span>
                                </label>
                                <CoverUploadField
                                    previewUrl={coverPreview}
                                    onFileChange={(file) => {
                                        setData('cover', file);
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setCoverPreview(reader.result as string);
                                            reader.readAsDataURL(file);
                                        } else {
                                            setCoverPreview(null);
                                        }
                                    }}
                                    error={errors.cover as string | undefined}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                                disabled={processing}
                            >
                                <i className="fa-solid fa-folder-plus" />
                                Tambahkan Buku
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookCreate;
