// Provides SPA-like navigation by prefetching and replacing the page in-place.
// Combines the techniques used in GoogleChromeLabs/quicklink and @hotwired/turbo

const dom = document

// Used to detect anchor tags in the viewport.
let observer
const Observer = window.IntersectionObserver

// Used to detect same path navigation (hash change)
let currentPath = location.pathname

const conn = navigator.connection
const saveData = conn && (conn.saveData || /2g/.test(conn.effectiveType))

const toArray = Array.from

const queryAll = (selector, el = dom) =>
  toArray(el.querySelectorAll(selector))

const createElement = (tagName = 'link') =>
  dom.createElement(tagName)

const requestIdleCallback = window.requestIdleCallback || setTimeout

const normalizeURL = url =>
  new URL(url, location.href).pathname

const prefetchNow = (url, importance = 'high') =>
  fetch(url, { credentials: 'include', importance })

const prefetchWhenIdle = hasPrefetch()
  ? prefetchWithLinkTag
  : url => prefetchNow(url, 'low')

// Cache of URLs and Promises we've prefetched
const hasFetched = new Set()
hasFetched.add(normalizeURL(location.href))

function prefetch (url) {
  if (!saveData && !hasFetched.has(url)) {
    hasFetched.add(url)
    prefetchWhenIdle(url)
  }
}

if (Observer) {
  watchLinks()
  addEventListener('popstate', (e) => {
    if (currentPath !== location.pathname)
      replacePage(location.href, (e.state && e.state.scrollPosition) || 0)
  })
}

/**
 * Detect links in the viewport and prefetch them, and intercept clicks to them
 * to perform a turbolinks-style replacement of the page.
 */
function watchLinks () {
  window.__ILE_DISPOSE__ = new Map()
  observer?.disconnect()

  observer = new Observer((entries) => {
    entries.forEach(({ target: link, isIntersecting }) => {
      if (isIntersecting) {
        observer.unobserve(link)
        link.addEventListener('click', onLinkClick)
        prefetch(normalizeURL(link.href))
      }
    })
  })

  requestIdleCallback(() => {
    queryAll('a').forEach((link) => {
      const extMatch = link.pathname.match(/\.\w+$/)
      if ((!extMatch || extMatch[0] === '.html') && link.hostname === location.hostname)
        observer.observe(link)
    })
  })
}

function onLinkClick (e) {
  const link = e.target.closest('a')
  if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && event.which <= 1 && link.target !== '_blank') {
    const sameLocation = link.pathname === location.pathname
    const sameHash = link.hash === location.hash

    if (!sameLocation || sameHash)
      e.preventDefault()

    if (!sameLocation) {
      replacePage(link.href, 0, () => {
        history.replaceState({ scrollPosition: scrollY }, dom.title)
        history.pushState(null, '', link.href)
      })
    }
  }
}

function replacePage (url, scrollPosition, callback) {
  url = normalizeURL(url)
  prefetchNow(url).then(p => p.text()).then((html) => {
    callback?.()
    currentPath = location.pathname
    replaceHtml(html)
    scrollTo(0, scrollPosition)
    watchLinks()
  })
    .catch((e) => {
      console.error(e)
      location.href = url
    })
}

function replaceHtml (html) {
  const { head, body } = new DOMParser().parseFromString(html, 'text/html')

  const prevHead = dom.head
  queryAll(':not(link[rel="stylesheet"]):not(style)', prevHead).forEach(el => el.remove())

  const prevHeadHrefs = new Set(queryAll('link', prevHead).map(el => el.href))
  activateScripts(head)
  toArray(head.children).forEach((el) => {
    if (el.tagName !== 'LINK' || el.rel !== 'stylesheet' || !prevHeadHrefs.has(el.href))
      prevHead.appendChild(el)
  })

  toArray(__ILE_DISPOSE__.values()).forEach(fn => fn())
  dom.body.replaceWith(body)
  activateScripts(body)
}

function activateScripts (el) {
  dom.adoptNode(el)
  queryAll('script').forEach(activateScript)
}

function activateScript (el) {
  if (el.getAttribute('once') === null) {
    const script = createElement('script')

    toArray(el.attributes)
      .forEach(attr => script.setAttribute(attr.nodeName, attr.nodeValue))

    script.textContent = el.textContent

    el.replaceWith(script)
  }
}

function hasPrefetch (link) {
  link = createElement()
  return link.relList && link.relList.supports && link.relList.supports('prefetch')
}

function prefetchWithLinkTag (url, link) {
  link = createElement()
  link.rel = 'prefetch'
  link.href = url
  dom.head.appendChild(link)
}
