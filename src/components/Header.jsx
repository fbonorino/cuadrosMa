import { INSTAGRAM_WEB_URL, openInstagram } from '../lib/openInstagram'

export default function Header() {
  return (
    <header className="py-10 md:py-14 px-6 text-center border-b border-gray-100">
      <p className="font-sans text-[10px] md:text-[11px] text-gray-500 tracking-[0.5em] uppercase mb-3 md:mb-4">
        Galería Bellomo
      </p>
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-wide text-carbon mb-3 md:mb-4">
        Constanza Bellomo
      </h1>
      <p className="font-sans text-[10px] md:text-[11px] text-gray-500 tracking-[0.5em] uppercase mb-6 md:mb-7">
        Visual Artist
      </p>
      <a
        href={INSTAGRAM_WEB_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={openInstagram}
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
