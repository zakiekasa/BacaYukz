import React from 'react';

const Register = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

                        <div className="card border-light shadow-sm rounded-4 px-4 py-5 px-sm-5 bg-white">

                            {/* Judul diubah menjadi Register */}
                            <h4 className="text-center fw-bold mb-4 text-dark">Register</h4>

                            <form action="/login">
                                {/* Tambahan spesifik Register: Full Name */}
                                <div className="mb-3">
                                    <input type="text" className="form-control py-2 text-secondary" placeholder="Full Name" required />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control py-2 text-secondary" placeholder="Email" required />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control py-2 text-secondary" placeholder="Password" required />
                                </div>
                                {/* Tambahan spesifik Register: Confirm Password */}
                                <div className="mb-3">
                                    <input type="password" className="form-control py-2 text-secondary" placeholder="Confirm Password" required />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-medium">Register</button>
                            </form>

                            <div className="text-center mt-4">
                                <span className="text-secondary">Already have an account? </span>
                                {/* Mengarahkan user kembali ke halaman Sign in */}
                                <a href="/login" className="text-primary fw-bold text-decoration-none">Login</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;