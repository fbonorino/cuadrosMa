export default function Gallery({ obras, onSelect }) {
  return (
    <main className="px-4 py-8 md:px-10 md:py-14 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 md:gap-x-16 md:gap-y-16">
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
      <div className="overflow-hidden rounded-sm aspect-[2/3] bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06]">
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className={`w-full h-full object-cover will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.04] ${!obra.disponible ? 'brightness-[0.88]' : ''}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="font-serif text-lg md:text-xl text-carbon tracking-wide leading-snug">
          {obra.titulo}
        </p>
        {!obra.disponible && (
          <span className="shrink-0 font-sans text-[10px] text-red-800 tracking-[0.18em] uppercase">
            Vendido
          </span>
        )}
      </div>
      <p className="mt-1 font-sans text-xs text-gray-400 tracking-wide">
        {obra.tecnica}
        {obra.medidas && <>{' · '}{obra.medidas}</>}
      </p>
    </article>
  )
}
