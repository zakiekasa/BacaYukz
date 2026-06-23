import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import { useFlashNotification } from '../../hooks/useFlashNotification';

interface Question {
    id?: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'a' | 'b' | 'c' | 'd';
}

interface QuizManageProps {
    chapter: {
        id: number;
        title: string;
        slug: string;
    };
    book: {
        id: number;
        title: string;
        slug: string;
    };
    quiz?: {
        id: number;
        title: string;
        questions: Question[];
    } | null;
}

export default function QuizManage({ chapter, book, quiz }: QuizManageProps) {
    useFlashNotification();

    const initialQuestions: Question[] = quiz?.questions && quiz.questions.length > 0
        ? quiz.questions.map(q => ({
            id: q.id,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
          }))
        : [{
            question_text: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_option: 'a'
          }];

    const { data, setData, post, processing, errors } = useForm({
        title: quiz?.title ?? `Kuis Pemahaman: ${chapter.title}`,
        questions: initialQuestions,
    });

    const handleAddQuestion = () => {
        setData('questions', [
            ...data.questions,
            {
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_option: 'a',
            }
        ]);
    };

    const handleRemoveQuestion = (index: number) => {
        const list = [...data.questions];
        list.splice(index, 1);
        setData('questions', list);
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
        const list = [...data.questions];
        list[index] = {
            ...list[index],
            [field]: value
        };
        setData('questions', list);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/chapters/${chapter.id}/quiz`);
    };

    return (
        <DashboardLayout active="books">
            <PageHeader
                title="Kelola Kuis Bab"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Kelola Bab', href: `/dashboard/books/${book.id}/chapters` },
                    'Kelola Kuis Bab'
                ]}
            />

            <div className="bg-white rounded-4 shadow-sm p-4 p-lg-5 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div>
                        <h4 className="fw-bold text-dark mb-1">Kelola Kuis Bab</h4>
                        <p className="text-secondary small mb-0">Buku: <span className="fw-semibold text-primary">{book.title}</span> | Bab: <span className="fw-semibold text-primary">{chapter.title}</span></p>
                    </div>
                    <Link href={`/dashboard/books/${book.id}/chapters`} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                        <i className="fa-solid fa-arrow-left me-1"></i>Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    {/* Judul Kuis */}
                    <div className="form-group">
                        <label className="form-label fw-bold text-secondary text-uppercase small">Judul Kuis</label>
                        <input
                            type="text"
                            className={`form-control rounded-3 ${errors.title ? 'is-invalid' : ''}`}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Masukkan Judul Kuis (misal: Kuis Pemahaman Bab 1)"
                            required
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <hr className="my-2 border-light-subtle" />

                    {/* Daftar Pertanyaan */}
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold text-dark mb-0">Pertanyaan Kuis</h5>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-pill px-3"
                                style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                onClick={handleAddQuestion}
                            >
                                <i className="fa-solid fa-plus me-1"></i> Tambah Pertanyaan
                            </button>
                        </div>

                        {data.questions.map((q, index) => (
                            <div key={index} className="card border rounded-4 p-4 mb-3 shadow-xs bg-light-subtle position-relative">
                                {data.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '32px', height: '32px' }}
                                        onClick={() => handleRemoveQuestion(index)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}

                                <h6 className="fw-bold text-primary mb-3">Pertanyaan #{index + 1}</h6>

                                {/* Teks Pertanyaan */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-secondary">Pertanyaan</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows={2}
                                        value={q.question_text}
                                        onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                                        placeholder="Tuliskan pertanyaan kuis..."
                                        required
                                    />
                                </div>

                                {/* Opsi A B C D */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-secondary">Pilihan A</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={q.option_a}
                                            onChange={(e) => handleQuestionChange(index, 'option_a', e.target.value)}
                                            placeholder="Jawaban Pilihan A"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-secondary">Pilihan B</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={q.option_b}
                                            onChange={(e) => handleQuestionChange(index, 'option_b', e.target.value)}
                                            placeholder="Jawaban Pilihan B"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-secondary">Pilihan C</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={q.option_c}
                                            onChange={(e) => handleQuestionChange(index, 'option_c', e.target.value)}
                                            placeholder="Jawaban Pilihan C"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-secondary">Pilihan D</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={q.option_d}
                                            onChange={(e) => handleQuestionChange(index, 'option_d', e.target.value)}
                                            placeholder="Jawaban Pilihan D"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Kunci Jawaban */}
                                <div style={{ maxWidth: '240px' }}>
                                    <label className="form-label small fw-semibold text-secondary">Kunci Jawaban Benar</label>
                                    <select
                                        className="form-select rounded-3 text-secondary"
                                        value={q.correct_option}
                                        onChange={(e) => handleQuestionChange(index, 'correct_option', e.target.value as any)}
                                        required
                                    >
                                        <option value="a">Opsi A</option>
                                        <option value="b">Opsi B</option>
                                        <option value="c">Opsi C</option>
                                        <option value="d">Opsi D</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end gap-2 border-top pt-4">
                        <Link href={`/dashboard/books/${book.id}/chapters`} className="btn btn-light rounded-3 px-4">Batal</Link>
                        <button
                            type="submit"
                            className="btn btn-primary rounded-3 px-4 fw-bold"
                            style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kuis'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
