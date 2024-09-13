import {
  defineComponent as defineVueComponent,
  resolveComponent,
  createVNode,
  createStaticVNode as raw,
  Fragment,
} from 'vue'

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

// Internal: Extends it to be a stateful component that can perform prop checks.
function defineComponent (MDXContent, definition) {
  return defineVueComponent({
    ...definition,
    props: {
      components: { type: Object },
      excerpt: { type: Boolean },
    },
    render (props) {
      if (!props) props = this ? { ...this.$props, ...this.$attrs } : {}
      return MDXContent(props)
    },
  })
}

export {
  Fragment,
  jsx,
  jsx as jsxs,
  defineComponent,
  resolveComponent,
  raw,
}
