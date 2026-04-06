import MagicString from 'magic-string'
import type { SFCBlock } from 'vue/compiler-sfc'
import { parse } from 'vue/compiler-sfc'
import type { ComponentInfo, PublicPluginAPI as ComponentsApi } from 'unplugin-vue-components/types'
import type { DirectiveNode, ElementNode, RootNode, TemplateChildNode } from '@vue/compiler-core'
import type { AppConfig } from '../shared'
import { pascalCase, isString, debug } from './utils'
import { parseImports, parseExports } from './parse'

interface SfcRootNode extends RootNode {
  ast: {
    children: [TemplateChildNode, ...Node[]] // SFC with a template tag containing at least one tag
  }
}

export const unresolvedIslandKey = '__viteIslandComponent'

export interface ListenerWarning {
  event: string
  tag: string
  line: number
  column: number
  message: string
}

export interface WrapIslandsOptions {
  analyzeListeners?: boolean
  wrapListeners?: boolean
  warn?: (warning: ListenerWarning) => void
}

export async function wrapLayout (code: string, filename: string) {
  const { descriptor: { template }, errors } = parse(code, { filename })
  if (errors.length > 0 || !template || !isString(template.attrs.layout)) return

  const s = new MagicString(code)

  const nodes = template.ast?.children
  if (!nodes?.length) {
    return
  }

  const Layout = `${pascalCase(template.attrs.layout as string)}Layout`

  debug.layout(`${template.attrs.layout} ${filename}`)

  s.appendLeft(nodes[0].loc.start.offset, `<${Layout}>`)
  s.appendRight(nodes[nodes.length - 1].loc.end.offset, `</${Layout}>`)

  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

const scriptClientRE = /<script\b([^>]*\bclient:[^>]*)>([^]*?)<\/script>/

export async function wrapIslandsInSFC (config: AppConfig, code: string, filename: string, options: WrapIslandsOptions = {}) {
  code = code.replace(scriptClientRE, (_, attrs, content) =>
    `<script-client${attrs}>${content}</script-client>`)

  const { descriptor: { template, script, scriptSetup, customBlocks }, errors } = parse(code, { filename })
  const scriptClientIndex = customBlocks.findIndex(b => b.type === 'script-client')
  const scriptClient = scriptClientIndex > -1 && customBlocks[scriptClientIndex]
  if (errors.length > 0) return

  if ((scriptClient && 'setup' in scriptClient.attrs) || (scriptSetup && Object.keys(scriptSetup.attrs).some(attr => attr.startsWith('client:'))))
    throw new Error('Incorrect usage of hydration strategy in script setup.\nSee https://iles-docs.netlify.app/guide/client-scripts#client-script-block')

  if (!template?.ast?.children.length) {
    if (scriptClient) { throw new Error(`Vue components with <script client:...> must define a template containing at least one tag. No valid template found in ${filename}`) }
    return
  }
  const sfcRootNode = template.ast as any as SfcRootNode

  const s = new MagicString(code)
  const components: ComponentsApi = config.namedPlugins.components.api

  if (scriptClient) { await injectClientScript(sfcRootNode, s, filename, scriptClientIndex, scriptClient) }

  const jsCode = scriptSetup?.loc?.source || script?.loc?.source
  const imports = jsCode ? await parseImports(jsCode) : {}

  let componentCounter = 0
  let injectionOffset = scriptSetup?.loc?.start?.offset

  const elements = sfcRootNode.children.filter((n: any) => n.tag) as ElementNode[]

  if (options.analyzeListeners || options.wrapListeners)
    processSFCListeners(elements, s, filename, options)

  for (const child of elements) {
    await visitSFCNode(child, s, resolveComponentImport)
  }

  // Close script setup tag if any component was injected.
  if (!scriptSetup && injectionOffset === 0)
    s.appendRight(0, '\n</script>\n')

  return { code: s.toString(), map: s.generateMap({ hires: true }) }

  async function resolveComponentImport (strategy: string, tagName: string): Promise<ComponentInfo> {
    debug.detect(`<${tagName} ${strategy}>`)
    if (imports[tagName]) return await resolveImportPath(config, imports[tagName], filename)
    const info = await resolveComponent(components, tagName, filename, componentCounter++)
    if (strategy !== 'client:only') injectComponentImport(info)
    return info
  }

  function injectComponentImport (info: ComponentInfo) {
    if (injectionOffset === undefined) {
      const opening = `<script setup lang="${script?.attrs?.lang || 'ts'}">`
      s.prepend(opening)
      injectionOffset = 0
    }
    s.appendRight(injectionOffset, `\n${components.stringifyImport(info)};`)
  }
}

function processSFCListeners (elements: ElementNode[], s: MagicString, filename: string, options: WrapIslandsOptions) {
  const walk = (node: ElementNode, insideIsland = false) => {
    const hasClientDirective = node.props.some(prop => 'name' in prop && prop.name.startsWith('client:'))
    const withinIsland = insideIsland || hasClientDirective || node.tag === 'Island'

    for (const prop of node.props) {
      if (!isOnDirective(prop)) continue
      const event = getEventName(prop)
      const location = prop.loc.start
      const warning: ListenerWarning = {
        event,
        tag: node.tag,
        line: location.line,
        column: location.column,
        message: `[iles] Listener '${event}' on <${node.tag}> in ${filename}:${location.line}:${location.column} will be static at runtime unless wrapped in <Island client:...>.`,
      }

      if (!withinIsland && options.analyzeListeners)
        options.warn?.(warning)

      if (options.wrapListeners && prop.exp?.loc?.source)
        wrapVueExpression(s, prop.exp.loc.start.offset, prop.exp.loc.end.offset, warning)
    }

    for (const child of node.children || []) {
      if ('tag' in (child as any))
        walk(child as ElementNode, withinIsland)
    }
  }

  for (const element of elements)
    walk(element)
}

function wrapVueExpression (s: MagicString, start: number, end: number, warning: ListenerWarning) {
  const details = JSON.stringify({
    source: 'vue',
    ...warning,
  })
  s.appendLeft(start, `($event) => window.__ILE_GUARD_LISTENER_CALL__(() => { const _ileHandler = (`)
  s.appendRight(end, `); return typeof _ileHandler === 'function' ? _ileHandler($event) : _ileHandler }, $event, ${details})`)
}

function isOnDirective (prop: any): prop is DirectiveNode {
  return prop?.type === 7 && prop?.name === 'on'
}

function getEventName (prop: DirectiveNode) {
  if (prop.arg?.type === 4)
    return prop.arg.content || 'event'
  return 'event'
}

async function visitSFCNode (node: ElementNode, s: MagicString, resolveComponentImport: (strategy: string, tag: string) => Promise<ComponentInfo>) {
  const strategy = 'props' in node
    && node.props.find(prop => prop.name.startsWith('client:'))?.name

  if (strategy) {
    const { tag, loc: { start, end } } = node

    const importMeta = await resolveComponentImport(strategy, tag)
    const componentProps = `
      :component="${strategy === 'client:only' ? null : importMeta.as}"
      componentName="${tag}"
      importName="${importMeta.name}"
      importFrom="${importMeta.from}"
    `

    // Replace opening tag.
    s.overwrite(start.offset + 1, start.offset + 1 + tag.length,
      `Island ${componentProps.replace(/\n\s*/g, ' ')}`, { contentOnly: true })

    // Replace closing tag.
    if (!node.isSelfClosing)
      s.overwrite(end.offset - 1 - tag.length, end.offset - 1, 'Island', { contentOnly: true })
  }

  if ('children' in node) {
    for (const child of node.children)
      await visitSFCNode(child as any, s, resolveComponentImport)
  }
}

export async function resolveComponent (components: ComponentsApi, tag: string, filename: string, counter: number): Promise<ComponentInfo> {
  const info = await components.findComponent(pascalCase(tag), filename)
  if (!info) throw new Error(`Could not resolve ${tag} in ${filename}. Make sure to import it explicitly, or add a component resolver.`)
  return { name: 'default', ...info, as: `__ile_components_${counter}` }
}

export async function resolveImportPath (config: AppConfig, info: ComponentInfo, importer: string) {
  info.from = (await config.resolvePath(info.from, importer)) || info.from
  return info
}

async function injectClientScript (node: SfcRootNode, s: MagicString, filename: string, index: number, block: SFCBlock) {
  const { attrs, content, loc: { end } } = block
  const { lang = 'ts', ...props } = attrs

  // NOTE: Faking the extension ensures it's processed by esbuild.
  const importFrom = `${filename}?vue&index=${index}&clientScript=true&lang.${lang}`

  const exported = await parseExports(content)
  if (!exported.includes('onLoad')) {
    if (attrs['client:load'] || attrs['client:only']) {
      s.appendLeft(end.offset, '\nexport const onLoad = undefined\n')
    }
    else {
      const prettyFilename = filename.slice(Math.max(0, filename.indexOf('src/')))
      throw new Error(`Client script in ${prettyFilename} does not export 'onLoad'. Should be a function to execute when the strategy condition is met.`)
    }
  }

  // Automatically add v-bind="$attrs" if template has a single element.
  const elements = node.children.filter((n: any) => n.tag) as ElementNode[]
  if (elements.length === 1) {
    const el = elements[0]
    if (!el.props.some(prop => prop.name === 'bind' && prop.loc.source.includes('$attrs')))
      s.appendRight(el.loc.start.offset + 1 + el.tag.length, ' v-bind="$attrs"')
  }

  const lastTemplateChildNode = elements[elements.length - 1]
  s.appendRight(lastTemplateChildNode.loc.end.offset, `
  <Island v-bind='${JSON.stringify({
    ...props,
    component: {},
    componentName: 'clientScript',
    importName: 'onLoad',
    using: 'vanilla',
    importFrom,
  })}'/>`)
}
