/**
 * @file models.ts
 * @description Centralized domain model types for the BacaYukz application.
 * All shared entity shapes should be defined here for consistency.
 */

/** Represents a book genre/category. */
export interface GenreItem {
    id: number;
    name: string;
    slug: string;
}

/** Represents a lightweight book reference (used in lists/tables). */
export interface BookItem {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
    description: string;
    chaptersCount: number;
    viewsSum?: number;
    createdAt: string;
    genres?: GenreItem[];
    likes?: number;
}

/** Represents the full detail of a book (used in edit forms). */
export interface BookDetail {
    id: number;
    title: string;
    description: string;
    cover: string | null;
    genres: GenreItem[];
}

/** Represents a chapter row in a list/table. */
export interface ChapterItem {
    id: number;
    title: string;
    slug: string;
    view: number;
    is_draft: boolean;
    createdAt: string;
}

/** Represents the full detail of a chapter (used in edit forms). */
export interface ChapterDetail {
    id: number;
    title: string;
    content: string;
    is_draft: boolean;
    book: {
        id: number;
        title: string;
        slug: string;
    };
}

/** Represents a book that has been liked by the current user. */
export interface LikedBookItem {
    id: number;
    title: string;
    slug: string;
    cover: string | null;
    description: string;
    chaptersCount: number;
    createdAt: string;
    likes: number;
}

/** Represents a user profile. */
export interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'penulis' | 'pembaca';
    instagram?: string | null;
    twitter?: string | null;
    saweria?: string | null;
}
