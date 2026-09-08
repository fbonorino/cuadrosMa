import { useEffect, useCallback, useRef } from 'react'

const WHATSAPP_NUMBER = '5491160593598'

export default function Modal({ obras, selectedIndex, onNavigate, onClose }) {
  const obra = obras[selectedIndex]
  const touchStartX = useRef(null)

  const navigate = useCallback((dir) => {
    const next = selectedIndex + dir
    if (next >= 0 && next < obras.length) onNavigate(next)
  }, [selectedIndex, obras.length, onNavigate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') navigate(1)
    if (e.key === 'ArrowLeft') navigate(-1)
  }, [onClose, navigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) navigate(delta > 0 ? 1 : -1)
    touchStartX.current = null
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola! Vi el cuadro "${obra.titulo}" en Galería Bellomo y quería consultar por él.`
  )}`

  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < obras.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${obra.titulo}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm text-carbon hover:bg-white transition-colors duration-150 shadow"
        aria-label="Cerrar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev/next arrows */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(-1) }}
          className="flex fixed left-4 z-20 p-3 bg-white/90 backdrop-blur-sm text-carbon hover:bg-white transition-colors duration-150 shadow items-center justify-center"
          aria-label="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(1) }}
          className="flex fixed right-4 z-20 p-3 bg-white/90 backdrop-blur-sm text-carbon hover:bg-white transition-colors duration-150 shadow items-center justify-center"
          aria-label="Siguiente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div
        className="relative bg-canvas w-full h-full md:h-auto md:max-w-4xl md:max-h-[92vh] md:flex md:rounded-sm shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image panel */}
        <div className="md:w-[62%] h-[58dvh] md:h-auto md:max-h-[92vh] bg-gray-50 shrink-0 relative flex items-center justify-center overflow-hidden">
          <img
            key={obra.id}
            src={obra.imagen}
            alt={obra.titulo}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
          {/* Dot indicators — mobile only */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
            {obras.map((_, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${i === selectedIndex ? 'bg-carbon' : 'bg-black/20'}`}
                aria-label={`Ir a obra ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="md:w-[38%] md:p-10 md:flex md:flex-col md:justify-between md:gap-8">
          <div className="space-y-5 px-6 pt-7 pb-4 md:p-0">
            <h2 className="font-serif text-2xl md:text-3xl text-carbon leading-tight">
              {obra.titulo}
            </h2>
            {!obra.disponible && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-800 text-white text-[10px] font-sans tracking-[0.18em] uppercase">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                Vendido
              </span>
            )}
            <dl className="space-y-4 text-sm font-sans text-gray-500">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Técnica</dt>
                <dd className="text-carbon">{obra.tecnica}</dd>
              </div>
              {obra.medidas && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Medidas</dt>
                  <dd className="text-carbon">{obra.medidas}</dd>
                </div>
              )}
              {obra.descripcion && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Descripción</dt>
                  <dd className="text-carbon leading-relaxed">{obra.descripcion}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Sticky on mobile, normal flow on desktop */}
          <div className="sticky bottom-0 md:static px-6 pb-6 pt-4 md:p-0 bg-canvas md:bg-transparent border-t border-gray-100 md:border-0">
            {obra.disponible ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 md:py-3.5 px-6 bg-carbon text-canvas text-sm font-sans tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150"
              >
                <WhatsAppIcon />
                Consultar por WhatsApp
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2.5 w-full py-4 md:py-3.5 px-6 bg-gray-100 text-gray-400 text-sm font-sans tracking-wide cursor-default select-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                Esta obra ya no está disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
