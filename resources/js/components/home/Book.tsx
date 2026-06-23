import { Link } from '@inertiajs/react';

export default function Book({ id, title, genre, views, cover, href, authorName, authorAvatar, authorId }: { id: number; title: string; genre?: string; views?: number; cover?: string | null; href?: string; authorName?: string; authorAvatar?: string | null; authorId?: number }) {
    const coverUrl = cover
        ? (cover.startsWith('http') ? cover : `/storage/covers/${cover}`)
        : `https://picsum.photos/300/400?random=${id + 10}`;

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
                    color: #FF5A00 !important;
                }
                .hover-opacity:hover {
                    opacity: 0.8;
                }
            `}</style>
            <div className="h-100 d-flex flex-column text-start position-relative">
                {href ? (
                    <Link href={href} className="text-decoration-none">
                        <div className="position-relative rounded-3 overflow-hidden mb-2 shadow-sm card-image-container" style={{ aspectRatio: '3/4' }}>
                            <img src={coverUrl} alt={title} className="w-100 h-100 object-fit-cover transition-all" style={{ transition: 'transform 0.3s ease' }} />
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 transition-all hover-overlay"></div>
                        </div>
                        <h6 className="fw-bold mb-1 text-truncate text-dark card-title-text" style={{ fontSize: '0.95rem' }}>{title}</h6>
                    </Link>
                ) : (
                    <>
                        <div className="position-relative rounded-3 overflow-hidden mb-2 shadow-sm card-image-container" style={{ aspectRatio: '3/4' }}>
                            <img src={coverUrl} alt={title} className="w-100 h-100 object-fit-cover transition-all" style={{ transition: 'transform 0.3s ease' }} />
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 transition-all hover-overlay"></div>
                        </div>
                        <h6 className="fw-bold mb-1 text-truncate text-dark card-title-text" style={{ fontSize: '0.95rem' }}>{title}</h6>
                    </>
                )}
                
                {authorName && authorId !== undefined && (
                    <Link href={`/author/${authorId}`} className="text-decoration-none d-flex align-items-center gap-1.5 mb-1.5 hover-opacity" style={{ zIndex: 5 }}>
                        <img 
                            src={authorAvatar ? (authorAvatar.startsWith('http') ? authorAvatar : `/storage/avatars/${authorAvatar}`) : 'https://www.gravatar.com/avatar/?d=mp&s=20'} 
                            alt={authorName} 
                            className="rounded-circle object-fit-cover" 
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span className="text-secondary text-truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{authorName}</span>
                    </Link>
                )}
                
                {views !== undefined && <small className="text-secondary small mt-0.5"><i className="fa-solid fa-eye me-1 text-muted"></i>{views}x Dibaca</small>}
                {genre && <small className="text-secondary small mt-0.5">{genre}</small>}
            </div>
        </div>
    );
}