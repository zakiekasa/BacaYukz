import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import CKEditorBab from '../../components/dashboard/CKEditorBab';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { BookItem } from '../../types/models';

interface ChapterProps {
    books: Pick<BookItem, 'id' | 'title' | 'slug'>[];
}

interface ChapterForm {
    book_id: string;
    title: string;
    content: string;
    is_draft: boolean;
}

/**
 * Dashboard page for creating a new chapter.
 *
 * Pre-selects the target book from the `?book_id` URL query parameter if present.
 * The writer can choose to publish the chapter immediately or save it as a draft.
 */
export default function ChapterCreate({ books = [] }: ChapterProps) {
    useFlashNotification();

    const { data, setData, post, processing, errors, reset } = useForm<ChapterForm>({
        book_id: '',
        title: '',
        content: '',
        is_draft: false,
    });

    /**
     * Pre-fills `book_id` from the `?book_id` URL search parameter.
     * This allows the "Tambah Bab Baru" button on BookChapters to deep-link
     * to the correct book.
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const bookIdParam = params.get('book_id');
        if (bookIdParam) setData('book_id', bookIdParam);
    }, []);

    /** Submits the chapter creation form. Resets title/content on success. */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/chapters', {
            onSuccess: () => reset('title', 'content'),
        });
    };

    return (
        <DashboardLayout active="chapters">
            <PageHeader
                title="Tambah Bab Baru"
                breadcrumbs={['Upload Karya']}
            />

            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-5 mb-4">

                {/* Card header */}
                <div className="text-center mb-4">
                    <div
                        className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: '60px', height: '60px' }}
                    >
                        <i className="fa-solid fa-file-pen fs-4" style={{ color: '#FF5A00' }} />
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Tambah Bab Baru</h5>
                    <p className="text-secondary small">
                        Tulis naskah bab baru cerita Anda langsung di editor modern di bawah ini.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Buku Induk */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-dark small">
                            Pilih Buku Induk <span className="text-danger">*</span>
                        </label>
                        <select
                            className={`form-select rounded-3 text-secondary border-light bg-body-tertiary ${errors.book_id && 'is-invalid'}`}
                            required
                            value={data.book_id}
                            onChange={(e) => setData('book_id', e.target.value)}
                        >
                            <option value="">-- Pilih Buku Anda --</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>{book.title}</option>
                            ))}
                        </select>
                        {errors.book_id && <div className="invalid-feedback">{errors.book_id}</div>}
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

                    {/* Content Editor */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark small">
                            Isi Bab <span className="text-danger">*</span>
                        </label>
                        <CKEditorBab
                            value={data.content}
                            onChange={(val) => setData('content', val)}
                        />
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
                            <option value="false">Diterbitkan (Langsung Terbit &amp; Kirim Notifikasi)</option>
                            <option value="true">Draft (Simpan Sementara)</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                        disabled={processing}
                    >
                        <i className={data.is_draft ? 'fa-solid fa-file-shield' : 'fa-solid fa-cloud-arrow-up'} />
                        {processing
                            ? 'Sedang Menyimpan...'
                            : data.is_draft
                                ? 'Simpan sebagai Draft'
                                : 'Terbitkan Bab Sekarang'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
