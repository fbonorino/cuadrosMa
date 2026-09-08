export default function Header() {
  return (
    <header className="py-8 md:py-12 px-6 text-center border-b border-gray-100">
      <p className="font-sans text-[11px] md:text-xs text-gray-400 tracking-[0.3em] uppercase mb-2 md:mb-3">
        Galería Bellomo
      </p>
      <h1 className="font-serif text-3xl md:text-5xl tracking-wide text-carbon mb-2 md:mb-3">
        Constanza Bellomo
      </h1>
      <p className="font-sans text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">
        Visual Artist
      </p>
      <p className="font-sans text-xs md:text-sm text-gray-500 max-w-md mx-auto mb-1 leading-relaxed">
        Hay originales y reproducciones de alta calidad disponibles en color y en blanco y negro. Consultar por muestras.
      </p>
      <p className="font-sans text-xs md:text-sm text-gray-400 max-w-md mx-auto mb-5 md:mb-6 leading-relaxed italic">
        Originals and high-quality reproductions available in color and black and white. Inquire for samples.
      </p>
      <a
        href="https://www.instagram.com/constanzabellomo/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-carbon transition-colors duration-200"
        aria-label="Instagram de Constanza Bellomo"
      >
        <InstagramIcon />
        <span className="font-sans">@constanzabellomo</span>
      </a>
    </header>
  )
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}
