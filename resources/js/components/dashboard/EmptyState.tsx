import React from 'react';
import { Link } from '@inertiajs/react';

interface EmptyStateProps {
    /** FontAwesome icon class, e.g. `"fa-solid fa-book-open"`. */
    icon: string;
    /** Bold heading text. */
    heading: string;
    /** Descriptive paragraph text. */
    description: string;
    /** Optional call-to-action button/link. */
    action?: {
        label: string;
        href: string;
        icon?: string;
    };
}

/**
 * Reusable empty-state placeholder shown when a list or table has no data.
 *
 * @example
 * <EmptyState
 *   icon="fa-solid fa-book-open"
 *   heading="Belum ada buku"
 *   description="Unggah karya orisinal Anda untuk melihatnya di sini."
 *   action={{ label: 'Upload Buku', href: '/dashboard/books', icon: 'fa-solid fa-plus' }}
 * />
 */
export default function EmptyState({ icon, heading, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-5">
            <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '70px', height: '70px' }}
            >
                <i className={`${icon} fs-3 text-secondary`} />
            </div>
            <h6 className="fw-bold text-dark mb-1">{heading}</h6>
            <p className="text-secondary small mb-3">{description}</p>

            {action && (
                <Link
                    href={action.href}
                    className="btn btn-primary btn-sm rounded-3 px-4 py-2"
                    style={{ backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}
                >
                    {action.icon && <i className={`${action.icon} me-2`} />}
                    {action.label}
                </Link>
            )}
        </div>
    );
}
