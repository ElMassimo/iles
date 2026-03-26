import type { AppConfig } from '../shared'

// Internal: Adds the url to the site for convenience, and enables HMR.
export function extendSite(code: string, config: AppConfig) {
  return `${code.replace('export default ', 'let __site = ')}
__site.url = '${config.siteUrl}${config.base.slice(0, config.base.length - 1)}'
__site.canonical = '${config.siteUrl.split('//', 2)[1] ?? ''}'
import { ref as _$ref } from 'vue'
const __siteRef = _$ref(__site)
__site = { ref: __siteRef  }
export { __site, __siteRef as default }

if (import.meta.hot)
  import.meta.hot.accept(mod => {
    __site.ref.value = mod.__site.ref.value
    mod.__site.ref = __site.ref
  })
`
  // NOTE: The last line replaces the ref of the current module with the ref in
  // the original module that was made reactive in `installPageData`, so that
  // subsequent HMRs are also performed as expected.
}
