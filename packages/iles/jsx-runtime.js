import { resolveComponent as _resolveComponent, createVNode, Fragment } from 'vue'

// Internal: Compatibility layer with the automatic JSX runtime of React.
//
// NOTE: Supports v-slots for consistency with @vue/babel-plugin-jsx.
function jsx (type, { children, 'v-slots': vSlots, ...props }) {
  let slots

  if (children) {
    // Normalize the default slot into a function returning an array of vnodes.
    if (!Array.isArray(children)) children = [children]

    slots = type === Fragment
      ? children
      : { ...vSlots, default: () => children }
  }
  else {
    slots = vSlots || null
  }

  return createVNode(type, props, slots)
}

// Internal: Replacement for _missingMdxReference in xdm.
function resolveComponent (name) {
  const component = _resolveComponent(name)
  if (component === name)
    throw new Error(`Expected component ${name} to be defined: you likely forgot to import, pass, or provide it.`)

  return component
}

export { jsx, jsx as jsxs, resolveComponent, Fragment }
