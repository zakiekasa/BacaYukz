import React from 'react';
import { useForm } from '@inertiajs/react';

type FormFields = {
    email: string,
    password: string
};

const Login = () => {
    const { data, setData, errors, processing, reset, post } = useForm<FormFields>({
        email: '',
        password: ''
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/login', {
            onSuccess: () => reset('email', 'password')
        });
    }
    return (
        // Body styling dipindahkan ke div terluar agar tidak menimpa seluruh body aplikasi (opsional namun disarankan)
        <div className="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

                        <div className="card border-light shadow-sm rounded-4 px-4 py-5 px-sm-5 bg-white">
                            <h4 className="text-center fw-bold mb-4 text-dark">Login</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className={`form-control py-2 text-secondary ${errors.email && 'is-invalid'}`}
                                        placeholder="Email"
                                        required
                                        onChange={(e) => setData('email', e.target.value)}
                                        value={data.email}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <input type="password"
                                        className={`form-control py-2 text-secondary ${errors.password && 'is-invalid'}`}
                                        placeholder="Password"
                                        required
                                        onChange={(e) => setData('password', e.target.value)}
                                        value={data.password}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 rounded-3 fw-medium"
                                    disabled={processing}
                                >
                                    Login
                                </button>
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