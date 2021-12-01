import { resolveComponent, createVNode, createStaticVNode, Fragment } from 'vue'

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
    // Allow empty fragment expressions.
    if (type === Fragment)
      return null

    slots = vSlots || null
  }

  return createVNode(type, props, slots)
}

export { jsx, jsx as jsxs, resolveComponent, createStaticVNode as raw, Fragment }
