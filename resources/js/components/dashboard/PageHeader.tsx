import React from 'react';
import { Link } from '@inertiajs/react';
import { useSidebar } from './DashboardLayout';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    /** The main title shown as an `<h4>`. */
    title: string;
    /**
     * Breadcrumb trail. Each item can be a plain string (current page)
     * or an object `{ label, href }` for a clickable link.
     */
    breadcrumbs: (string | BreadcrumbItem)[];
    /** Optional content to render to the right of the title (e.g. search + sort). */
    actions?: React.ReactNode;
}

/**
 * Reusable dashboard page header with a hamburger button (mobile), breadcrumb
 * trail, page title, and an optional right-side actions area.
 *
 * The hamburger button calls `setIsSidebarOpen(true)` via `SidebarContext`,
 * so no prop-drilling is required.
 *
 * @example
 * <PageHeader
 *   title="Kelola Bab"
 *   breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, 'Kelola Bab']}
 *   actions={<input placeholder="Cari..." />}
 * />
 */
export default function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
    const { setIsSidebarOpen } = useSidebar();

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 pt-2 gap-3">
            <div className="d-flex align-items-center gap-3">
                {/* Hamburger — visible only on mobile/tablet */}
                <button
                    id="sidebar-toggle-btn"
                    className="btn btn-white bg-white border-light shadow-sm rounded-3 px-3 py-2 d-lg-none"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Buka sidebar"
                >
                    <i className="fa-solid fa-bars text-dark fs-5" />
                </button>

                <div>
                    {/* Breadcrumb */}
                    <div className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                        Halaman
                        {breadcrumbs.map((crumb, idx) => {
                            const label = typeof crumb === 'string' ? crumb : crumb.label;
                            const href  = typeof crumb === 'object' ? crumb.href : undefined;
                            const isLast = idx === breadcrumbs.length - 1;

                            return (
                                <React.Fragment key={idx}>
                                    <span className="mx-1">/</span>
                                    {href ? (
                                        <Link href={href} className="text-decoration-none text-secondary">
                                            {label}
                                        </Link>
                                    ) : (
                                        <span className={isLast ? 'text-dark' : 'text-secondary'}>{label}</span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Page title */}
                    <h4 className="fw-bold text-dark mb-0">{title}</h4>
                </div>
            </div>

            {/* Optional right-side actions */}
            {actions && <div>{actions}</div>}
        </div>
    );
}
