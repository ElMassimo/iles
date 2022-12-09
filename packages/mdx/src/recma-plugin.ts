import { walk } from 'estree-walker'
import type { Node, Statement, ImportSpecifier, FunctionDeclaration, Program } from 'estree-jsx'
import type { Plugin } from 'unified'

/**
 * A plugin that replaces _missingMDXReference with Vue's resolveComponent,
 * allowing components to be resolved statically or at runtime.
 */
const recmaPlugin: Plugin<[], Program> = function recmaVueResolveComponents () {
  return tree => resolveMissingComponents(tree)
}

export default recmaPlugin

function resolveMissingComponents (tree: Program) {
  walk(tree, {
    // @ts-ignore
    enter (node: Node) {
      if (node.type === 'Program')
        return

      if (node.type === 'ImportDeclaration') {
        const importSource = node.source?.value
        if (typeof importSource === 'string' && importSource.endsWith('jsx-runtime')) {
          node.specifiers.push(
            importSpecifier('resolveComponent'),
            importSpecifier('raw'),
          )
        }
        return this.skip()
      }

      if (node.type !== 'FunctionDeclaration')
        return this.skip()

      if (node.id?.name === '_createMdxContent') {
        rewriteMdxContentComponents(node.body.body)
        return this.skip()
      }

      if (node.id?.name === 'MDXContent')
        return this.skip()

      if (node.id?.name === '_missingMdxReference')
        return this.remove()
    },
  })

  return tree
}

/**
 * Converts all _missingMdxReference assertions into _resolveComponent assignments.
 */
function rewriteMdxContentComponents (statements: Statement[]) {
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Allow reassigning the component identifiers when they are globally resolved.
    if (statement.type === 'VariableDeclaration') {
      statement.kind = 'let'
      continue
    }

    // Walk through the assertions that detect missing components.
    if (
      statement.type === 'IfStatement'
      && statement.test.type === 'UnaryExpression'
      && statement.test.argument.type === 'Identifier'
      && statement.consequent.type === 'ExpressionStatement'
    ) {
      const missingReferenceCall = statement.consequent.expression

      if (
        missingReferenceCall.type === 'CallExpression'
        && missingReferenceCall.callee.type === 'Identifier'
      ) {
        // Replace _missingMdxReference with _resolveComponents
        missingReferenceCall.callee.name = '_resolveComponent'

        // Keep only the first argument to allow unplugin-vue-components to
        // statically replace the method call with a resolved component.
        missingReferenceCall.arguments.splice(1)

        statement.consequent.expression = {
          type: 'AssignmentExpression',
          operator: '=',
          left: statement.test.argument,
          right: statement.consequent.expression,
        }
      }

      continue
    }

    // Optimization: assume all missing component checks are at the beginning.
    break
  }
}

function importSpecifier (name: string): ImportSpecifier {
  return {
    type: 'ImportSpecifier',
    imported: { type: 'Identifier', name },
    local: { type: 'Identifier', name: `_${name}` },
  }
}
