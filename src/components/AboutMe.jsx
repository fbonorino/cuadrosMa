const PARRAFOS = [
  'Soy Constanza Bellomo, artista plástica por intuición.',
  'Hace un año, en la mitad de la vida, convertí mi pasión por la pintura en un emprendimiento.',
  'A veces algo te incomoda tanto que llega un momento en que ya no podés seguir postergándolo. A mí me pasó con la pintura.',
  'Y acá estoy: haciendo, por fin, lo que siempre me apasionó.',
]

export default function AboutMe() {
  return (
    <section className="px-4 py-16 md:px-10 md:py-24 lg:px-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-[11px] md:text-xs text-gray-400 tracking-[0.3em] uppercase text-center mb-10 md:mb-14">
          Sobre Mí
        </p>
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-14">
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:w-1/2 shrink-0">
            <img
              src="/images/constanza-retrato.jpg"
              alt="Retrato de Constanza Bellomo"
              className="w-full aspect-[3/4] object-cover bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06]"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/images/constanza-taller.jpg"
              alt="Constanza Bellomo pintando en su taller"
              className="w-full aspect-[3/4] object-cover bg-gray-50 shadow-[0_2px_14px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06] mt-6"
              loading="lazy"
              decoding="async"
            />
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
    </section>
  )
}
