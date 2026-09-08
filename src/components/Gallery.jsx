export default function Gallery({ obras, onSelect }) {
  return (
    <main className="px-4 py-10 md:px-8 lg:px-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {obras.map((obra) => (
          <GalleryCard key={obra.id} obra={obra} onSelect={onSelect} />
        ))}
      </div>
    </main>
  )
}

function GalleryCard({ obra, onSelect }) {
  return (
    <article
      className="group cursor-pointer"
      onClick={() => onSelect(obra)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(obra)}
      aria-label={`Ver detalle de ${obra.titulo}`}
    >
      <div className="overflow-hidden aspect-[4/5] bg-gray-50">
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className="w-full h-full object-cover will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="mt-2 font-serif text-sm text-carbon tracking-wide leading-snug">
        {obra.titulo}
      </p>
    </article>
  )
}
