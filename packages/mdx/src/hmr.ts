import hash from 'hash-sum'

export function hmrRuntime (id: string) {
  const hmrId = hash(`${id.split('?', 2)[0]}default`)
  return `
_sfc_main.__hmrId = "${hmrId}"
__VUE_HMR_RUNTIME__.createRecord("${hmrId}", _sfc_main)
import.meta.hot.accept(({default: __default}) => {
__VUE_HMR_RUNTIME__.reload("${hmrId}", __default)
})
`
}
