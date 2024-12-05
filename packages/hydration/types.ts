/// <reference types="vite/client" />

import type Vue from './vue'

export type { EnhanceIslands } from '../iles/types/shared'

export type Framework = 'vue' | 'preact' | 'solid' | 'svelte' | 'vanilla'
export type FrameworkFn = typeof Vue
export type AsyncFrameworkFn = () => Promise<FrameworkFn>
export type Component = any
export type AsyncComponent = () => Component
export type Id = string
export type Props = Record<string, unknown>
export type Slots = Record<string, string>
