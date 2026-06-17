export default function Book({ id, title, genre, views, cover }: { id: number; title: string; genre?: string; views?: number; cover?: string | null }) {
    const coverUrl = cover
        ? (cover.startsWith('http') ? cover : `/storage/covers/${cover}`)
        : `https://picsum.photos/300/400?random=${id + 10}`;

    return (
        <div className="col" key={id}>
            <div className="position-relative rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '3/4' }}>
                <img src={coverUrl} alt={title} className="w-100 h-100 object-fit-cover" />
            </div>
            <h6 className="fw-bold mb-0 text-truncate text-dark">{title}</h6>
            {views && <small className="text-secondary">{views}x Dibaca</small>}
            {genre && <small className="text-secondary">{genre}</small>}
        </div>
    )
}