interface ListenerWarningDetails {
  source?: string
  event?: string
  tag?: string
  line?: number
  column?: number
}

type DevtoolsApi = {
  reportStaticListenerWarning?: (payload: any) => void
}

const warned = new Set<string>()

function getEventTarget (event: any) {
  const target = event?.composedPath?.()?.[0] || event?.target
  return target as Element | null
}

function hasIslandContext (target: Element | null) {
  return Boolean(target?.closest?.('ile-root[hydrated]'))
}

export function guardListenerCall<T> (handler: () => T, event: Event, details: ListenerWarningDetails = {}): T {
  const target = getEventTarget(event)
  if (!hasIslandContext(target)) {
    const key = [
      details.source || 'listener',
      details.event || event?.type || 'event',
      details.tag || target?.nodeName || 'unknown',
      details.line || 0,
      details.column || 0,
    ].join(':')

    if (!warned.has(key)) {
      warned.add(key)
      const location = details.line ? `:${details.line}:${details.column || 0}` : ''
      const message = `[iles] Event listener '${details.event || event?.type || 'event'}' on <${details.tag || 'unknown'}>${location} ran without island context. Wrap this component in <Island client:...> or move interaction into an island.`
      console.error(message, { details, event, target })
      ;(window as any).__ILE_DEVTOOLS__?.reportStaticListenerWarning?.({ key, message, details, target, eventType: event?.type })
    }
  }

  return handler()
}

if (typeof window !== 'undefined')
  (window as any).__ILE_GUARD_LISTENER_CALL__ = guardListenerCall
