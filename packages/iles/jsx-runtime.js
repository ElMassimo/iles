import { resolveComponent, createVNode, createTextVNode, Fragment } from 'vue'

function jsx (type, { children = null, 'v-slots': vSlots, ...props }) {
  if (vSlots)
    children = { ...vSlots, default: children }
  else if (children !== null && !Array.isArray(children))
    children = [children]

  return createVNode(type, props, children)
}

export { jsx, jsx as jsxs, Fragment }
