import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import './lightbox.css'

const WHATSAPP_NUMBER = '5491160593598'
const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Fallback bar heights until the real bar is measured (mobile stacks title +
// CTA in two rows). The measured height includes the iOS safe-area inset.
const DEFAULT_BAR_HEIGHT = { mobile: 124, desktop: 80 }
// Same curve as .obra-panel in lightbox.css, so the image shift and the panel
// move in lockstep.
const SPRING = 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1)'
// Mobile scroll reveal: how far the artwork recedes once the ficha is fully
// scrolled in (mirrors the obra-recede keyframes in lightbox.css).
const RECEDE = { translateVh: -22, scale: 0.85, opacity: 0.8 }

const DISPONIBILIDAD_TEXTO =
  'Se encuentran disponibles obras originales y reproducciones de alta calidad, en color y en blanco y negro. Consulte por muestras.'

const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()')

function getPadding(viewportWidth, barHeight) {
  const mobile = viewportWidth < MOBILE_BREAKPOINT
  const bar = barHeight ?? (mobile ? DEFAULT_BAR_HEIGHT.mobile : DEFAULT_BAR_HEIGHT.desktop)
  return mobile
    ? { top: 56, bottom: bar, left: 0, right: 0 }
    : { top: 64, bottom: bar + 16, left: 80, right: 80 }
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function Lightbox({ obras, openIndex, onClose }) {
  const lightboxRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const barHeightRef = useRef(null)

  // The custom UI element PhotoSwipe creates on open; React renders the bar
  // and desktop panel into it through a portal, so they live inside
  // PhotoSwipe's DOM (focus trap) while keeping the site's Tailwind styling.
  const [uiEl, setUiEl] = useState(null)
  const [pswp, setPswp] = useState(null)
  const [currIndex, setCurrIndex] = useState(0)
  // Mobile: one native scroll container per PhotoSwipe slide, keyed by slide
  // index, each rendered into through its own portal.
  const [scrollers, setScrollers] = useState({})
  // Mobile: whether each slide is scrolled to its ficha (drives the bar button).
  const [fichaShown, setFichaShown] = useState({})

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      // Real pixel dimensions from obras.js, so PhotoSwipe lays out each slide
      // at its final size before the image loads (no layout jumps).
      dataSource: obras.map((obra) => ({
        src: obra.imagen,
        width: obra.imagenAncho,
        height: obra.imagenAlto,
        alt: obra.titulo,
      })),
      pswpModule: () => import('photoswipe'),
      // Fully opaque, so the site underneath never ghosts through.
      bgOpacity: 1,
      showHideAnimationType: 'fade',
      imageClickAction: 'zoom',
      doubleTapAction: 'zoom',
      // Vertical drags belong to the ficha scroll, not to closing the viewer.
      closeOnVerticalDrag: false,
      // Images are at most 1600px wide, so 1:1 is barely a zoom on large
      // screens; zoom relative to the fitted size instead.
      secondaryZoomLevel: (zoomLevel) => zoomLevel.fit * 2.5,
      maxZoomLevel: (zoomLevel) => zoomLevel.fit * 4,
      preload: [1, 2],
      paddingFn: (viewportSize) => getPadding(viewportSize.x, barHeightRef.current),
      closeTitle: 'Cerrar',
      zoomTitle: 'Zoom',
      arrowPrevTitle: 'Anterior',
      arrowNextTitle: 'Siguiente',
      errorMsg: 'No se pudo cargar la imagen.',
    })

    lightbox.on('uiRegister', () => {
      lightbox.pswp.ui.registerElement({
        name: 'obra-ui',
        // 'root' keeps it outside PhotoSwipe's gesture area, so taps inside
        // the bar/panel never pan, zoom or change the slide.
        appendTo: 'root',
        onInit: (el, instance) => {
          // Not pswp__hide-on-close: the bar must stay visible when a tap
          // toggles PhotoSwipe's own controls. We fade it out on close instead.
          el.classList.remove('pswp__hide-on-close')
          el.style.position = 'relative'
          el.style.zIndex = '10'
          instance.element.style.setProperty('--pswp-bg', '#111')
          instance.element.classList.toggle('obra-sda', supportsScrollTimeline())
          instance.on('close', () => {
            el.style.transition = 'opacity 250ms ease'
            el.style.opacity = '0'
          })
          setCurrIndex(instance.currIndex)
          setPswp(instance)
          setUiEl(el)
        },
      })
    })

    // Mobile scroll containers: attach one to each slide's holder whenever
    // PhotoSwipe (re)fills it, drop it when the slide is destroyed.
    lightbox.on('afterSetContent', ({ slide }) => {
      if (!slide.holderElement) return
      if (!slide.obraScroller) {
        slide.obraScroller = document.createElement('div')
        slide.obraScroller.className = 'obra-scroller'
      }
      slide.holderElement.classList.add('obra-holder')
      slide.holderElement.appendChild(slide.obraScroller)
      const { index, obraScroller } = slide
      setScrollers((prev) => (prev[index] === obraScroller ? prev : { ...prev, [index]: obraScroller }))
    })

    lightbox.on('slideDestroy', ({ slide }) => {
      const scroller = slide.obraScroller
      if (!scroller) return
      scroller.remove()
      setScrollers((prev) => {
        if (prev[slide.index] !== scroller) return prev
        const next = { ...prev }
        delete next[slide.index]
        return next
      })
    })

    lightbox.on('change', () => {
      const instance = lightbox.pswp
      setCurrIndex(instance.currIndex)
      // Every slide starts at the artwork, never mid-ficha.
      const scroller = instance.currSlide?.obraScroller
      if (scroller) scroller.scrollTop = 0
    })

    lightbox.on('slideDeactivate', ({ slide }) => {
      if (slide.obraScroller) slide.obraScroller.scrollTop = 0
    })

    // Zoomed image → lock the ficha scroll (and bring the artwork back into
    // view) so one-finger drags pan the image; unlock when zoom ends.
    lightbox.on('zoomPanUpdate', ({ slide }) => {
      const scroller = slide.obraScroller
      if (!scroller) return
      const zoomed = slide.currZoomLevel > slide.zoomLevels.initial * 1.01
      if (zoomed && scroller.scrollTop) scroller.scrollTop = 0
      scroller.classList.toggle('is-zoomed', zoomed)
    })

    // Taps on the ficha text are reading, not zooming/toggling controls.
    const ignoreTapsOnFicha = (e) => {
      if (e.originalEvent?.target?.closest?.('.obra-ficha')) e.preventDefault()
    }
    lightbox.on('tapAction', ignoreTapsOnFicha)
    lightbox.on('doubleTapAction', ignoreTapsOnFicha)

    lightbox.on('destroy', () => {
      setUiEl(null)
      setPswp(null)
      setScrollers({})
      setFichaShown({})
      onCloseRef.current()
    })

    lightbox.init()
    lightboxRef.current = lightbox
    return () => {
      lightbox.destroy()
      lightboxRef.current = null
    }
  }, [obras])

  useEffect(() => {
    const lightbox = lightboxRef.current
    if (openIndex === null || !lightbox || lightbox.pswp) return
    lightbox.loadAndOpen(openIndex)
  }, [openIndex])

  const handleFichaShown = useCallback((index, shown) => {
    setFichaShown((prev) => (prev[index] === shown ? prev : { ...prev, [index]: shown }))
  }, [])

  if (!uiEl || !pswp) return null

  return (
    <>
      {createPortal(
        <ObraUI
          pswp={pswp}
          obra={obras[currIndex]}
          index={currIndex}
          fichaShown={!!fichaShown[currIndex]}
          barHeightRef={barHeightRef}
        />,
        uiEl
      )}
      {Object.entries(scrollers).map(([index, el]) =>
        createPortal(
          <FichaScroller
            obra={obras[index]}
            index={Number(index)}
            isActive={Number(index) === currIndex}
            onFichaShown={handleFichaShown}
          />,
          el,
          `scroller-${index}`
        )
      )}
    </>
  )
}

// --- Mobile: per-slide scroll reveal ---------------------------------------

function FichaScroller({ obra, index, isActive, onFichaShown }) {
  const stageRef = useRef(null)
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)

  useEffect(() => {
    const scroller = stageRef.current?.parentElement
    if (!scroller) return
    const useFallback = !supportsScrollTimeline()
    let frame = 0

    const update = () => {
      frame = 0
      const max = scroller.scrollHeight - scroller.clientHeight
      const top = scroller.scrollTop
      const progress = max > 0 ? Math.min(Math.max(top / max, 0), 1) : 0
      scroller.classList.toggle('is-scrolled', top > 8)
      scroller.classList.toggle('is-revealed', top > 24)
      onFichaShown(index, progress > 0.5)

      // No scroll-driven animations: drive the artwork's recede from here
      // (transform + opacity only, same values as the CSS keyframes).
      if (useFallback) {
        const img = scroller.parentElement?.querySelector('.pswp__img:not(.pswp__img--placeholder)')
        if (!img) return
        if (progress === 0) {
          img.style.transform = ''
          img.style.opacity = ''
          img.style.willChange = ''
          return
        }
        img.style.willChange = 'transform, opacity'
        img.style.opacity = String(1 - (1 - RECEDE.opacity) * progress)
        img.style.transform = reducedMotion
          ? ''
          : `translateY(${(RECEDE.translateVh * window.innerHeight * progress) / 100}px) scale(${1 - (1 - RECEDE.scale) * progress})`
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [index, onFichaShown, reducedMotion])

  return (
    <>
      {/* (a) The artwork: an empty, full-height stage — PhotoSwipe's own image
          shows through underneath and keeps its zoom/pinch/swipe. */}
      <div ref={stageRef} className="obra-stage" aria-hidden="true">
        <div className="obra-hint flex flex-col items-center gap-1 text-white/70 font-sans text-xs tracking-wide pointer-events-none">
          Deslizá para ver la ficha
          <svg className="obra-hint-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* (b) The ficha */}
      <section
        id={`obra-ficha-${index}`}
        aria-labelledby={`obra-ficha-titulo-${index}`}
        tabIndex={isActive ? 0 : -1}
        className="obra-ficha relative bg-canvas text-carbon font-sans rounded-t-2xl px-6 pt-7 outline-none shadow-[0_-8px_30px_rgba(0,0,0,0.3)]"
      >
        <h2
          id={`obra-ficha-titulo-${index}`}
          tabIndex={-1}
          className="obra-ficha-block font-serif text-2xl leading-tight outline-none"
          style={{ '--i': 0 }}
        >
          {obra.titulo}
        </h2>
        <FichaContent obra={obra} startIndex={1} className="mt-5" />
      </section>
    </>
  )
}

// --- Bottom bar + desktop panel ---------------------------------------------

function ObraUI({ pswp, obra, index, fichaShown, barHeightRef }) {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const [open, setOpenState] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef(null)
  const barRef = useRef(null)
  // The <img> currently shifted to make room for the desktop panel.
  const shiftedImgRef = useRef(null)

  // --- Desktop image shift --------------------------------------------------
  // While the panel is open, the current artwork shrinks/moves (transform
  // only) into the area the panel leaves free.

  const clearImageShift = useCallback(() => {
    const img = shiftedImgRef.current
    if (!img) return
    img.style.transition = 'none'
    img.style.transform = ''
    img.style.willChange = ''
    shiftedImgRef.current = null
  }, [])

  const applyImageShift = useCallback((shifted, animate) => {
    const slide = pswp.currSlide
    const img = slide?.content?.element
    if (!slide || !img || !slide.panAreaSize) return
    if (shiftedImgRef.current && shiftedImgRef.current !== img) clearImageShift()

    // Rest geometry of the image at its fitted zoom, derived from PhotoSwipe's
    // own layout (not measured from the DOM, which may be mid-slide-transition).
    const padding = getPadding(pswp.viewportSize.x, barHeightRef.current)
    const width = slide.width * slide.zoomLevels.initial
    const height = slide.height * slide.zoomLevels.initial
    const centerX = padding.left + slide.panAreaSize.x / 2
    const centerY = padding.top + slide.panAreaSize.y / 2
    // The img lives inside PhotoSwipe's zoom wrapper, which may itself be
    // scaled; translations are expressed in the img's local pixels.
    const localScale = img.offsetWidth ? width / img.offsetWidth : 1

    const panelWidth = panelRef.current?.offsetWidth ?? 0
    const bar = barHeightRef.current ?? 0
    const box = {
      left: 80,
      right: pswp.viewportSize.x - panelWidth - 32,
      top: 64,
      bottom: pswp.viewportSize.y - bar - 16,
    }
    const boxWidth = Math.max(box.right - box.left, 1)
    const boxHeight = Math.max(box.bottom - box.top, 1)
    const scale = Math.min(1, boxWidth / width, boxHeight / height)
    const dx = box.left + boxWidth / 2 - centerX
    const dy = box.top + boxHeight / 2 - centerY

    img.style.transition = animate && !reducedMotion ? SPRING : 'none'
    img.style.transformOrigin = '50% 50%'
    img.style.willChange = 'transform'
    img.style.transform = shifted
      ? `translate3d(${dx / localScale}px, ${dy / localScale}px, 0) scale(${scale})`
      : ''
    shiftedImgRef.current = img
  }, [pswp, barHeightRef, reducedMotion, clearImageShift])

  const applyPanelPosition = useCallback((isOpen) => {
    const panel = panelRef.current
    if (panel) panel.style.transform = isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)'
  }, [])

  const setOpen = useCallback((next, { fromHistory = false } = {}) => {
    const changed = next !== openRef.current
    openRef.current = next
    setOpenState(next)

    if (next) {
      // Return to the fitted zoom first so the shift starts from the rest layout.
      const slide = pswp.currSlide
      if (slide && slide.currZoomLevel !== slide.zoomLevels.initial) {
        slide.zoomTo(slide.zoomLevels.initial, undefined, 0)
      }
    }
    applyPanelPosition(next)
    applyImageShift(next, true)

    if (!changed) return
    if (next) {
      // "Back" closes the panel instead of leaving the page.
      if (!fromHistory) window.history.pushState({ ...window.history.state, obraFicha: true }, '')
    } else if (!fromHistory && window.history.state?.obraFicha) {
      window.history.back()
    }
  }, [pswp, applyPanelPosition, applyImageShift])

  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  // Mobile "Ver ficha": scroll the current slide to its ficha (or back to the
  // artwork) and move focus there, so keyboard/screen-reader users reach it.
  const toggleMobileFicha = () => {
    const scroller = pswp.currSlide?.obraScroller
    if (!scroller) return
    const behavior = reducedMotion ? 'auto' : 'smooth'
    if (fichaShown) {
      scroller.scrollTo({ top: 0, behavior })
    } else {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior })
      document.getElementById(`obra-ficha-titulo-${index}`)?.focus({ preventScroll: true })
    }
  }

  const toggle = () => (isMobile ? toggleMobileFicha() : setOpen(!openRef.current))
  const expanded = isMobile ? fichaShown : open

  // Focus moves into the panel once it has rendered as open (no longer inert).
  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true })
  }, [open])

  // Closed position before first paint; the panel never stays open across a
  // breakpoint change.
  useLayoutEffect(() => {
    if (openRef.current) setOpenRef.current(false)
    applyPanelPosition(false)
  }, [isMobile, applyPanelPosition])

  // Bar height → CSS var for the panel/ficha offsets + PhotoSwipe padding.
  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => {
      const height = bar.offsetHeight
      if (height === barHeightRef.current) return
      barHeightRef.current = height
      pswp.element?.style.setProperty('--obra-bar-h', `${height}px`)
      pswp.updateSize(true)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [pswp, barHeightRef])

  // PhotoSwipe events that must respect the desktop panel state.
  useEffect(() => {
    const onPointerDown = (e) => {
      // Clicking the image while the panel is open just closes the panel.
      if (!openRef.current) return
      // PhotoSwipe's own buttons (arrows, zoom, close) keep working.
      if (e.originalEvent.target.closest?.('.pswp__button')) return
      e.preventDefault()
      setOpen(false)
    }
    const onWheel = (e) => {
      if (openRef.current) e.preventDefault()
    }
    const onKeydown = (e) => {
      // Escape closes the panel first, then (on a second press) the viewer.
      if (e.originalEvent.key === 'Escape' && openRef.current) {
        e.preventDefault()
        setOpen(false)
      }
    }
    const onChange = () => {
      // Arrow keys/buttons still navigate with the panel open: the ficha
      // updates in place and the new slide takes the shifted layout.
      clearImageShift()
      if (openRef.current) applyImageShift(true, false)
    }
    const onResize = () => {
      if (!openRef.current) return
      clearImageShift()
      applyImageShift(true, false)
    }
    pswp.on('pointerDown', onPointerDown)
    pswp.on('wheel', onWheel)
    pswp.on('keydown', onKeydown)
    pswp.on('change', onChange)
    pswp.on('resize', onResize)
    return () => {
      pswp.off('pointerDown', onPointerDown)
      pswp.off('wheel', onWheel)
      pswp.off('keydown', onKeydown)
      pswp.off('change', onChange)
      pswp.off('resize', onResize)
    }
  }, [pswp, setOpen, applyImageShift, clearImageShift])

  // Browser "back" closes only the panel. If the viewer itself closes with
  // the panel open, drop the history entry we pushed.
  useEffect(() => {
    const onPopState = () => {
      if (openRef.current) setOpenRef.current(false, { fromHistory: true })
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      if (openRef.current && window.history.state?.obraFicha) {
        openRef.current = false
        window.history.back()
      }
    }
  }, [])

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola! Vi el cuadro "${obra.titulo}" en Galería Bellomo y quería consultar por él.`
  )}`

  return (
    <>
      {/* Desktop: side panel sliding in from the right, below PhotoSwipe's
          top bar so its close/zoom buttons stay reachable */}
      {!isMobile && (
        <section
          ref={panelRef}
          id="obra-ficha-panel"
          tabIndex={-1}
          aria-label={`Ficha de ${obra.titulo}`}
          inert={open ? undefined : ''}
          className={`obra-panel fixed top-[60px] right-0 z-20 w-[min(420px,42vw)] overflow-y-auto overscroll-contain bg-canvas text-carbon font-sans shadow-2xl outline-none ${open ? 'is-open' : ''}`}
        >
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="font-serif text-3xl leading-tight">{obra.titulo}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-2 -mt-1 p-2 text-gray-500 hover:text-carbon transition-colors duration-150"
                aria-label="Cerrar ficha"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FichaContent obra={obra} />
          </div>
        </section>
      )}

      {/* Bottom bar — always visible */}
      <div
        ref={barRef}
        className="fixed inset-x-0 bottom-0 z-30 bg-canvas text-carbon font-sans border-t border-black/5"
      >
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-8 md:py-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center justify-between gap-4 min-w-0 md:flex-1">
            <div className="min-w-0">
              <p className="font-serif text-lg md:text-2xl leading-tight truncate">{obra.titulo}</p>
              <p className="mt-0.5 text-xs text-gray-500 tracking-wide truncate">
                {obra.medidas || obra.tecnica}
                {!obra.disponible && ' · Vendido'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls={isMobile ? `obra-ficha-${index}` : 'obra-ficha-panel'}
              className="shrink-0 px-3 py-2 md:px-5 md:py-3 border border-carbon/20 text-xs md:text-sm tracking-wide hover:border-carbon transition-colors duration-150"
            >
              {expanded ? (isMobile ? 'Ver obra' : 'Cerrar ficha') : 'Ver ficha'}
            </button>
          </div>
          {obra.disponible ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 shrink-0 py-3 px-6 bg-carbon text-canvas text-sm tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150"
            >
              <WhatsAppIcon />
              Consultar por WhatsApp
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2.5 shrink-0 py-3 px-6 bg-gray-100 text-gray-400 text-sm tracking-wide cursor-default select-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              Esta obra ya no está disponible
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function FichaContent({ obra, startIndex = 0, className = '' }) {
  const blocks = [
    { label: 'Técnica', value: obra.tecnica },
    obra.medidas && { label: 'Medidas', value: obra.medidas },
    obra.descripcion && { label: 'Descripción', value: obra.descripcion, long: true },
    { label: 'Disponibilidad', value: DISPONIBILIDAD_TEXTO, long: true },
  ].filter(Boolean)

  return (
    <div className={className}>
      {!obra.disponible && (
        <span className="obra-ficha-block mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-red-800 text-white text-[10px] tracking-[0.18em] uppercase" style={{ '--i': startIndex }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          Vendido
        </span>
      )}
      <dl className="space-y-4 text-sm text-gray-500">
        {blocks.map((block, i) => (
          <div key={block.label} className="obra-ficha-block" style={{ '--i': startIndex + i + 1 }}>
            <dt className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{block.label}</dt>
            <dd className={`text-carbon ${block.long ? 'leading-relaxed' : ''}`}>{block.value}</dd>
          </div>
        ))}
      </dl>
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
