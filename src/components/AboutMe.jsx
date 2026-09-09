import { useCallback, useEffect, useRef, useState } from 'react'

const PARRAFOS = [
  'Soy Constanza Bellomo, artista plástica por intuición.',
  'Hace un año, en la mitad de la vida, convertí mi pasión por la pintura en un emprendimiento.',
  'A veces algo te incomoda tanto que llega un momento en que ya no podés seguir postergándolo. A mí me pasó con la pintura.',
  'Y acá estoy: haciendo, por fin, lo que siempre me apasionó.',
]

const PHOTOS = [
  { src: '/images/constanza-retrato.jpg', alt: 'Retrato de Constanza Bellomo' },
  { src: '/images/constanza-taller.jpg', alt: 'Constanza Bellomo pintando en su taller' },
]

function useInViewOnce(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

export default function AboutMe() {
  const [imagesRef, imagesInView] = useInViewOnce()
  const [lightbox, setLightbox] = useState(null)

  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (!lightbox) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightbox, closeLightbox])

  return (
    <section className="bg-canvas px-4 pt-16 pb-[100px] md:px-10 md:pt-24 md:pb-[150px] lg:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <span className="w-10 h-px bg-gray-300 mb-5" aria-hidden="true" />
          <p className="font-sans text-[10px] md:text-[11px] text-gray-400 tracking-[0.5em] uppercase">
            Sobre Mí
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div ref={imagesRef} className="grid grid-cols-2 gap-3 md:gap-4 md:w-1/2 shrink-0">
            {PHOTOS.map((photo, index) => (
              <div
                key={photo.src}
                className={`transition-all duration-700 ease-out ${
                  imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: imagesInView ? `${index * 120}ms` : '0ms' }}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(photo)}
                  className="block w-full aspect-[3/4] overflow-hidden bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06] transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-[0_16px_40px_rgba(0,0,0,0.20)] focus:outline-none focus-visible:ring-2 focus-visible:ring-carbon focus-visible:ring-offset-2"
                  aria-label={`Ampliar ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="md:w-1/2">
            <div className="max-w-[60ch] mx-auto md:mx-0 flex flex-col gap-5">
              {PARRAFOS.map((parrafo, index) => (
                <p
                  key={index}
                  className="font-sans text-sm md:text-base text-gray-600 leading-loose"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
            onClick={closeLightbox}
            className="fixed top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm text-carbon hover:bg-white transition-colors duration-150 shadow"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
