export default function Gallery({ obras, onSelect }) {
  return (
    <main className="px-4 py-8 md:px-10 md:py-14 lg:px-20">
      <div className="columns-1 sm:columns-2 gap-x-10 md:gap-x-16">
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
      className="group cursor-pointer break-inside-avoid mb-16 md:mb-24"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Ver detalle de ${obra.titulo}`}
    >
      <div className="relative overflow-hidden bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06] transition-shadow duration-300 ease-out group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className={`w-full h-auto block will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.04] ${!obra.disponible ? 'brightness-[0.88]' : ''}`}
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 ease-out" />
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-sans tracking-[0.14em] uppercase text-carbon opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Ver
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center text-center gap-1.5">
        <p className="font-sans text-sm md:text-base font-semibold text-carbon tracking-[0.08em] uppercase leading-snug">
          {obra.titulo}
        </p>
        <p className="font-sans text-xs text-gray-400 tracking-wide">
          {obra.tecnica}
          {obra.medidas && <>{' · '}{obra.medidas}</>}
        </p>
        <p
          className={`font-sans text-[10px] tracking-[0.2em] uppercase ${
            obra.disponible ? 'text-gray-400' : 'text-red-800'
          }`}
        >
          {obra.disponible ? 'Disponible' : 'Vendido'}
        </p>
      </div>
    </article>
  )
}
