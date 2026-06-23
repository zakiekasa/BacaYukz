import React, { useState } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import Navbar from '../../components/home/Navbar';

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface Community {
    id: number;
    name: string;
    slug: string;
    description: string;
    city: string;
    province: string;
    whatsapp_url?: string;
    instagram_username?: string;
    member_count: number;
    avatar_url?: string;
    creator?: User;
}

interface Props {
    communities: Community[];
    filters: {
        search: string;
        province: string;
        city: string;
    };
    availableProvinces: string[];
    availableCities: string[];
}

export default function Communities({ communities = [], filters, availableProvinces = [], availableCities = [] }: Props) {
    const { auth } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [province, setProvince] = useState(filters.province || 'Semua');
    const [city, setCity] = useState(filters.city || 'Semua');
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        city: '',
        province: '',
        whatsapp_url: '',
        instagram_username: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/communities', { search, province, city }, { preserveState: true });
    };

    const handleFilterChange = (newProvince: string, newCity: string) => {
        setProvince(newProvince);
        setCity(newCity);
        router.get('/communities', { search, province: newProvince, city: newCity }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setProvince('Semua');
        setCity('Semua');
        router.get('/communities', { search: '', province: 'Semua', city: 'Semua' });
    };

    const handleCreateCommunity = (e: React.FormEvent) => {
        e.preventDefault();
        post('/communities', {
            onSuccess: () => {
                setShowModal(false);
                reset();
                clearErrors();
            }
        });
    };

    return (
        <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ color: '#333' }}>
            <Head title="Komunitas Membaca Lokal - BacaYukz" />
            <Navbar />

            {/* Hero Section */}
            <div className="position-relative overflow-hidden text-center bg-dark text-white py-5 mb-5 shadow-sm" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255, 90, 0, 0.95) 0%, rgba(224, 79, 0, 0.95) 100%), url("https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div className="container py-4 position-relative z-1">
                    <h1 className="display-4 fw-extrabold mb-3">Temukan Komunitas Membaca</h1>
                    <p className="lead fs-5 mb-4 mx-auto text-white-50" style={{ maxWidth: '600px' }}>
                        Membaca menjadi lebih seru dan interaktif dengan berkumpul bersama pecinta buku di daerahmu. Temukan, diskusikan, dan tumbuh bersama!
                    </p>
                    <button
                        type="button"
                        className="btn btn-light text-primary fw-bold px-4 py-2.5 rounded-pill shadow-sm"
                        onClick={() => setShowModal(true)}
                        style={{ border: 'none', transition: 'transform 0.2s' }}
                    >
                        <i className="fa-solid fa-plus me-2"></i> Buat Komunitas Baru
                    </button>
                </div>
            </div>

            {/* Filter and Content Section */}
            <div className="container px-4 px-lg-5 pb-5 flex-grow-1">
                <div className="row g-4">
                    {/* Sidebar Filters */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-lg-top" style={{ top: '90px', zIndex: 10 }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <i className="fa-solid fa-sliders text-primary me-2"></i> Filter
                            </h5>

                            {/* Search Form */}
                            <form onSubmit={handleSearchSubmit} className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">Cari Nama / Deskripsi</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control rounded-start-pill border-end-0 shadow-none"
                                        placeholder="Ketik kata kunci..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ borderColor: '#dee2e6' }}
                                    />
                                    <button
                                        className="btn btn-outline-secondary rounded-end-pill bg-white text-secondary border-start-0"
                                        type="submit"
                                        style={{ borderColor: '#dee2e6' }}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>

                            {/* Province Filter */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">Provinsi</label>
                                <select
                                    className="form-select rounded-3 shadow-none"
                                    value={province}
                                    onChange={(e) => handleFilterChange(e.target.value, 'Semua')}
                                    style={{ borderColor: '#dee2e6' }}
                                >
                                    <option value="Semua">Semua Provinsi</option>
                                    {availableProvinces.map((prov) => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">Kota / Kabupaten</label>
                                <select
                                    className="form-select rounded-3 shadow-none"
                                    value={city}
                                    onChange={(e) => handleFilterChange(province, e.target.value)}
                                    style={{ borderColor: '#dee2e6' }}
                                >
                                    <option value="Semua">Semua Kota</option>
                                    {availableCities.map((ct) => (
                                        <option key={ct} value={ct}>{ct}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset Button */}
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100 rounded-pill py-2 text-dark border-light-subtle shadow-sm"
                                onClick={handleReset}
                                style={{ fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}
                            >
                                <i className="fa-solid fa-arrow-rotate-left me-2"></i> Reset Filter
                            </button>
                        </div>
                    </div>

                    {/* Communities Grid */}
                    <div className="col-lg-9">
                        {communities.length === 0 ? (
                            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                                <div className="py-5">
                                    <i className="fa-regular fa-folder-open text-muted display-1 mb-4 opacity-50"></i>
                                    <h4 className="fw-bold">Belum Ada Komunitas</h4>
                                    <p className="text-secondary mb-4">Tidak ada komunitas membaca yang cocok dengan kriteria pencarian Anda.</p>
                                    <button
                                        className="btn btn-primary rounded-pill px-4 py-2"
                                        onClick={handleReset}
                                    >
                                        Lihat Semua Komunitas
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {communities.map((community) => (
                                    <div key={community.id} className="col-md-6 col-xl-4 d-flex">
                                        <div className="card border-0 shadow-sm rounded-4 w-100 bg-white p-3.5 d-flex flex-column justify-content-between transition-all" style={{
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'default',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(0,0,0,0.03)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 .5rem 1.5rem rgba(0,0,0,.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '';
                                        }}
                                        >
                                            <div>
                                                {/* Header */}
                                                <div className="d-flex align-items-center gap-3 mb-3">
                                                    <img
                                                        src={community.avatar_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&h=150&q=80'}
                                                        alt={community.name}
                                                        className="rounded-circle object-fit-cover shadow-sm"
                                                        style={{ width: '48px', height: '48px', border: '2px solid #fff' }}
                                                    />
                                                    <div>
                                                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem', lineHeight: '1.3' }}>{community.name}</h6>
                                                        <span className="badge bg-light text-primary border border-primary-subtle rounded-pill py-1 px-2.5 mt-1" style={{ fontSize: '0.75rem' }}>
                                                            <i className="fa-solid fa-location-dot me-1"></i> {community.city}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Location / Meta */}
                                                <div className="text-secondary small mb-3">
                                                    <i className="fa-solid fa-map-location-dot me-1.5 opacity-75"></i> {community.province}
                                                    <span className="mx-2">•</span>
                                                    <i className="fa-solid fa-users me-1.5 opacity-75"></i> {community.member_count} Anggota
                                                </div>

                                                {/* Description */}
                                                <p className="text-secondary small mb-4" style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: '1.5',
                                                    minHeight: '4.5em'
                                                }}>
                                                    {community.description}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="d-flex flex-column gap-2 mt-auto">
                                                {community.whatsapp_url ? (
                                                    <a
                                                        href={community.whatsapp_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-primary btn-sm rounded-pill fw-bold text-white py-2"
                                                        style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                                    >
                                                        <i className="fa-brands fa-whatsapp me-2 fs-6"></i> Gabung Grup WA
                                                    </a>
                                                ) : (
                                                    <button className="btn btn-outline-secondary btn-sm rounded-pill py-2" disabled>
                                                        Hubungi via Admin
                                                    </button>
                                                )}

                                                {community.instagram_username && (
                                                    <a
                                                        href={`https://instagram.com/${community.instagram_username.replace('@', '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-light btn-sm rounded-pill border fw-semibold text-secondary py-2"
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <i className="fa-brands fa-instagram me-2 text-danger"></i> @{community.instagram_username.replace('@', '')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Community Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark mt-2" style={{ fontSize: '1.25rem' }}>
                                    <i className="fa-solid fa-users text-primary me-2"></i> Daftarkan Komunitas
                                </h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => { setShowModal(false); reset(); clearErrors(); }}></button>
                            </div>

                            {!auth.user ? (
                                <div className="modal-body p-4 text-center">
                                    <div className="py-4">
                                        <i className="fa-solid fa-lock text-muted display-4 mb-3 opacity-50"></i>
                                        <h6 className="fw-bold">Harus Login Terlebih Dahulu</h6>
                                        <p className="text-secondary small mb-4">Silakan login atau daftar untuk dapat mendaftarkan komunitas membaca baru Anda.</p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link href="/login" className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(false)}>Login</Link>
                                            <Link href="/register" className="btn btn-light rounded-pill border px-4" onClick={() => setShowModal(false)}>Daftar</Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateCommunity}>
                                    <div className="modal-body px-4 py-3">
                                        <p className="text-secondary small mb-4">
                                            Bagikan informasi komunitas membaca lokal Anda agar dapat ditemukan oleh pencinta buku lainnya di daerah yang sama.
                                        </p>

                                        {/* Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-dark">Nama Komunitas <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control rounded-3 shadow-none ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Contoh: Klub Buku Jogja"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        {/* Description */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-dark">Deskripsi <span className="text-danger">*</span></label>
                                            <textarea
                                                className={`form-control rounded-3 shadow-none ${errors.description ? 'is-invalid' : ''}`}
                                                placeholder="Jelaskan aktivitas, tempat berkumpul, atau tema buku yang dibaca..."
                                                rows={3}
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            ></textarea>
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>

                                        <div className="row">
                                            {/* Province */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold small text-dark">Provinsi <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control rounded-3 shadow-none ${errors.province ? 'is-invalid' : ''}`}
                                                    placeholder="Contoh: DI Yogyakarta"
                                                    value={data.province}
                                                    onChange={e => setData('province', e.target.value)}
                                                />
                                                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                                            </div>

                                            {/* City */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold small text-dark">Kota / Kabupaten <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control rounded-3 shadow-none ${errors.city ? 'is-invalid' : ''}`}
                                                    placeholder="Contoh: Yogyakarta"
                                                    value={data.city}
                                                    onChange={e => setData('city', e.target.value)}
                                                />
                                                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                            </div>
                                        </div>

                                        {/* Whatsapp Link */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-dark">Link Grup WhatsApp (Opsional)</label>
                                            <input
                                                type="url"
                                                className={`form-control rounded-3 shadow-none ${errors.whatsapp_url ? 'is-invalid' : ''}`}
                                                placeholder="https://chat.whatsapp.com/..."
                                                value={data.whatsapp_url}
                                                onChange={e => setData('whatsapp_url', e.target.value)}
                                            />
                                            {errors.whatsapp_url && <div className="invalid-feedback">{errors.whatsapp_url}</div>}
                                        </div>

                                        {/* Instagram Username */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-dark">Instagram Username (Opsional)</label>
                                            <input
                                                type="text"
                                                className={`form-control rounded-3 shadow-none ${errors.instagram_username ? 'is-invalid' : ''}`}
                                                placeholder="Contoh: @klubbuku.jogja"
                                                value={data.instagram_username}
                                                onChange={e => setData('instagram_username', e.target.value)}
                                            />
                                            {errors.instagram_username && <div className="invalid-feedback">{errors.instagram_username}</div>}
                                        </div>
                                    </div>

                                    <div className="modal-footer border-top-0 px-4 pb-4">
                                        <button
                                            type="button"
                                            className="btn btn-light rounded-pill border px-4 py-2 fw-semibold"
                                            onClick={() => { setShowModal(false); reset(); clearErrors(); }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-pill px-4 py-2 text-white fw-bold"
                                            disabled={processing}
                                            style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                                        >
                                            {processing ? 'Menyimpan...' : 'Daftarkan'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
