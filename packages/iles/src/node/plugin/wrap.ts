import MagicString from 'magic-string'
import { parse, SFCBlock } from 'vue/compiler-sfc'
import type { Debugger } from 'debug'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core'
import { pascalCase, isString } from './utils'
import { parseImports, parseExports } from './parse'
import type { ParsedImports } from './parse'

export const unresolvedIslandKey = '__viteIslandComponent'

export async function wrapLayout (code: string, filename: string, debug: Debugger) {
  const { descriptor: { template }, errors } = parse(code, { filename })
  if (errors.length > 0 || !template || !isString(template.attrs.layout)) return

  const s = new MagicString(code)
  const nodes = template.ast.children
  const Layout = `${pascalCase(template.attrs.layout as string)}Layout`

  s.appendLeft(nodes[0].loc.start.offset, `<${Layout}>`)
  s.appendRight(nodes[nodes.length - 1].loc.end.offset, `</${Layout}>`)

  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

const scriptClientRE = /<script\b([^>]*\bclient:[^>]*)>([^]*?)<\/script>/

export async function wrapIslandsInSFC (code: string, filename: string, debug: Debugger) {
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

  if (scriptClient) await injectClientScript(template.ast, s, filename, scriptClientIndex, scriptClient, debug)

  const jsCode = scriptSetup?.loc?.source || script?.loc?.source
  const imports = jsCode ? await parseImports(jsCode) : {}

  visitSFCNode(template.ast, s, imports, debug)
  return { code: s.toString(), map: s.generateMap({ hires: true }) }
}

function visitSFCNode (node: ElementNode | TemplateChildNode, s: MagicString, imports: ParsedImports, debug: Debugger) {
  if ('props' in node && node.props.some(prop => prop.name.startsWith('client:'))) {
    const { tag, loc: { start, end } } = node

    const componentBinding = imports[tag] ? tag : `_resolveComponent("${tag}")`

    debug(`<${tag} ${node.props.map(prop => prop.loc.source).join(' ')}>`)

    // Replace opening tag.
    s.overwrite(start.offset + 1, start.offset + 1 + tag.length,
      `Island componentName="${pascalCase(tag)}" :${unresolvedIslandKey}='${componentBinding}'`)

    // Replace closing tag.
    if (!node.isSelfClosing)
      s.overwrite(end.offset - 1 - tag.length, end.offset - 1, 'Island')
  }
  if ('children' in node)
    node.children.forEach(node => visitSFCNode(node as any, s, imports, debug))
}

async function injectClientScript (node: ElementNode, s: MagicString, filename: string, index: number, block: SFCBlock, debug: Debugger) {
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
