/**
 * Exported sync utils should go here.
 * This file will be bundled to ESM and CJS and redirected by ../index.cjs
 * Please control the side-effects by checking the ./dist/node-cjs/publicUtils.cjs bundle
 */
export { VERSION as version, ILES_APP_ENTRY } from './constants'
export { version as viteVersion, esbuildVersion, rollupVersion, mergeConfig } from 'vite'
