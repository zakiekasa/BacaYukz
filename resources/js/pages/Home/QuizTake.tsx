import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';
import { useFlashNotification } from '../../hooks/useFlashNotification';

interface Question {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
}

interface QuizTakeProps {
    book: {
        id: number;
        title: string;
        slug: string;
        cover: string | null;
    };
    quiz: {
        id: number;
        title: string;
        questions: Question[];
    };
    attempt?: {
        score: number;
        updated_at: string;
    } | null;
}

export default function QuizTake({ book, quiz, attempt }: QuizTakeProps) {
    useFlashNotification();
    const { flash } = usePage().props as any;

    const [isRetaking, setIsRetaking] = useState(false);

    // Initialize form answers
    const initialAnswers: Record<number, string> = {};
    quiz.questions.forEach(q => {
        initialAnswers[q.id] = '';
    });

    const { data, setData, post, processing } = useForm({
        answers: initialAnswers,
    });

    const handleAnswerChange = (questionId: number, option: string) => {
        setData('answers', {
            ...data.answers,
            [questionId]: option,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/book/${book.slug}/quiz/submit`, {
            onSuccess: () => {
                setIsRetaking(false);
            }
        });
    };

    const showScore = attempt && !isRetaking;

    return (
        <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title={`Kuis: ${quiz.title} - BacaYukz`} />
            <Navbar />

            <div className="container py-5" style={{ maxWidth: '800px' }}>
                {/* Back Link */}
                <div className="mb-4">
                    <Link
                        href={`/book/${book.slug}`}
                        className="text-secondary text-decoration-none d-inline-flex align-items-center small fw-semibold"
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Kembali ke Detail Buku
                    </Link>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                    {/* Header info */}
                    <div className="p-4 bg-dark text-white d-flex align-items-center gap-4 position-relative" style={{ minHeight: '160px' }}>
                        {book.cover && (
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="rounded shadow border border-light-subtle d-none d-sm-block"
                                style={{ width: '80px', height: '110px', objectFit: 'cover' }}
                            />
                        )}
                        <div>
                            <span className="badge bg-warning text-dark mb-2 fw-bold">KUIS BUKU</span>
                            <h3 className="fw-bold mb-1 text-white">{quiz.title}</h3>
                            <p className="text-white-50 small mb-0">Uji pemahaman Anda terhadap buku: <span className="fw-semibold text-white">{book.title}</span></p>
                        </div>
                    </div>

                    <div className="p-4 p-lg-5">
                        {showScore ? (
                            /* Score / Result Page */
                            <div className="text-center py-5">
                                <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle p-4 mb-4" style={{ width: '100px', height: '100px' }}>
                                    <i className="fa-solid fa-graduation-cap display-4"></i>
                                </div>
                                <h3 className="fw-bold mb-2 text-dark">Kuis Telah Diselesaikan!</h3>
                                <p className="text-secondary mb-4">Berikut adalah perolehan nilai Anda pada percobaan terakhir:</p>

                                <div className="display-1 fw-black text-primary mb-2" style={{ color: '#FF5A00' }}>
                                    {attempt.score}%
                                </div>

                                <div className="mb-5">
                                    <span className={`badge px-3 py-2 rounded-pill fw-bold ${attempt.score >= 70 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                        {attempt.score >= 70 ? 'Hasil Bagus!' : 'Ayo Coba Lagi!'}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    <Link href={`/book/${book.slug}`} className="btn btn-light rounded-pill px-4 fw-semibold border">
                                        Kembali Membaca
                                    </Link>
                                    <button onClick={() => setIsRetaking(true)} className="btn btn-primary rounded-pill px-4 fw-bold" style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}>
                                        Coba Lagi <i className="fa-solid fa-rotate-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Taking Quiz Page */
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-5">
                                {quiz.questions.map((q, idx) => (
                                    <div key={q.id} className="border-bottom pb-4">
                                        <h5 className="fw-bold text-dark mb-3 d-flex align-items-start gap-2" style={{ lineHeight: '1.4' }}>
                                            <span className="badge bg-light text-secondary border font-monospace mt-0.5">{idx + 1}</span>
                                            <span>{q.question_text}</span>
                                        </h5>

                                        <div className="d-flex flex-column gap-2 ps-lg-4 mt-3">
                                            {/* Option A */}
                                            <label className={`form-check-label d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer transition-all ${data.answers[q.id] === 'a' ? 'border-primary bg-primary-subtle' : 'bg-light-subtle hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    className="form-check-input shadow-none"
                                                    checked={data.answers[q.id] === 'a'}
                                                    onChange={() => handleAnswerChange(q.id, 'a')}
                                                    style={{ bordercolor: '#FF5A00' }}
                                                    required
                                                />
                                                <span className="text-dark small"><strong className="me-1">A.</strong> {q.option_a}</span>
                                            </label>

                                            {/* Option B */}
                                            <label className={`form-check-label d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer transition-all ${data.answers[q.id] === 'b' ? 'border-primary bg-primary-subtle' : 'bg-light-subtle hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    className="form-check-input shadow-none"
                                                    checked={data.answers[q.id] === 'b'}
                                                    onChange={() => handleAnswerChange(q.id, 'b')}
                                                    required
                                                />
                                                <span className="text-dark small"><strong className="me-1">B.</strong> {q.option_b}</span>
                                            </label>

                                            {/* Option C */}
                                            <label className={`form-check-label d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer transition-all ${data.answers[q.id] === 'c' ? 'border-primary bg-primary-subtle' : 'bg-light-subtle hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    className="form-check-input shadow-none"
                                                    checked={data.answers[q.id] === 'c'}
                                                    onChange={() => handleAnswerChange(q.id, 'c')}
                                                    required
                                                />
                                                <span className="text-dark small"><strong className="me-1">C.</strong> {q.option_c}</span>
                                            </label>

                                            {/* Option D */}
                                            <label className={`form-check-label d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer transition-all ${data.answers[q.id] === 'd' ? 'border-primary bg-primary-subtle' : 'bg-light-subtle hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    className="form-check-input shadow-none"
                                                    checked={data.answers[q.id] === 'd'}
                                                    onChange={() => handleAnswerChange(q.id, 'd')}
                                                    required
                                                />
                                                <span className="text-dark small"><strong className="me-1">D.</strong> {q.option_d}</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3">
                                    {attempt && (
                                        <button type="button" onClick={() => setIsRetaking(false)} className="btn btn-light rounded-3 px-4 border">
                                            Batal
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-3 px-5 fw-bold"
                                        style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                        disabled={processing}
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Jawaban'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
