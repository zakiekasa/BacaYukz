import React from 'react';
import { useForm } from '@inertiajs/react';


type FormFields = {
    name: string,
    email: string,
    password: string,
    password_confirmation: string
}

const Register = () => {
    const { data, setData, errors, processing, post, reset } = useForm<FormFields>({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post('/register', {
            onSuccess: () => {
                reset('name', 'email', 'password', 'password_confirmation')
            }
        })


    }
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

                        <div className="card border-light shadow-sm rounded-4 px-4 py-5 px-sm-5 bg-white">

                            {/* Judul diubah menjadi Register */}
                            <h4 className="text-center fw-bold mb-4 text-dark">Register</h4>

                            <form onSubmit={handleSubmit}>
                                {/* Tambahan spesifik Register: Full Name */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control py-2 text-secondary ${errors.name && 'is-invalid'}`}
                                        placeholder="Full Name"
                                        value={data.name}
                                        onChange={(e) => { setData('name', e.target.value) }}
                                        required
                                    />
                                    {errors.name &&
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    }
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className={`form-control py-2 text-secondary ${errors.email && 'is-invalid'}`}
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(e) => { setData('email', e.target.value) }}
                                        required
                                    />
                                    {errors.email &&
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    }
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className={`form-control py-2 text-secondary ${errors.password && 'is-invalid'}`}
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => { setData('password', e.target.value) }}
                                        required
                                    />
                                    {errors.password &&
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    }
                                </div>
                                {/* Tambahan spesifik Register: Confirm Password */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className={`form-control py-2 text-secondary ${errors.password_confirmation && 'is-invalid'}`}
                                        placeholder="Confirm Password"
                                        value={data.password_confirmation}
                                        onChange={(e) => { setData('password_confirmation', e.target.value) }}
                                        required
                                    />
                                    {errors.password_confirmation &&
                                        <div className="invalid-feedback">
                                            {errors.password_confirmation}
                                        </div>
                                    }
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 rounded-3 fw-medium"
                                    disabled={processing}
                                >Register</button>
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
        </div >
    );
};

export default Register;