import { Link } from '@inertiajs/react';

export default function Book({ id, title, genre, views, cover, href }: { id: number; title: string; genre?: string; views?: number; cover?: string | null; href?: string }) {
    const coverUrl = cover
        ? (cover.startsWith('http') ? cover : `/storage/covers/${cover}`)
        : `https://picsum.photos/300/400?random=${id + 10}`;

    const cardContent = (
        <div className="h-100 d-flex flex-column text-start">
            <div className="position-relative rounded-3 overflow-hidden mb-2 shadow-sm card-image-container" style={{ aspectRatio: '3/4' }}>
                <img src={coverUrl} alt={title} className="w-100 h-100 object-fit-cover transition-all" style={{ transition: 'transform 0.3s ease' }} />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 transition-all hover-overlay"></div>
            </div>
            <h6 className="fw-bold mb-0 text-truncate text-dark card-title-text" style={{ fontSize: '0.95rem' }}>{title}</h6>
            {views !== undefined && <small className="text-secondary small mt-0.5"><i className="fa-solid fa-eye me-1 text-muted"></i>{views}x Dibaca</small>}
            {genre && <small className="text-secondary small mt-0.5">{genre}</small>}
        </div>
    );

    return (
        <div className="col" key={id}>
            <style>{`
                .card-image-container:hover img {
                    transform: scale(1.06);
                }
                .card-image-container:hover .hover-overlay {
                    opacity: 0.15 !important;
                }
                .card-title-text:hover {
                    color: #f28b50 !important;
                }
            `}</style>
            {href ? (
                <Link href={href} className="text-decoration-none">
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
        </div>
    );
}