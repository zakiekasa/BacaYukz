import React, { useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import Swal from 'sweetalert2';

interface WeeklyProgressItem {
    day_name: string;
    day_short: string;
    date: string;
    duration_minutes: number;
}

interface StreakProps {
    stats: {
        current_streak: number;
        max_streak: number;
        today_minutes: number;
        total_hours: number;
        weekly_progress: WeeklyProgressItem[];
    };
    user: {
        name: string;
        avatar: string | null;
    };
}

export default function Streak({ stats, user }: StreakProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw the Strava-style share card on the canvas
    const drawShareCard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Reset canvas dimensions
        canvas.width = 1080;
        canvas.height = 1920; // 9:16 portrait aspect ratio for IG/WA Stories

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = user.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200';

        const renderAll = (loadedImage: HTMLImageElement | null) => {
            // 1. Background - Premium Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#FF5A00');   // Wattpad Orange
            gradient.addColorStop(0.3, '#E04F00');
            gradient.addColorStop(1, '#1A0800');    // Very dark brown/black
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Decorative circles/orbs in background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.beginPath();
            ctx.arc(100, 300, 400, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(980, 1500, 500, 0, Math.PI * 2);
            ctx.fill();

            // 3. Draw Header Title / Logo
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.font = 'bold 50px Instrument Sans, sans-serif';
            ctx.fillText('B A C A Y U K Z', canvas.width / 2, 180);

            // Subtitle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '30px Instrument Sans, sans-serif';
            ctx.fillText('LITERASI HARIAN SAYA', canvas.width / 2, 230);

            // 4. White Card Box Container (Glassmorphism look)
            const cardX = 90;
            const cardY = 320;
            const cardW = 900;
            const cardH = 1200;
            const radius = 50;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, radius);
            ctx.fill();
            ctx.stroke();

            // 5. Draw Avatar and Name inside card
            const avatarX = canvas.width / 2;
            const avatarY = 500;
            const avatarR = 100;

            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
            ctx.clip();

            if (loadedImage) {
                ctx.drawImage(loadedImage, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
            } else {
                // Background of avatar clip placeholder
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
                ctx.fillStyle = '#E04F00';
                ctx.font = 'bold 90px Instrument Sans, sans-serif';
                ctx.fillText(user.name.charAt(0).toUpperCase(), avatarX, avatarY + 30);
            }
            ctx.restore();

            // Draw Avatar white border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
            ctx.stroke();

            // User Name
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 45px Instrument Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(user.name, canvas.width / 2, 670);

            // 6. Draw Giant Flame / Fire Icon and Streak Number
            const fireY = 880;
            ctx.fillStyle = '#FF7D00';
            ctx.font = 'bold 240px Instrument Sans, sans-serif';
            ctx.fillText(`${stats.current_streak}`, canvas.width / 2, fireY);

            ctx.fillStyle = '#FF9F40';
            ctx.font = 'bold 40px Instrument Sans, sans-serif';
            ctx.fillText('HARI BERTURUT-TURUT!', canvas.width / 2, fireY + 80);

            // 7. Grid for stats (Today's time, Total hours, Max streak)
            const gridY = 1150;
            const colW = 260;
            const startX = canvas.width / 2 - colW - 50;

            // Left Col: Hari Ini
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '28px Instrument Sans, sans-serif';
            ctx.fillText('HARI INI', startX, gridY);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 60px Instrument Sans, sans-serif';
            ctx.fillText(`${stats.today_minutes}m`, startX, gridY + 80);

            // Center Col: Rekor Streak
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '28px Instrument Sans, sans-serif';
            ctx.fillText('REKOR STREAK', canvas.width / 2, gridY);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 60px Instrument Sans, sans-serif';
            ctx.fillText(`${stats.max_streak} Hari`, canvas.width / 2, gridY + 80);

            // Right Col: Total Baca
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '28px Instrument Sans, sans-serif';
            ctx.fillText('TOTAL BACA', startX + (colW + 50) * 2, gridY);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 60px Instrument Sans, sans-serif';
            ctx.fillText(`${stats.total_hours} Jam`, startX + (colW + 50) * 2, gridY + 80);

            // 8. Divider line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cardX + 100, 1340);
            ctx.lineTo(cardX + cardW - 100, 1340);
            ctx.stroke();

            // 9. Footer / QR URL
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '28px Instrument Sans, sans-serif';
            ctx.fillText('Gabung dan baca gratis di: bacayukz.com', canvas.width / 2, 1720);
        };

        img.onload = () => {
            renderAll(img);
        };
        img.onerror = () => {
            renderAll(null);
        };
    };

    useEffect(() => {
        drawShareCard();
    }, [stats, user]);

    // Handle Download of story card image
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `bacayukz-streak-${stats.current_streak}-hari.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        Swal.fire({
            title: 'Berhasil di-Download!',
            text: 'Buka galeri ponsel Anda lalu posting ke Instagram Story atau WhatsApp Story Anda!',
            icon: 'success',
            confirmButtonColor: '#FF5A00',
        });
    };

    // Handle Share using Web Share API
    const handleShare = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], 'streak.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Streak Membaca Saya',
                    text: `Saya telah membaca selama ${stats.today_minutes} menit hari ini dan mencapai ${stats.current_streak} hari streak di BacaYukz!`,
                }).catch((err) => console.log('Error sharing:', err));
            } else {
                // Fallback to direct download
                handleDownload();
            }
        }, 'image/png');
    };

    return (
        <DashboardLayout active="streak">
            <Head title="Streak Harian Membaca - BacaYukz" />

            <PageHeader
                title="Streak Membaca Harian"
                breadcrumbs={['Dashboard', 'Streak']}
            />

            <div className="row g-4 flex-grow-1">
                {/* Statistics & Overview Column */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="bg-light-subtle p-3 rounded-circle d-flex align-items-center justify-content-center text-primary" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255, 90, 0, 0.1)' }}>
                                <i className="fa-solid fa-fire fs-2"></i>
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0">Pertahankan Streak Anda!</h4>
                                <p className="text-secondary small mb-0">Baca minimal 1 menit setiap hari untuk menjaga streak tetap menyala.</p>
                            </div>
                        </div>

                        {/* Stats Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6 col-md-4">
                                <div className="card border-light rounded-3 p-3 text-center bg-light">
                                    <span className="text-secondary small fw-semibold">Streak Saat Ini</span>
                                    <h2 className="fw-bold text-primary mt-2 mb-0">
                                        <i className="fa-solid fa-fire me-1"></i> {stats.current_streak} <span className="fs-6 text-secondary fw-normal">Hari</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="card border-light rounded-3 p-3 text-center bg-light">
                                    <span className="text-secondary small fw-semibold">Rekor Streak</span>
                                    <h2 className="fw-bold text-dark mt-2 mb-0">
                                        <i className="fa-solid fa-trophy text-warning me-1"></i> {stats.max_streak} <span className="fs-6 text-secondary fw-normal">Hari</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-light rounded-3 p-3 text-center bg-light">
                                    <span className="text-secondary small fw-semibold">Membaca Hari Ini</span>
                                    <h2 className="fw-bold text-success mt-2 mb-0">
                                        <i className="fa-regular fa-clock me-1"></i> {stats.today_minutes} <span className="fs-6 text-secondary fw-normal">Menit</span>
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Calendar representation */}
                        <h6 className="fw-bold text-dark mb-3">Grafik Baca 7 Hari Terakhir</h6>
                        <div className="d-flex justify-content-between align-items-end gap-2 bg-light p-4 rounded-4" style={{ height: '220px' }}>
                            {stats.weekly_progress.map((day) => {
                                const heightPercent = Math.min((day.duration_minutes / 30) * 100, 100); // 30 minutes daily goal benchmark
                                return (
                                    <div key={day.date} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                                        <span className="text-secondary small mb-1" style={{ fontSize: '0.75rem' }}>
                                            {day.duration_minutes > 0 ? `${day.duration_minutes}m` : '-'}
                                        </span>
                                        <div
                                            className="w-100 rounded-3 position-relative"
                                            style={{
                                                height: day.duration_minutes > 0 ? `${heightPercent}%` : '8px',
                                                backgroundColor: day.duration_minutes > 0 ? '#FF5A00' : '#dee2e6',
                                                minHeight: '8px',
                                                transition: 'height 0.3s ease'
                                            }}
                                            title={`${day.day_name}: ${day.duration_minutes} Menit`}
                                        >
                                            {day.duration_minutes >= 30 && (
                                                <i className="fa-solid fa-circle-check text-white position-absolute start-50 translate-middle-x" style={{ fontSize: '10px', top: '5px' }}></i>
                                            )}
                                        </div>
                                        <span className="fw-bold mt-2 text-secondary" style={{ fontSize: '0.8rem' }}>{day.day_short}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <h5 className="fw-bold mb-3"><i className="fa-solid fa-circle-info text-primary me-2"></i> Cara Kerja Streak</h5>
                        <ul className="text-secondary small mb-0 ps-3">
                            <li className="mb-2">Setiap kali Anda membaca bab buku di BacaYukz, waktu baca Anda secara otomatis dicatat.</li>
                            <li className="mb-2">Streak akan bertambah jika Anda membaca setidaknya selama **30 detik** setiap hari secara berturut-turut.</li>
                            <li className="mb-2">Jika Anda melewatkan satu hari penuh tanpa membaca, streak Anda akan kembali ke 0.</li>
                            <li className="mb-0">Pamerkan streak dan durasi baca harian Anda ke teman-teman di Instagram Story atau WhatsApp Story untuk saling memotivasi!</li>
                        </ul>
                    </div>
                </div>

                {/* Strava Share card preview & download Column */}
                <div className="col-lg-5 text-center d-flex flex-column align-items-center">
                    <div className="card border-0 shadow-sm rounded-4 p-4 w-100 bg-white d-flex flex-column align-items-center">
                        <h5 className="fw-bold mb-3 align-self-start"><i className="fa-solid fa-share-nodes text-primary me-2"></i> Preview Story Card</h5>

                        {/* Live Canvas Preview of the actual downloadable story */}
                        <canvas
                            ref={canvasRef}
                            className="rounded-4 shadow-sm w-100"
                            style={{
                                maxWidth: '300px',
                                height: 'auto',
                                aspectRatio: '9/16'
                            }}
                        ></canvas>

                        {/* Action buttons */}
                        <div className="d-flex gap-2 w-100 mt-4" style={{ maxWidth: '300px' }}>
                            <button
                                className="btn btn-primary flex-grow-1 rounded-pill fw-bold text-white py-2.5 shadow-sm"
                                onClick={handleDownload}
                                style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                            >
                                <i className="fa-solid fa-download me-2"></i> Download PNG
                            </button>
                            <button
                                className="btn btn-light rounded-pill border fw-bold text-secondary px-3 py-2.5 shadow-sm"
                                onClick={handleShare}
                            >
                                <i className="fa-solid fa-share-nodes"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
