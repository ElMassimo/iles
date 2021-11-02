import MagicString from 'magic-string'
import { parse, SFCBlock } from 'vue/compiler-sfc'
import type { ComponentsApi, ComponentInfo } from 'unplugin-vue-components/types'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core'
import type { AppConfig } from '../shared'
import { pascalCase, isString, debug } from './utils'
import { parseImports, parseExports } from './parse'

export const unresolvedIslandKey = '__viteIslandComponent'

export async function wrapLayout (code: string, filename: string) {
  const { descriptor: { template }, errors } = parse(code, { filename })
  if (errors.length > 0 || !template || !isString(template.attrs.layout)) return

  const s = new MagicString(code)
  const nodes = template.ast.children
  const Layout = `${pascalCase(template.attrs.layout as string)}Layout`

  debug.layout(`${template.attrs.layout} ${filename}`)

  s.appendLeft(nodes[0].loc.start.offset, `<${Layout}>`)
  s.appendRight(nodes[nodes.length - 1].loc.end.offset, `</${Layout}>`)

  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

const scriptClientRE = /<script\b([^>]*\bclient:[^>]*)>([^]*?)<\/script>/

export async function wrapIslandsInSFC (config: AppConfig, code: string, filename: string) {
  code = code.replace(scriptClientRE, (_, attrs, content) =>
    `<scriptClient${attrs}>${content}</scriptClient>`)

  const { descriptor: { template, script, scriptSetup, customBlocks }, errors } = parse(code, { filename })
  const scriptClientIndex = customBlocks.findIndex(b => b.type === 'scriptClient')
  const scriptClient = scriptClientIndex > -1 && customBlocks[scriptClientIndex]
  if (errors.length > 0) return
  if (!template) {
    if (scriptClient) throw new Error(`Vue components with <script client:...> must define a template. No template found in ${filename}`)
    return
  }

  const s = new MagicString(code)

  if (scriptClient) await injectClientScript(template.ast, s, filename, scriptClientIndex, scriptClient)

  const jsCode = scriptSetup?.loc?.source || script?.loc?.source
  const imports = jsCode ? await parseImports(jsCode) : {}

  let componentCounter = 0
  let injectionOffset = scriptSetup?.loc?.start?.offset

  const resolveComponentImport = async ({ tag, props }: ElementNode): Promise<ComponentInfo> => {
    debug.detect(`<${tag} ${props.map(prop => prop.loc.source).join(' ')}>`)
    const meta = imports[tag]
    if (meta) return meta

    if (injectionOffset === undefined) {
      const opening = `<script setup lang="${script?.attrs?.lang || 'ts'}">`
      s.prepend(opening)
      injectionOffset = 0
    }

    return await injectComponentImport(config, s, tag, filename, componentCounter++, injectionOffset)
  }

  await visitSFCNode(template.ast, s, resolveComponentImport)

  // Close script setup tag if any component was injected.
  if (!scriptSetup && injectionOffset === 0)
    s.appendRight(0, '\n</script>\n')

  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

async function visitSFCNode (node: ElementNode | TemplateChildNode, s: MagicString, resolveComponentImport: (n: ElementNode) => Promise<ComponentInfo>) {
  if ('props' in node && node.props.some(prop => prop.name.startsWith('client:'))) {
    const { tag, loc: { start, end } } = node

    const importMeta = await resolveComponentImport(node)
    const componentProps = `
      :component="${importMeta.name}"
      componentName="${tag}"
      importName="${importMeta.importName}"
      importPath="${importMeta.path}"
    `

    // Replace opening tag.
    s.overwrite(start.offset + 1, start.offset + 1 + tag.length,
      `Island ${componentProps.replace(/\n\s*/g, ' ')}`)

    // Replace closing tag.
    if (!node.isSelfClosing)
      s.overwrite(end.offset - 1 - tag.length, end.offset - 1, 'Island')
  }
  if ('children' in node) {
    for (const child of node.children)
      await visitSFCNode(child as any, s, resolveComponentImport)
  }
}

export async function resolveComponent (components: ComponentsApi, tag: string, filename: string, counter: number): Promise<ComponentInfo> {
  const info = await components.findComponent(tag, filename)
  if (!info) throw new Error(`Could not resolve ${tag} in ${filename}. Make sure to import it explicitly, or add a component resolver.`)
  return { importName: 'default', ...info, name: `__ile_components_${counter}` }
}

async function injectComponentImport (config: AppConfig, s: MagicString, tag: string, filename: string, counter: number, injectionOffset: number) {
  const components: ComponentsApi = config.namedPlugins.components.api
  const info = await resolveComponent(components, tag, filename, counter)
  s.appendRight(injectionOffset, `\n${components.stringifyImport(info)}`)
  return info
}

async function injectClientScript (node: ElementNode, s: MagicString, filename: string, index: number, block: SFCBlock) {
  const { attrs, content, loc: { end } } = block
  const { lang = 'ts', ...props } = attrs

  // NOTE: Faking the extension ensures it's processed by esbuild.
  const importPath = `${filename}?vue&index=${index}&clientScript=true&lang.${lang}`

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

  s.appendLeft(node.loc.end.offset - 3 - node.tag.length,
    `  <Island v-bind='${JSON.stringify({
      ...props,
      component: {},
      componentName: 'clientScript',
      importName: 'onLoad',
      using: 'vanilla',
      importPath,
    })}'/>\n`)
}
