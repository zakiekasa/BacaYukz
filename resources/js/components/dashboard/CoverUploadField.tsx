import React from 'react';

interface CoverUploadFieldProps {
    /** Current cover preview URL (data URL or server URL). `null` shows placeholder icon. */
    previewUrl: string | null;
    /** Called when the user picks a new file, with the selected File or null. */
    onFileChange: (file: File | null) => void;
    /** Instructional button label. Defaults to "Pilih Cover Buku". */
    buttonLabel?: string;
    /** Optional validation error message. */
    error?: string;
}

/**
 * Drag-style cover image upload field with live preview.
 *
 * Displays the current cover (or a placeholder icon) and lets the user pick
 * a new image file. Emits the raw `File` object (or `null`) via `onFileChange`.
 *
 * @example
 * <CoverUploadField
 *   previewUrl={coverPreview}
 *   onFileChange={(file) => {
 *     setData('cover', file);
 *     setCoverPreview(file ? URL.createObjectURL(file) : null);
 *   }}
 *   error={errors.cover}
 * />
 */
export default function CoverUploadField({
    previewUrl,
    onFileChange,
    buttonLabel = 'Pilih Cover Buku',
    error,
}: CoverUploadFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileChange(file);
            };
            reader.readAsDataURL(file);
            onFileChange(file);
        } else {
            onFileChange(null);
        }
    };

    return (
        <div>
            <div
                className={`border rounded-3 bg-body-tertiary d-flex flex-column align-items-center justify-content-center p-4 text-center cursor-pointer ${error ? 'border-danger' : ''}`}
                style={{ borderStyle: 'dashed', borderColor: error ? undefined : '#cbd5e1' }}
            >
                {!previewUrl ? (
                    <i className="fa-regular fa-image fs-3 text-muted mb-2" />
                ) : (
                    <img
                        src={previewUrl}
                        alt="Pratinjau Cover"
                        className="rounded-3 shadow-sm border border-light mb-2 d-block mx-auto animate-fade-in"
                        style={{ width: '90px', height: '126px', objectFit: 'cover' }}
                    />
                )}

                <label
                    htmlFor="cover-upload"
                    className="btn btn-white btn-sm border-light shadow-sm rounded-3 fw-semibold text-dark cursor-pointer px-3 mb-1"
                >
                    {buttonLabel}
                </label>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    PNG, JPG atau WEBP (Maks. 2MB)
                </span>

                <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleChange}
                />
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}
