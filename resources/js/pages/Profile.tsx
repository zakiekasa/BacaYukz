import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Sidebar from '../components/dashboard/Sidebar';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'penulis' | 'pembaca';
    instagram?: string | null;
    twitter?: string | null;
    saweria?: string | null;
}

interface ProfileProps {
    user: UserItem;
}

export default function Profile({ user }: ProfileProps) {
    const { flash }: any = usePage().props;
    const notyf = new Notyf({
        position: { x: 'right', y: 'top' }
    });

    useEffect(() => {
        if (flash?.success === true) {
            notyf.success(flash.message);
        } else if (flash?.success === false) {
            notyf.error(flash.message);
        }
        if (flash) {
            flash.success = null;
        }
    }, [flash]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        instagram: user.instagram || '',
        twitter: user.twitter || '',
        saweria: user.saweria || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/profile', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex font-sans position-relative">
            {/* --- BACKDROP MOBILE --- */}
            {isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 d-lg-none"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar active="profile" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column overflow-x-hidden">
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4 pt-2">
                    <button
                        className="btn btn-white bg-white border-light shadow-sm rounded-3 px-3 py-2 d-lg-none"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <i className="fa-solid fa-bars text-dark fs-5"></i>
                    </button>
                    <div>
                        <div className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                            Halaman <span className="mx-1">/</span> <Link href="/dashboard" className="text-decoration-none text-secondary">Dashboard</Link> <span className="mx-1">/</span> <span className="text-dark">Edit Profil</span>
                        </div>
                        <h4 className="fw-bold text-dark mb-0">Edit Profil</h4>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-4 shadow-sm p-4" style={{ maxWidth: '640px' }}>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        {/* Nama */}
                        <div>
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                className={`form-control rounded-3 ${errors.name ? 'is-invalid' : 'border-light-subtle'}`}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap Anda"
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                className={`form-control rounded-3 ${errors.email ? 'is-invalid' : 'border-light-subtle'}`}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan alamat email Anda"
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Peran / Role (Read-only) */}
                        <div>
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                Peran Akun
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-3 border-light-subtle bg-light text-capitalize"
                                value={user.role}
                                disabled
                                readOnly
                            />
                            <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                                Peran akun ditentukan saat pendaftaran dan tidak dapat diubah.
                            </div>
                        </div>

                        {user.role === 'penulis' && (
                            <>
                                {/* Link Instagram */}
                                <div>
                                    <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        Link Instagram
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control rounded-3 ${errors.instagram ? 'is-invalid' : 'border-light-subtle'}`}
                                        value={data.instagram}
                                        onChange={(e) => setData('instagram', e.target.value)}
                                        placeholder="Contoh: https://instagram.com/username"
                                    />
                                    {errors.instagram && <div className="invalid-feedback">{errors.instagram}</div>}
                                </div>

                                {/* Link Twitter */}
                                <div>
                                    <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        Link Twitter
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control rounded-3 ${errors.twitter ? 'is-invalid' : 'border-light-subtle'}`}
                                        value={data.twitter}
                                        onChange={(e) => setData('twitter', e.target.value)}
                                        placeholder="Contoh: https://twitter.com/username"
                                    />
                                    {errors.twitter && <div className="invalid-feedback">{errors.twitter}</div>}
                                </div>

                                {/* Link Saweria */}
                                <div>
                                    <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        Link Saweria
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control rounded-3 ${errors.saweria ? 'is-invalid' : 'border-light-subtle'}`}
                                        value={data.saweria}
                                        onChange={(e) => setData('saweria', e.target.value)}
                                        placeholder="Contoh: https://saweria.co/username"
                                    />
                                    {errors.saweria && <div className="invalid-feedback">{errors.saweria}</div>}
                                </div>
                            </>
                        )}

                        <hr className="my-2 border-light-subtle" />

                        {/* Password Baru */}
                        <div>
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                Password Baru (Opsional)
                            </label>
                            <input
                                type="password"
                                className={`form-control rounded-3 ${errors.password ? 'is-invalid' : 'border-light-subtle'}`}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Biarkan kosong jika tidak ingin mengubah password"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        {/* Konfirmasi Password Baru */}
                        <div>
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                className="form-control rounded-3 border-light-subtle"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Konfirmasi password baru Anda"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end mt-2">
                            <button
                                type="submit"
                                className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-inline-flex align-items-center justify-content-center shadow-sm"
                                style={{ backgroundColor: '#f28b50', borderColor: '#f28b50' }}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-floppy-disk me-2"></i>Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
