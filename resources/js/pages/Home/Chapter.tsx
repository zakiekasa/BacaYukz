import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/home/Navbar';
import DisqusComments from '../../components/home/DisqusComments';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';

type UserType = {
    id: number;
    name: string;
    role?: string;
    instagram?: string | null;
    twitter?: string | null;
    saweria?: string | null;
    avatar?: string | null;
};

type Book = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover: string | null;
    view: number;
    created_at: string;
    updated_at: string;
    user?: UserType;
};

const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return url;
    }
    return `https://${url}`;
};

type Chapter = {
    id: number;
    book_id: number;
    title: string;
    slug: string;
    content: string;
    view: number;
    created_at: string;
    updated_at: string;
};

type Question = {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
};

type Quiz = {
    id: number;
    title: string;
    questions: Question[];
};

type Attempt = {
    score: number;
    updated_at: string;
};

type ChapterProps = {
    book: Book;
    chapter: Chapter;
    previous_chapter: Chapter | null;
    next_chapter: Chapter | null;
    quiz?: Quiz | null;
    attempt?: Attempt | null;
};

/**
 * ChapterDetail renders the main chapter reading page, including the reading scroll progress bar,
 * the chapter content, the author direct support card widget, and comments.
 */
export default function ChapterDetail({ book, chapter, previous_chapter, next_chapter, quiz, attempt }: ChapterProps) {
    const { auth, flash } = usePage().props as any;
    const [scrollPercent, setScrollPercent] = useState(0);
    const [targetReachedShown, setTargetReachedShown] = useState(() => {
        if (typeof window !== 'undefined' && auth?.user?.id) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            const alertKey = `daily_target_shown_${auth.user.id}_${todayStr}`;
            return localStorage.getItem(alertKey) === 'true';
        }
        return false;
    });

    // Text-to-Speech States
    const [isTtsSupported, setIsTtsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speechRate, setSpeechRate] = useState(1.0);

    // Quiz States
    const [isRetaking, setIsRetaking] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize answers when quiz changes
    useEffect(() => {
        if (quiz?.questions) {
            const initialAnswers: Record<number, string> = {};
            quiz.questions.forEach(q => {
                initialAnswers[q.id] = '';
            });
            setAnswers(initialAnswers);
        }
    }, [quiz]);

    const handleAnswerChange = (questionId: number, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(`/chapter/${chapter.id}/quiz/submit`, { answers }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRetaking(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Check if speechSynthesis is supported
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setIsTtsSupported(true);
        }
    }, []);

    // Cleanup SpeechSynthesis on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const getRawText = (html: string) => {
        if (typeof document === 'undefined') return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const handleTtsPlayPause = () => {
        if (!isTtsSupported) return;

        if (isSpeaking) {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
            } else {
                window.speechSynthesis.pause();
                setIsPaused(true);
            }
        } else {
            window.speechSynthesis.cancel();

            const rawText = getRawText(chapter.content);
            if (!rawText.trim()) return;

            const utterance = new SpeechSynthesisUtterance(rawText);
            utterance.lang = 'id-ID';
            utterance.rate = speechRate;

            const voices = window.speechSynthesis.getVoices();
            // Prioritize online, natural, or Google voices for natural intonation
            const indonesianVoice = voices.find(v =>
                (v.lang.startsWith('id') || v.lang.includes('ID')) &&
                (v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
            ) || voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
            if (indonesianVoice) {
                utterance.voice = indonesianVoice;
            }

            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);
        }
    };

    const handleTtsStop = () => {
        if (!isTtsSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const handleRateChange = (rate: number) => {
        setSpeechRate(rate);
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);

            setTimeout(() => {
                const rawText = getRawText(chapter.content);
                if (!rawText.trim()) return;

                const utterance = new SpeechSynthesisUtterance(rawText);
                utterance.lang = 'id-ID';
                utterance.rate = rate;

                const voices = window.speechSynthesis.getVoices();
                // Prioritize online, natural, or Google voices for natural intonation
                const indonesianVoice = voices.find(v =>
                    (v.lang.startsWith('id') || v.lang.includes('ID')) &&
                    (v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
                ) || voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
                if (indonesianVoice) {
                    utterance.voice = indonesianVoice;
                }

                utterance.onend = () => {
                    setIsSpeaking(false);
                    setIsPaused(false);
                };

                utterance.onerror = () => {
                    setIsSpeaking(false);
                    setIsPaused(false);
                };

                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }, 100);
        }
    };

    /**
     * Copy the current chapter URL link to the clipboard.
     */
    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    const notyf = new Notyf({
                        position: { x: 'right', y: 'top' }
                    });
                    notyf.success('Link chapter berhasil disalin!');
                })
                .catch(() => {
                    alert('Gagal menyalin link.');
                });
        }
    };

    // Tracks window scroll coordinates to calculate dynamic reading progress bar percentage.
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const calculatedScrollPercentage = totalScrollableHeight > 0
                ? (currentScrollPosition / totalScrollableHeight) * 100
                : 0;

            setScrollPercent(calculatedScrollPercentage);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const notyf = new Notyf({
            position: { x: 'right', y: 'top' }
        });
        if (flash?.success === true) {
            notyf.success(flash.message);
        } else if (flash?.success === false) {
            notyf.error(flash.message);
        }
        if (flash) {
            flash.success = null;
        }
    }, [flash]);

    // Track active reading time and ping server every 30 seconds
    useEffect(() => {
        if (!auth?.user) return;

        const interval = setInterval(() => {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            fetch('/reading/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify({
                    chapter_id: chapter.id,
                    duration_seconds: 30
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log(`Reading duration logged. Current streak: ${data.current_streak} days. Today's duration: ${data.today_minutes} mins`);

                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        const todayStr = `${year}-${month}-${day}`;
                        const alertKey = `daily_target_shown_${auth.user.id}_${todayStr}`;
                        const isAlertShown = localStorage.getItem(alertKey) === 'true';

                        if (data.today_minutes >= data.daily_target_minutes && !isAlertShown && !targetReachedShown) {
                            localStorage.setItem(alertKey, 'true');
                            setTargetReachedShown(true);
                            Swal.fire({
                                title: 'Target Harian Tercapai! 🎉',
                                text: `Selamat! Anda telah membaca selama ${data.today_minutes} menit hari ini, memenuhi target harian Anda (${data.daily_target_minutes} menit).`,
                                icon: 'success',
                                confirmButtonColor: '#FF5A00',
                                confirmButtonText: 'Mantap!'
                            });
                        }
                    }
                })
                .catch(err => console.error('Streak update error:', err));
        }, 30000);

        return () => clearInterval(interval);
    }, [auth?.user, chapter.id, targetReachedShown]);

    const calculateReadingTime = (text: string) => {
        if (!text) {
            return 1;
        }

        const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
        const wordsPerMinute = 200;

        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return '-';
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return '-';
        }

        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="bg-white min-vh-100 font-sans">
            <Head title={`${chapter.title} - ${book.title}`} />

            <style>{`
                .medium-content p {
                    margin-bottom: 1.8rem;
                }
                .medium-content h2, .medium-content h3 {
                    font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }
                .medium-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                    margin: 2rem 0;
                }
                .medium-content pre {
                    background-color: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 4px;
                    font-size: 0.95rem;
                    margin-bottom: 1.8rem;
                    overflow-x: auto;
                }
            `}</style>

            {/* Reading Scroll Progress Bar */}
            <div
                className="position-fixed top-0 start-0"
                style={{
                    height: '4px',
                    width: `${scrollPercent}%`,
                    backgroundColor: '#FF5A00',
                    zIndex: 1060,
                    transition: 'width 0.1s ease-out',
                }}
            />

            {/* 1. NAVBAR */}
            <Navbar />

            {/* 2. MAIN READING CONTAINER */}
            <div className="container py-5" style={{ maxWidth: '720px' }}>
                {/* Back to Book Detail */}
                <div className="mb-4">
                    <Link
                        href={`/book/${book.slug}`}
                        className="text-secondary text-decoration-none d-inline-flex align-items-center small fw-semibold"
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Kembali ke {book.title}
                    </Link>
                </div>

                {/* Chapter Title & Metadata Header */}
                <header className="mb-5">
                    <h1 className="display-4 fw-bold text-dark mb-3" style={{ letterSpacing: '-1px', lineHeight: '1.2' }}>
                        {chapter.title}
                    </h1>
                    <div className="d-flex flex-wrap align-items-center justify-content-between text-secondary gap-3 small border-bottom border-light pb-4">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-calendar me-2"></i>
                                {formatDate(chapter.created_at)}
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-eye me-2"></i>
                                {chapter.view} kali dibaca
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa-regular fa-clock me-2"></i>
                                {calculateReadingTime(chapter.content)} menit membaca
                            </div>
                        </div>
                        <button
                            onClick={handleShare}
                            className="btn btn-sm btn-outline-primary px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2 shadow-sm border border-primary-subtle bg-light-subtle"
                            style={{ transition: 'all 0.2s ease' }}
                        >
                            <i className="fa-regular fa-share-from-square"></i>
                            <span>Bagikan</span>
                        </button>
                    </div>
                </header>

                {/* Text-to-Speech Player Bar */}
                {isTtsSupported && (
                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255, 90, 0, 0.1)' }}>
                                <i className={`fa-solid ${isSpeaking && !isPaused ? 'fa-volume-high text-primary' : 'fa-headphones text-primary'}`} style={{ color: '#FF5A00' }}></i>
                            </div>
                            <div>
                                <span className="fw-bold text-dark d-block small" style={{ fontSize: '0.85rem' }}>Pembaca Audio (TTS)</span>
                                <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                                    {isSpeaking ? (isPaused ? 'Suara dijeda' : 'Sedang membacakan cerita...') : 'Dengarkan bab cerita ini'}
                                </span>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            {/* Play/Pause Button */}
                            <button
                                onClick={handleTtsPlayPause}
                                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '38px', height: '38px', backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                title={isSpeaking && !isPaused ? 'Jeda' : 'Putar Suara'}
                            >
                                <i className={`fa-solid ${isSpeaking && !isPaused ? 'fa-pause text-white' : 'fa-play text-white ps-0.5'}`}></i>
                            </button>

                            {/* Stop Button */}
                            {(isSpeaking || isPaused) && (
                                <button
                                    onClick={handleTtsStop}
                                    className="btn btn-white border rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '38px', height: '38px' }}
                                    title="Berhenti"
                                >
                                    <i className="fa-solid fa-stop text-secondary"></i>
                                </button>
                            )}

                            {/* Speed Rate Select */}
                            <div className="d-flex align-items-center gap-1.5 ms-2">
                                <i className="fa-solid fa-gauge-high text-secondary small"></i>
                                <select
                                    className="form-select form-select-sm rounded-3 shadow-none border-light-subtle text-secondary"
                                    value={speechRate}
                                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                    style={{ width: '85px', fontSize: '0.8rem' }}
                                >
                                    <option value="0.8">0.8x</option>
                                    <option value="1.0">1.0x</option>
                                    <option value="1.2">1.2x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2.0">2.0x</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapter Content Area */}
                <article
                    className="medium-content text-dark mb-5"
                    style={{
                        fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                        fontSize: '1.25rem',
                        lineHeight: '1.9',
                        color: '#292929',
                        letterSpacing: '-0.003em',
                        wordBreak: 'break-word',
                        textAlign: 'justify',
                    }}
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                />

                {/* Support/Monetization Widget */}
                {book.user && (book.user.saweria || book.user.instagram || book.user.twitter) && (
                    <div className="card border-0 bg-light rounded-4 p-4 text-center shadow-sm mb-5 animate-fade-in">
                        <div className="d-flex flex-column align-items-center">
                            <img
                                src={book.user.avatar ? (book.user.avatar.startsWith('http') ? book.user.avatar : `/storage/avatars/${book.user.avatar}`) : 'https://www.gravatar.com/avatar/?d=mp&s=80'}
                                alt={book.user.name}
                                className="rounded-circle object-fit-cover shadow-sm border border-white border-3 mb-3"
                                style={{ width: '70px', height: '70px' }}
                            />
                            <h6 className="fw-bold text-dark mb-1">Karya ini dibuat oleh {book.user.name}</h6>
                            <p className="text-secondary small mb-3" style={{ maxWidth: '420px' }}>
                                Suka dengan bab cerita ini? Yuk, dukung penulis agar terus bersemangat menelurkan karya-karya orisinal terbaiknya!
                            </p>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {book.user.saweria && (
                                    <a
                                        href={normalizeUrl(book.user.saweria)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm rounded px-3 py-2 fw-bold text-white d-inline-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00', transition: 'all 0.2s ease' }}
                                    >
                                        <i className="fa-solid fa-wallet"></i>
                                        Dukung via Saweria
                                    </a>
                                )}
                                {book.user.instagram && (
                                    <a
                                        href={normalizeUrl(book.user.instagram)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-danger rounded px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 bg-white shadow-xs"
                                    >
                                        <i className="fa-brands fa-instagram"></i>
                                        Instagram
                                    </a>
                                )}
                                {book.user.twitter && (
                                    <a
                                        href={normalizeUrl(book.user.twitter)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-info rounded px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 bg-white shadow-xs"
                                    >
                                        <i className="fa-brands fa-twitter"></i>
                                        Twitter
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Section */}
                {quiz && quiz.questions && quiz.questions.length > 0 && (
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 bg-light">
                        <div className="p-4 bg-dark text-white d-flex align-items-center gap-3">
                            <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-solid fa-graduation-cap fs-5"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-0 text-white">{quiz.title}</h5>
                                <p className="text-white-50 small mb-0">Uji seberapa paham Anda setelah membaca chapter ini</p>
                            </div>
                        </div>

                        <div className="p-4">
                            {!auth?.user ? (
                                <div className="text-center py-4">
                                    <p className="text-secondary mb-3">Anda harus masuk untuk mengikuti kuis ini.</p>
                                    <Link href="/login" className="btn btn-primary rounded-pill px-4 fw-bold" style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}>
                                        Masuk Sekarang
                                    </Link>
                                </div>
                            ) : attempt && !isRetaking ? (
                                <div className="text-center py-4">
                                    <p className="text-secondary mb-2">Anda telah menyelesaikan kuis ini dengan nilai:</p>
                                    <div className="display-4 fw-bold text-primary mb-3" style={{ color: '#FF5A00' }}>
                                        {attempt.score}%
                                    </div>
                                    <div className="mb-4">
                                        <span className={`badge px-3 py-2 rounded-pill fw-bold ${attempt.score >= 70 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                            {attempt.score >= 70 ? 'Pemahaman Sangat Baik!' : 'Silakan pelajari lagi!'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsRetaking(true)}
                                        className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                                        style={{ color: '#FF5A00', borderColor: '#FF5A00' }}
                                    >
                                        Coba Lagi <i className="fa-solid fa-rotate-right ms-1"></i>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleQuizSubmit} className="d-flex flex-column gap-4">
                                    {quiz.questions.map((q, idx) => (
                                        <div key={q.id} className="pb-3 border-bottom border-light-subtle">
                                            <h6 className="fw-bold text-dark mb-3 d-flex align-items-start gap-2" style={{ lineHeight: '1.4' }}>
                                                <span className="badge bg-white text-secondary border font-monospace mt-0.5">{idx + 1}</span>
                                                <span>{q.question_text}</span>
                                            </h6>
                                            <div className="d-flex flex-column gap-2 ps-3">
                                                {/* Option A */}
                                                <label className={`form-check-label d-flex align-items-center gap-3 p-2.5 border rounded-3 cursor-pointer transition-all ${answers[q.id] === 'a' ? 'border-primary bg-primary-subtle' : 'bg-white hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                    <input
                                                        type="radio"
                                                        name={`chapter-question-${q.id}`}
                                                        className="form-check-input shadow-none"
                                                        checked={answers[q.id] === 'a'}
                                                        onChange={() => handleAnswerChange(q.id, 'a')}
                                                        required
                                                    />
                                                    <span className="text-dark small"><strong>A.</strong> {q.option_a}</span>
                                                </label>

                                                {/* Option B */}
                                                <label className={`form-check-label d-flex align-items-center gap-3 p-2.5 border rounded-3 cursor-pointer transition-all ${answers[q.id] === 'b' ? 'border-primary bg-primary-subtle' : 'bg-white hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                    <input
                                                        type="radio"
                                                        name={`chapter-question-${q.id}`}
                                                        className="form-check-input shadow-none"
                                                        checked={answers[q.id] === 'b'}
                                                        onChange={() => handleAnswerChange(q.id, 'b')}
                                                        required
                                                    />
                                                    <span className="text-dark small"><strong>B.</strong> {q.option_b}</span>
                                                </label>

                                                {/* Option C */}
                                                <label className={`form-check-label d-flex align-items-center gap-3 p-2.5 border rounded-3 cursor-pointer transition-all ${answers[q.id] === 'c' ? 'border-primary bg-primary-subtle' : 'bg-white hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                    <input
                                                        type="radio"
                                                        name={`chapter-question-${q.id}`}
                                                        className="form-check-input shadow-none"
                                                        checked={answers[q.id] === 'c'}
                                                        onChange={() => handleAnswerChange(q.id, 'c')}
                                                        required
                                                    />
                                                    <span className="text-dark small"><strong>C.</strong> {q.option_c}</span>
                                                </label>

                                                {/* Option D */}
                                                <label className={`form-check-label d-flex align-items-center gap-3 p-2.5 border rounded-3 cursor-pointer transition-all ${answers[q.id] === 'd' ? 'border-primary bg-primary-subtle' : 'bg-white hover-bg-light'}`} style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}>
                                                    <input
                                                        type="radio"
                                                        name={`chapter-question-${q.id}`}
                                                        className="form-check-input shadow-none"
                                                        checked={answers[q.id] === 'd'}
                                                        onChange={() => handleAnswerChange(q.id, 'd')}
                                                        required
                                                    />
                                                    <span className="text-dark small"><strong>D.</strong> {q.option_d}</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="d-flex justify-content-end gap-2 mt-2">
                                        {attempt && (
                                            <button type="button" onClick={() => setIsRetaking(false)} className="btn btn-light rounded-pill px-4 border">
                                                Batal
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-pill px-5 fw-bold"
                                            style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <footer className="border-top border-light pt-5 pb-5">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-12 col-md-4 mb-3 mb-md-0 text-start">
                            {previous_chapter ? (
                                <Link
                                    href={`/book/${book.slug}/${previous_chapter.slug}`}
                                    className="btn btn-outline-secondary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                                >
                                    <i className="fa-solid fa-chevron-left small"></i>
                                    Sebelumnya
                                </Link>
                            ) : (
                                <span className="btn btn-outline-secondary rounded-pill px-4 py-2 disabled opacity-50">
                                    Chapter Pertama
                                </span>
                            )}
                        </div>

                        <div className="col-12 col-md-4 mb-3 mb-md-0 text-center">
                            <Link
                                href={`/book/${book.slug}`}
                                className="btn btn-light rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 border"
                            >
                                <i className="fa-solid fa-list-ul small"></i>
                                Daftar Chapter
                            </Link>
                        </div>

                        <div className="col-12 col-md-4 text-end">
                            {next_chapter ? (
                                <Link
                                    href={`/book/${book.slug}/${next_chapter.slug}`}
                                    className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                >
                                    Berikutnya
                                    <i className="fa-solid fa-chevron-right small"></i>
                                </Link>
                            ) : (
                                <span className="btn btn-outline-secondary rounded-pill px-4 py-2 disabled opacity-50">
                                    Chapter Terakhir
                                </span>
                            )}
                        </div>
                    </div>
                </footer>

                {/* Disqus Comments Section */}
                <DisqusComments
                    shortname="bacayukz"
                    config={{
                        url: typeof window !== 'undefined' ? `${window.location.origin}/book/${book.slug}/${chapter.slug}` : '',
                        identifier: `chapter-${chapter.id}`,
                        title: `${chapter.title} - ${book.title}`,
                    }}
                />
            </div>
        </div>
    );
}
