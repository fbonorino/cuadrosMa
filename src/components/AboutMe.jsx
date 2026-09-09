import { useEffect, useRef, useState } from 'react'

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
          <div ref={imagesRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4 md:w-1/2 shrink-0">
            {PHOTOS.map((photo, index) => (
              <div
                key={photo.src}
                className={`group transition-[opacity,transform] duration-700 ease-out ${
                  imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: imagesInView ? `${index * 120}ms` : '0ms' }}
              >
                <div className="w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06] transition-transform duration-300 ease-out group-hover:scale-[1.06]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="md:w-1/2">
            <div className="max-w-[60ch] mx-auto md:mx-0 flex flex-col gap-5">
              {PARRAFOS.map((parrafo, index) => (
                <p
                  key={index}
                  className="font-sans text-base md:text-lg text-gray-700 leading-relaxed"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
