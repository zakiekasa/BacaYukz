import React from 'react';

/**
 * Displays a status badge for a chapter indicating whether it is a
 * published chapter or an unpublished draft.
 *
 * @param isDraft - When `true`, renders the "Draft" badge; otherwise "Terbit".
 *
 * @example
 * <DraftStatusBadge isDraft={chapter.is_draft} />
 */
interface DraftStatusBadgeProps {
    isDraft: boolean;
}

export default function DraftStatusBadge({ isDraft }: DraftStatusBadgeProps) {
    if (isDraft) {
        return (
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fw-semibold rounded-pill">
                <i className="fa-solid fa-file-shield me-1" />
                Draft
            </span>
        );
    }

    return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold rounded-pill">
            <i className="fa-solid fa-globe me-1" />
            Terbit
        </span>
    );
}
