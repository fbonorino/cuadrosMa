export default function Gallery({ obras, onSelect }) {
  return (
    <main className="px-4 py-8 md:px-10 md:py-14 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-16 md:gap-x-16 md:gap-y-24">
        {obras.map((obra, index) => (
          <GalleryCard
            key={obra.id}
            obra={obra}
            onSelect={() => onSelect(index)}
            featured={index % 3 === 0}
          />
        ))}
      </div>
    </main>
  )
}

function GalleryCard({ obra, onSelect, featured }) {
  return (
    <article
      className={`group cursor-pointer ${featured ? 'sm:col-span-2' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Ver detalle de ${obra.titulo}`}
    >
      <div
        className={`overflow-hidden bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06] ${
          featured ? 'aspect-[16/9]' : 'aspect-[3/4]'
        }`}
      >
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className={`w-full h-full object-cover will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.03] ${!obra.disponible ? 'brightness-[0.88]' : ''}`}
          loading="lazy"
          decoding="async"
        />
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
