import type { BookItem } from '../types/models';

export type SortOption = 'latest' | 'oldest' | 'chapters_desc' | 'chapters_asc' | 'views_desc' | 'views_asc';

/**
 * Sorts a list of books by the given sort key.
 *
 * @param books - Array of books to sort (a copy is made internally).
 * @param sortBy - The sort strategy to apply.
 * @returns A new sorted array.
 */
export function sortBooks(books: BookItem[], sortBy: SortOption): BookItem[] {
    const result = [...books];
    switch (sortBy) {
        case 'latest':        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'oldest':        return result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'chapters_desc': return result.sort((a, b) => b.chaptersCount - a.chaptersCount);
        case 'chapters_asc':  return result.sort((a, b) => a.chaptersCount - b.chaptersCount);
        case 'views_desc':    return result.sort((a, b) => (b.viewsSum ?? 0) - (a.viewsSum ?? 0));
        case 'views_asc':     return result.sort((a, b) => (a.viewsSum ?? 0) - (b.viewsSum ?? 0));
        default:              return result;
    }
}

/**
 * Resolves a book cover URL.
 * Falls back to a deterministic picsum photo when no cover is stored.
 *
 * @param cover - Raw cover value from the server (filename or full URL).
 * @param bookId - Used to generate a unique fallback image.
 */
export function resolveCoverUrl(cover: string | null, bookId: number): string {
    if (!cover) return `https://picsum.photos/300/400?random=${bookId + 10}`;
    return cover.startsWith('http') ? cover : `/storage/covers/${cover}`;
}
