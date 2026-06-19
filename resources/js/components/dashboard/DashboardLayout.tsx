import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

/** Context providing sidebar controls to child components within DashboardLayout. */
export const SidebarContext = createContext<{
    setIsSidebarOpen: (open: boolean) => void;
}>({ setIsSidebarOpen: () => {} });

/** Hook to consume the sidebar open/close function inside DashboardLayout. */
export const useSidebar = () => useContext(SidebarContext);

interface DashboardLayoutProps {
    /** The active menu key to highlight in the sidebar. */
    active: 'dashboard' | 'books' | 'chapters' | 'likes' | 'profile' | 'none';
    /** The page content to render inside the main area. */
    children: React.ReactNode;
}

/**
 * Shared layout wrapper for all dashboard pages.
 *
 * Renders the sidebar, mobile backdrop overlay, and the scrollable main area.
 * It also provides a `SidebarContext` so that child components (e.g. `PageHeader`)
 * can open the sidebar on mobile without prop-drilling.
 *
 * @example
 * <DashboardLayout active="dashboard">
 *   <PageHeader title="Dashboard" breadcrumbs={['Dashboard']} />
 *   ...
 * </DashboardLayout>
 */
export default function DashboardLayout({ active, children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ setIsSidebarOpen }}>
            <div className="bg-body-tertiary min-vh-100 d-flex font-sans position-relative">
                {/* Mobile backdrop overlay */}
                {isSidebarOpen && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 d-lg-none"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    active={active}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column overflow-x-hidden">
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    );
}
