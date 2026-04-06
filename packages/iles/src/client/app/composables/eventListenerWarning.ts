// Dev-only runtime support for detecting event listeners outside islands.
//
// When an event handler fires on an element that is NOT inside an <ile-root>,
// it means the handler won't work in production (where non-island content is
// static HTML with no JavaScript).
//
// This module:
// 1. Exposes window.__iles_wrap_listener used by the compiler transform
// 2. Shows console.error with actionable info
// 3. Renders a persistent warning overlay

interface Warning {
  eventName: string
  source: string
  element: string
}

const warned = new Set<string>()
const warnings: Warning[] = []
let overlayEl: HTMLElement | null = null

function wrapListener (handler: any, eventName: string, source: string) {
  return function wrappedHandler (this: any, ...args: any[]) {
    const result = typeof handler === 'function' ? handler.apply(this, args) : handler

    const event = args[0]
    if (event instanceof Event) {
      const el = (event.currentTarget || event.target) as Element | null
      if (el && !el.closest('ile-root')) {
        const key = `${source}::${eventName}`
        if (!warned.has(key)) {
          warned.add(key)
          const tagName = el.tagName.toLowerCase()

          console.error(
            `[iles] Event "${eventName}" on <${tagName}> in ${source} is outside an island.\n`
            + 'This handler will NOT work in production because non-island content is static HTML.\n'
            + 'Fix: wrap the interactive part in a component with a client: directive (e.g. client:load).\n'
            + 'Docs: https://iles-docs.netlify.app/guide/hydration',
          )

          warnings.push({ eventName, source, element: `<${tagName}>` })
          renderOverlay()
        }
      }
    }

    return result
  }
}

function renderOverlay () {
  if (!overlayEl) {
    overlayEl = document.createElement('div')
    overlayEl.id = 'iles-event-warning-overlay'
    document.body.appendChild(overlayEl)
  }

  const count = warnings.length
  const details = warnings
    .map(w => `<li><code>${w.eventName}</code> on <code>${w.element}</code> in <code>${w.source}</code></li>`)
    .join('')

  overlayEl.innerHTML = `
    <style>
      #iles-event-warning-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        background: #FEF3CD;
        color: #664D03;
        border-bottom: 2px solid #FFE69C;
        padding: 8px 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      #iles-event-warning-overlay summary {
        cursor: pointer;
        font-weight: 600;
        user-select: none;
      }
      #iles-event-warning-overlay ul {
        margin: 6px 0 2px;
        padding-left: 20px;
      }
      #iles-event-warning-overlay li {
        margin: 3px 0;
      }
      #iles-event-warning-overlay code {
        background: rgba(0,0,0,0.07);
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 12px;
      }
      #iles-event-warning-overlay .dismiss {
        float: right;
        background: none;
        border: 1px solid #C6A700;
        border-radius: 3px;
        color: #664D03;
        cursor: pointer;
        padding: 2px 8px;
        font-size: 12px;
      }
      #iles-event-warning-overlay .dismiss:hover {
        background: rgba(0,0,0,0.05);
      }
      @media (prefers-color-scheme: dark) {
        #iles-event-warning-overlay {
          background: #332701;
          color: #FFE69C;
          border-bottom-color: #664D03;
        }
        #iles-event-warning-overlay code {
          background: rgba(255,255,255,0.1);
        }
        #iles-event-warning-overlay .dismiss {
          border-color: #664D03;
          color: #FFE69C;
        }
      }
    </style>
    <details open>
      <summary>
        ⚠ ${count} event listener${count > 1 ? 's' : ''} outside islands (won't work in production)
        <button class="dismiss" onclick="this.closest('#iles-event-warning-overlay').remove()">Dismiss</button>
      </summary>
      <ul>${details}</ul>
    </details>
  `
}

export function installEventListenerWarning () {
  ;(window as any).__iles_wrap_listener = wrapListener
}
