/* eslint-disable @typescript-eslint/no-var-requires */
import type fs from 'fs'
import { useAppConfig } from './appConfig'

export function useFile (...args: Parameters<typeof fs['readFileSync']>) {
  if (!import.meta.env.SSR) throw new Error(`useFile should only be used after checking for import.meta.env.SSR.`)

  const { root } = useAppConfig()
  args[0] = require('path').resolve(root, args[0])

  return require('fs').readFileSync(...args)
}
