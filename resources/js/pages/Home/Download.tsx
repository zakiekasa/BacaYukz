import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';

interface PlatformInfo {
    name: string;
    icon: string;
    fileUrl: string;
    fileFormat: string;
    instructions: string[];
}

export default function Download() {
    const [detectedOS, setDetectedOS] = useState<string>('unknown');
    const [recommendedApp, setRecommendedApp] = useState<PlatformInfo | null>(null);

    const platforms: Record<string, PlatformInfo> = {
        windows: {
            name: 'Windows',
            icon: 'fa-brands fa-windows',
            fileUrl: '/downloads/BacaYukz-Setup-1.0.0.exe',
            fileFormat: '.exe (Windows Installer)',
            instructions: [
                'Unduh file installer (.exe).',
                'Klik dua kali pada file unduhan untuk memulai instalasi.',
                'Ikuti petunjuk di layar, lalu buka aplikasi dari shortcut desktop Anda.'
            ]
        },
        macos: {
            name: 'macOS',
            icon: 'fa-brands fa-apple',
            fileUrl: '/downloads/BacaYukz-1.0.0-arm64.dmg',
            fileFormat: '.dmg (Apple Silicon & Intel)',
            instructions: [
                'Unduh file installer (.dmg) untuk Mac.',
                'Klik dua kali pada file .dmg untuk membukanya.',
                'Seret (drag & drop) ikon BacaYukz ke folder Applications Anda.',
                'Buka aplikasi lewat Launchpad atau folder Applications.'
            ]
        },
        linux: {
            name: 'Linux',
            icon: 'fa-brands fa-linux',
            fileUrl: '/downloads/BacaYukz-1.0.0.AppImage',
            fileFormat: '.AppImage (Universal Linux)',
            instructions: [
                'Unduh file .AppImage.',
                'Klik kanan pada file, pilih Properties -> Permissions.',
                'Centang opsi "Allow executing file as program".',
                'Klik dua kali untuk langsung menjalankan aplikasi.'
            ]
        }
    };

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.includes('win')) {
            setDetectedOS('windows');
            setRecommendedApp(platforms.windows);
        } else if (userAgent.includes('mac')) {
            setDetectedOS('macos');
            setRecommendedApp(platforms.macos);
        } else if (userAgent.includes('linux')) {
            setDetectedOS('linux');
            setRecommendedApp(platforms.linux);
        }
    }, []);

    return (
        <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title="Unduh Aplikasi - BacaYukz" />
            <Navbar />

            {/* Custom Styles */}
            <style>{`
                .download-card {
                    transition: all 0.3s ease;
                }
                .download-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
                }
                .btn-wattpad {
                    background-color: #FF5A00 !important;
                    border-color: #FF5A00 !important;
                    color: #fff !important;
                    transition: all 0.2s ease;
                }
                .btn-wattpad:hover {
                    background-color: #e04f00 !important;
                    border-color: #e04f00 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 90, 0, 0.25);
                }
                .hero-gradient {
                    background: linear-gradient(135deg, #FF5A00 0%, #FF7B25 100%);
                    color: white;
                    border-radius: 1.5rem;
                }
                [data-bs-theme="dark"] .hero-gradient {
                    background: linear-gradient(135deg, #cc4800 0%, #1e120c 100%);
                }
                [data-bs-theme="dark"] .text-dark {
                    color: #fff !important;
                }
            `}</style>

            <div className="container px-4 px-lg-5 py-5 flex-grow-1">
                {/* Hero / Header Section */}
                <div className="hero-gradient p-5 text-center mb-5 shadow-sm">
                    <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
                        BacaYukz Desktop App
                    </h1>
                    <p className="lead opacity-90 mx-auto mb-0" style={{ maxWidth: '650px' }}>
                        Nikmati pengalaman membaca dan menulis yang lebih fokus, lancar, dan terintegrasi langsung dari komputer Anda tanpa gangguan tab browser.
                    </p>
                </div>

                {/* Auto Detection / Recommended Download Section */}
                {recommendedApp && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 mb-5 bg-white text-center">
                        <center>
                            <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-3 mb-4 text-primary" style={{ width: '80px', height: '80px' }}>
                                <i className={`${recommendedApp.icon} display-4`} style={{ color: '#FF5A00' }}></i>
                            </div>
                        </center>
                        <span className="text-secondary small fw-semibold d-block mb-1">DETEKSI SISTEM OPERASI ANDA</span>
                        <h2 className="fw-bold text-dark mb-2">Unduh untuk {recommendedApp.name}</h2>
                        <p className="text-muted small mb-4">Format berkas: {recommendedApp.fileFormat}</p>

                        <div className="d-flex justify-content-center mb-4">
                            <a href={recommendedApp.fileUrl} download className="btn btn-lg btn-wattpad rounded-pill px-5 py-3 fw-bold shadow-sm">
                                <i className="fa-solid fa-download me-2"></i>Unduh Sekarang
                            </a>
                        </div>

                        {/* Instructions */}
                        <div className="text-start mx-auto p-4 bg-light rounded-3" style={{ maxWidth: '600px' }}>
                            <h5 className="fw-bold text-dark mb-3"><i className="fa-solid fa-list-check me-2 text-primary" style={{ color: '#FF5A00' }}></i>Cara Instalasi:</h5>
                            <ol className="mb-0 text-secondary" style={{ paddingLeft: '1.2rem', lineHeight: '1.7' }}>
                                {recommendedApp.instructions.map((step, idx) => (
                                    <li key={idx} className="mb-2">{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}

                {/* Alternative Platforms */}
                <h3 className="fw-bold text-dark text-center mb-4">Pilihan Platform Lainnya</h3>
                <div className="row g-4 justify-content-center">
                    {Object.entries(platforms).map(([key, info]) => {
                        const isRecommended = key === detectedOS;
                        return (
                            <div key={key} className="col-md-4">
                                <div className={`card h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white download-card ${isRecommended ? 'border-primary border-2' : ''}`}>
                                    <div className="fs-1 mb-3 text-secondary">
                                        <i className={info.icon}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">{info.name}</h4>
                                    <p className="text-muted small mb-4">{info.fileFormat}</p>
                                    <a href={info.fileUrl} download className="btn btn-outline-secondary rounded-pill px-4 py-2 mt-auto fw-bold">
                                        <i className="fa-solid fa-download me-2"></i>Unduh {info.name}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile / PWA App Callout */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mt-5 bg-white text-center">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-2 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-circle p-3" style={{ width: '70px', height: '70px' }}>
                                <i className="fa-solid fa-mobile-screen-button fs-2"></i>
                            </div>
                        </div>
                        <div className="col-lg-7 text-lg-start">
                            <h4 className="fw-bold text-dark mb-1">Membaca Lewat Smartphone?</h4>
                            <p className="text-secondary small mb-0">
                                Buka website **BacaYukz** langsung dari browser Google Chrome (Android) atau Safari (iOS) di ponsel Anda, lalu pilih opsi **"Tambahkan ke Layar Utama" / "Install Aplikasi"** untuk menginstal aplikasi PWA mobile kami secara instan.
                            </p>
                        </div>
                        <div className="col-lg-3 text-lg-end">
                            <Link href="/" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold">
                                Buka Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
