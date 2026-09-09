export default function Gallery({ obras, onSelect }) {
  return (
    <section className="bg-carbon">
      <main className="px-4 py-20 md:px-10 md:py-28 lg:px-20">
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <span className="w-10 h-px bg-white/20 mb-5" aria-hidden="true" />
          <p className="font-sans text-[10px] md:text-[11px] text-gray-400 tracking-[0.5em] uppercase">
            Obras
          </p>
        </div>
        <div className="flex flex-col gap-16 md:gap-24 max-w-4xl mx-auto">
          {obras.map((obra, index) => (
            <GalleryCard key={obra.id} obra={obra} onSelect={() => onSelect(index)} />
          ))}
        </div>
      </main>
    </section>
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
      <div className="relative overflow-hidden bg-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-shadow duration-300 ease-out group-hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
        {!obra.disponible && (
          <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-red-800 text-white text-[11px] font-sans font-semibold tracking-[0.18em] uppercase shadow-md">
            Vendido
          </span>
        )}
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
        <p className="font-sans text-sm md:text-base font-semibold text-canvas tracking-[0.08em] uppercase leading-snug">
          {obra.titulo}
        </p>
        <p className="font-sans text-xs text-gray-500 tracking-wide">
          {obra.tecnica}
          {obra.medidas && <>{' · '}{obra.medidas}</>}
        </p>
      </div>
    </article>
  )
}
