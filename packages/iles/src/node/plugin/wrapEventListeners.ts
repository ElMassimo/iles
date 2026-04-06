import { NodeTypes, createCompoundExpression } from '@vue/compiler-core'
import { DOMDirectiveTransforms } from '@vue/compiler-dom'
import type { DirectiveTransform } from '@vue/compiler-core'

// Dev-only Vue compiler directiveTransform that wraps v-on event handlers
// with a runtime check for island context.
//
// Wraps Vue's built-in transformOn: after it converts @click="handler" into
// { onClick: handler }, this transform rewrites each handler value to:
//   window.__iles_wrap_listener(handler, "onClick", "src/pages/foo.vue:12")
//
// The runtime wrapper (installed in dev) calls the original handler normally
// but shows a loud error if the element is outside an <ile-root>.

const originalTransformOn = DOMDirectiveTransforms.on

export const transformOnWithIslandCheck: DirectiveTransform = (dir, node, context, augmentor) => {
  const result = originalTransformOn(dir, node, context, augmentor)

  // Skip internal iles components (e.g. DebugPanel has legitimate non-island events)
  const filename = (context as any).filename || ''
  if (filename.includes('iles/src/client/') || filename.includes('iles/dist/client/'))
    return result

  if (result.props && result.props.length > 0) {
    const prettyFilename = filename.includes('src/')
      ? filename.slice(filename.indexOf('src/'))
      : filename

    for (const prop of result.props) {
      if (prop.type !== NodeTypes.JS_PROPERTY) continue
      const key = prop.key
      if (key.type !== NodeTypes.SIMPLE_EXPRESSION) continue
      if (!key.content.startsWith('on') || key.content.length < 3) continue

      const line = dir.loc?.start?.line || 0

      prop.value = createCompoundExpression([
        'window.__iles_wrap_listener(',
        prop.value,
        `, ${JSON.stringify(key.content)}, ${JSON.stringify(`${prettyFilename}:${line}`)})`,
      ])
    }
  }

  return result
}
