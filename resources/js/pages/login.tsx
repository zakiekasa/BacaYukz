import React from 'react';

const Login = () => {
    return (
        // Body styling dipindahkan ke div terluar agar tidak menimpa seluruh body aplikasi (opsional namun disarankan)
        <div className="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

                        <div className="card border-light shadow-sm rounded-4 px-4 py-5 px-sm-5 bg-white">
                            <h4 className="text-center fw-bold mb-4 text-dark">Login</h4>

                            <form action="/dashboard">
                                <div className="mb-3">
                                    <input type="email" className="form-control py-2 text-secondary" placeholder="Email" required />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control py-2 text-secondary" placeholder="Password" required />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-medium">Login</button>
                            </form>

                            <div className="text-center mt-4">
                                <span className="text-secondary">Don't have an account? </span>
                                <a href="/register" className="text-primary fw-bold text-decoration-none">Register</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;