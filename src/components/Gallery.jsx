export default function Gallery({ obras, onSelect }) {
  return (
    <main className="px-4 py-8 md:px-8 md:py-12 lg:px-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {obras.map((obra, index) => (
          <GalleryCard key={obra.id} obra={obra} onSelect={() => onSelect(index)} />
        ))}
      </div>
    </main>
  )
}

function GalleryCard({ obra, onSelect }) {
  return (
    <article
      className="group cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Ver detalle de ${obra.titulo}`}
    >
      <div className="overflow-hidden aspect-[4/5] bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06]">
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className="w-full h-full object-cover will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="mt-3 font-serif text-base md:text-sm text-carbon tracking-wide leading-snug">
        {obra.titulo}
      </p>
    </article>
  )
}
