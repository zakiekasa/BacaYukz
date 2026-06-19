import React from 'react';

interface GenreItem {
    id: number;
    name: string;
}

interface GenreCheckboxListProps {
    /** Full list of available genres to render as checkboxes. */
    genres: GenreItem[];
    /** Array of currently selected genre IDs. */
    selectedIds: number[];
    /** Callback fired when a checkbox is toggled. */
    onToggle: (genreId: number) => void;
    /** Optional validation error message to display below the list. */
    error?: string;
}

/**
 * Renders a responsive grid of genre checkboxes for book create/edit forms.
 *
 * @example
 * <GenreCheckboxList
 *   genres={genres}
 *   selectedIds={data.genres}
 *   onToggle={handleGenreChange}
 *   error={errors.genres}
 * />
 */
export default function GenreCheckboxList({
    genres,
    selectedIds,
    onToggle,
    error,
}: GenreCheckboxListProps) {
    return (
        <div>
            <div className="row g-2">
                {genres.map((genre) => (
                    <div className="col-6 col-sm-4 col-md-3" key={genre.id}>
                        <div className="form-check p-2 border border-light-subtle rounded bg-light d-flex align-items-center gap-2">
                            <input
                                className="form-check-input ms-0 mt-0 cursor-pointer"
                                type="checkbox"
                                id={`genre-${genre.id}`}
                                value={genre.id}
                                checked={selectedIds.includes(genre.id)}
                                onChange={() => onToggle(genre.id)}
                            />
                            <label
                                className="form-check-label text-secondary small cursor-pointer flex-grow-1"
                                htmlFor={`genre-${genre.id}`}
                            >
                                {genre.name}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}
