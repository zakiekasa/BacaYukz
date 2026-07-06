import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

type FormFields = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const ResetPassword = ({ token, email }: { token: string; email?: string }) => {
    const { data, setData, errors, processing, post } = useForm<FormFields>({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/reset-password');
    }

    return (
        <div className="min-vh-100 d-flex align-items-stretch font-sans bg-body-tertiary">
            <Head title="Setel Ulang Kata Sandi - BacaYukz" />
            
            <style>{`
                .auth-gradient-sidebar {
                    background: linear-gradient(135deg, #FF5A00 0%, #FF7B25 100%);
                }
                .form-control:focus {
                    border-color: #FF5A00 !important;
                    box-shadow: 0 0 0 0.25rem rgba(255, 90, 0, 0.25) !important;
                }
                .btn-wattpad-primary {
                    background-color: #FF5A00 !important;
                    border-color: #FF5A00 !important;
                    color: #fff !important;
                    transition: all 0.2s ease;
                }
                .btn-wattpad-primary:hover {
                    background-color: #e04f00 !important;
                    border-color: #e04f00 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 90, 0, 0.2);
                }
                .link-brand {
                    color: #FF5A00 !important;
                    transition: color 0.15s ease;
                }
                .link-brand:hover {
                    color: #e04f00 !important;
                    text-decoration: underline !important;
                }
            `}</style>

            <div className="container-fluid p-0">
                <div className="row g-0 min-vh-100">
                    {/* Left Column: Visual Branding Sidebar (Desktop Only) */}
                    <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between auth-gradient-sidebar p-5 text-white position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 11%)', backgroundSize: '20px 20px' }}></div>
                        
                        <div className="position-relative z-1">
                            <Link href="/" className="fs-3 fw-bold text-white text-decoration-none d-inline-flex align-items-center gap-2">
                                <i className="fa-solid fa-layer-group"></i>
                                BacaYukz
                            </Link>
                        </div>
                        
                        <div className="my-auto position-relative z-1" style={{ maxWidth: '460px' }}>
                            <h1 className="display-4 fw-bold mb-3 lh-sm">Buat Kata Sandi Baru.</h1>
                            <p className="lead opacity-90">
                                Harap masukkan email Anda kembali beserta kata sandi baru yang aman dan mudah diingat.
                            </p>
                        </div>
                        
                        <div className="position-relative z-1 small opacity-75">
                            &copy; {new Date().getFullYear()} BacaYukz. Hak Cipta Dilindungi.
                        </div>
                    </div>

                    {/* Right Column: Reset Password Form */}
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="text-center mb-4 d-lg-none">
                                <Link href="/" className="fs-3 fw-bold text-dark text-decoration-none d-inline-flex align-items-center gap-2 justify-content-center mb-2">
                                    <i className="fa-solid fa-layer-group text-primary"></i>
                                    BacaYukz
                                </Link>
                            </div>
                            
                            <div className="card border-0 bg-white shadow-sm rounded-4 p-4 p-sm-5">
                                <div className="text-center mb-4">
                                    <h4 className="fw-bold text-dark mb-1">Setel Ulang Kata Sandi</h4>
                                    <p className="text-secondary small">Masukkan detail baru untuk akun Anda</p>
                                </div>

                                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                    {/* Email */}
                                    <div>
                                        <label className="form-label fw-semibold text-dark small">Alamat Email</label>
                                        <input
                                            type="email"
                                            className={`form-control py-2.5 rounded-3 text-secondary border-light bg-body-tertiary ${errors.email && 'is-invalid'}`}
                                            placeholder="Masukkan email Anda"
                                            required
                                            onChange={(e) => setData('email', e.target.value)}
                                            value={data.email}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="form-label fw-semibold text-dark small">Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            className={`form-control py-2.5 rounded-3 text-secondary border-light bg-body-tertiary ${errors.password && 'is-invalid'}`}
                                            placeholder="Buat kata sandi minimal 8 karakter"
                                            required
                                            onChange={(e) => setData('password', e.target.value)}
                                            value={data.password}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="form-label fw-semibold text-dark small">Konfirmasi Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            className={`form-control py-2.5 rounded-3 text-secondary border-light bg-body-tertiary ${errors.password_confirmation && 'is-invalid'}`}
                                            placeholder="Ulangi kata sandi baru"
                                            required
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            value={data.password_confirmation}
                                        />
                                        {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-wattpad-primary w-100 py-2.5 rounded-3 fw-bold mt-2 d-flex align-items-center justify-content-center gap-2"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-key"></i>
                                                Simpan Kata Sandi
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
