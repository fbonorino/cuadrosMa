const INSTAGRAM_USERNAME = 'constanzabellomo'
export const INSTAGRAM_WEB_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`

const INSTAGRAM_APP_URL = `instagram://user?username=${INSTAGRAM_USERNAME}`
const APP_OPEN_TIMEOUT = 1500

// On mobile, tries the Instagram app via its URL scheme first. If the app
// isn't installed, the scheme navigation fails silently and the page stays
// visible — in that case we fall back to the web profile after a short
// delay. On desktop there's no app to deep-link to, so it just opens the
// web profile directly.
export function openInstagram(e) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (!isMobile) return

  e.preventDefault()

  let appOpened = false
  const onVisibilityChange = () => {
    if (document.hidden) appOpened = true
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  window.location.href = INSTAGRAM_APP_URL

  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (!appOpened) {
      window.location.href = INSTAGRAM_WEB_URL
    }
  }, APP_OPEN_TIMEOUT)
}
