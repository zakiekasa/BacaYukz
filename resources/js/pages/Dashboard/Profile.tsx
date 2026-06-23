import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import { useFlashNotification } from '../../hooks/useFlashNotification';
import type { UserItem } from '../../types/models';

interface ProfileProps {
    user: UserItem;
}

/**
 * Dashboard profile edit page.
 * Allows the user to update their name, email, password, and (for writers)
 * their social media / donation links.
 */
export default function Profile({ user }: ProfileProps) {
    useFlashNotification();

    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
        (user as any).avatar_url ?? 'https://www.gravatar.com/avatar/?d=mp&s=150'
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        daily_target_minutes: (user as any).daily_target_minutes ?? 15,
        password: '',
        password_confirmation: '',
        instagram: user.instagram ?? '',
        twitter: user.twitter ?? '',
        saweria: user.saweria ?? '',
        avatar: null as File | null,
    });

    /** Submits the profile update form. */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/profile', {
            onSuccess: () => reset('password', 'password_confirmation', 'avatar'),
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <DashboardLayout active="profile">
            <PageHeader
                title="Edit Profil"
                breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, 'Edit Profil']}
            />

            <div className="bg-white rounded-4 shadow-sm p-3 p-lg-5 row">
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4 col-xl-8 col-12">
                    {/* Foto Profil */}
                    <div className="d-flex align-items-center gap-4">
                        <div className="position-relative" style={{ width: '100px', height: '100px' }}>
                            <img
                                src={avatarPreview ?? 'https://www.gravatar.com/avatar/?d=mp&s=150'}
                                alt="Pratinjau Foto Profil"
                                className="w-100 h-100 object-fit-cover rounded-circle border border-2 border-light-subtle"
                            />
                        </div>
                        <div>
                            <FormLabel>Foto Profil</FormLabel>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control form-control-sm rounded-3 mt-1"
                                onChange={handleAvatarChange}
                            />
                            {errors.avatar && <div className="text-danger small mt-1">{errors.avatar}</div>}
                            <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                                Format: JPG, PNG, atau JPEG. Maksimal 2MB.
                            </div>
                        </div>
                    </div>

                    {/* Nama Lengkap */}
                    <FormField label="Nama Lengkap" error={errors.name}>
                        <input
                            type="text"
                            className={`form-control rounded-3 ${errors.name ? 'is-invalid' : 'border-light-subtle'}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama lengkap Anda"
                            required
                        />
                    </FormField>

                    {/* Email */}
                    <FormField label="Alamat Email" error={errors.email}>
                        <input
                            type="email"
                            className={`form-control rounded-3 ${errors.email ? 'is-invalid' : 'border-light-subtle'}`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Masukkan alamat email Anda"
                            required
                        />
                    </FormField>

                    {/* Target Membaca Harian */}
                    <FormField label="Target Membaca Harian (Menit)" error={errors.daily_target_minutes}>
                        <input
                            type="number"
                            className={`form-control rounded-3 ${errors.daily_target_minutes ? 'is-invalid' : 'border-light-subtle'}`}
                            value={data.daily_target_minutes}
                            onChange={(e) => setData('daily_target_minutes', parseInt(e.target.value) || 0)}
                            placeholder="Masukkan target membaca harian Anda"
                            min="1"
                            max="1440"
                            required
                        />
                    </FormField>

                    {/* Peran (read-only) */}
                    <div>
                        <FormLabel>Peran Akun</FormLabel>
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

                    {/* Social / donation links — penulis only */}
                    {user.role === 'penulis' && (
                        <>
                            <FormField label="Link Instagram" error={errors.instagram}>
                                <input
                                    type="text"
                                    className={`form-control rounded-3 ${errors.instagram ? 'is-invalid' : 'border-light-subtle'}`}
                                    value={data.instagram}
                                    onChange={(e) => setData('instagram', e.target.value)}
                                    placeholder="Contoh: https://instagram.com/username"
                                />
                            </FormField>

                            <FormField label="Link Twitter" error={errors.twitter}>
                                <input
                                    type="text"
                                    className={`form-control rounded-3 ${errors.twitter ? 'is-invalid' : 'border-light-subtle'}`}
                                    value={data.twitter}
                                    onChange={(e) => setData('twitter', e.target.value)}
                                    placeholder="Contoh: https://twitter.com/username"
                                />
                            </FormField>

                            <FormField label="Link Saweria" error={errors.saweria}>
                                <input
                                    type="text"
                                    className={`form-control rounded-3 ${errors.saweria ? 'is-invalid' : 'border-light-subtle'}`}
                                    value={data.saweria}
                                    onChange={(e) => setData('saweria', e.target.value)}
                                    placeholder="Contoh: https://saweria.co/username"
                                />
                            </FormField>
                        </>
                    )}

                    <hr className="my-2 border-light-subtle" />

                    {/* Password Baru */}
                    <FormField label="Password Baru (Opsional)" error={errors.password}>
                        <input
                            type="password"
                            className={`form-control rounded-3 ${errors.password ? 'is-invalid' : 'border-light-subtle'}`}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Biarkan kosong jika tidak ingin mengubah password"
                        />
                    </FormField>

                    {/* Konfirmasi Password */}
                    <div>
                        <FormLabel>Konfirmasi Password Baru</FormLabel>
                        <input
                            type="password"
                            className="form-control rounded-3 border-light-subtle"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Konfirmasi password baru Anda"
                        />
                    </div>

                    {/* Submit */}
                    <div className="d-flex justify-content-end mt-2">
                        <button
                            type="submit"
                            className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-inline-flex align-items-center justify-content-center shadow-sm"
                            style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk me-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Local micro-components (private to this file)                               */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Renders a styled form label with the standard uppercase caption style.
 */
function FormLabel({ children }: { children: React.ReactNode }) {
    return (
        <label
            className="form-label fw-bold text-secondary small text-uppercase d-block"
            style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
        >
            {children}
        </label>
    );
}

/**
 * Wraps a form input with a matching label and optional inline validation error.
 */
function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <FormLabel>{label}</FormLabel>
            {children}
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
}
