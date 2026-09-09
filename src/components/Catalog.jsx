export default function Catalog({ obras, onSelect }) {
  return (
    <section id="catalogo" className="bg-carbon border-t border-white/10">
      <div className="px-4 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <span className="w-10 h-px bg-white/20 mb-5" aria-hidden="true" />
          <p className="font-sans text-[10px] md:text-[11px] text-gray-400 tracking-[0.5em] uppercase">
            Catálogo Completo
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {obras.map((obra, index) => (
            <CatalogCard key={obra.id} obra={obra} onSelect={() => onSelect(index)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CatalogCard({ obra, onSelect }) {
  return (
    <article
      className="group cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Ver detalle de ${obra.titulo}`}
    >
      <div className="relative overflow-hidden bg-gray-50 shadow-[0_6px_24px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-shadow duration-300 ease-out group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        {!obra.disponible && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-red-800 text-white text-[10px] font-sans font-semibold tracking-[0.16em] uppercase shadow-md">
            Vendido
          </span>
        )}
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className={`w-full aspect-square object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.04] ${!obra.disponible ? 'brightness-[0.88]' : ''}`}
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 ease-out" />
      </div>
      <div className="mt-3.5 flex flex-col items-center text-center gap-1">
        <p className="font-sans text-xs md:text-sm font-semibold text-canvas tracking-[0.06em] uppercase leading-snug">
          {obra.titulo}
        </p>
        <p className="font-sans text-[11px] text-gray-500 tracking-wide">
          {obra.tecnica}
          {obra.medidas && <>{' · '}{obra.medidas}</>}
        </p>
      </div>
    </article>
  )
}
