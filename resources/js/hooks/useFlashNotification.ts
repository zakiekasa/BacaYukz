import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

/**
 * Custom hook to display Inertia flash messages via Notyf toast notifications.
 *
 * Reads `flash.success` and `flash.message` from Inertia's shared props and
 * shows a success or error toast accordingly. The flash state is cleared after
 * reading to prevent duplicate toasts on subsequent renders.
 *
 * @example
 * // Simply call inside any component that needs flash notifications:
 * useFlashNotification();
 */
export function useFlashNotification(): void {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (!flash) return;

        const notyf = new Notyf({ position: { x: 'right', y: 'top' } });

        if (flash.success === true) {
            notyf.success(flash.message);
        } else if (flash.success === false) {
            notyf.error(flash.message);
        }

        // Clear to prevent re-triggering on unrelated re-renders
        flash.success = null;
    }, [flash]);
}
