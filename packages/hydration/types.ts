/// <reference types="vite/client" />

import type { DefineComponent } from 'vue'
import type Vue from './vue'

export type Framework = 'vue' | 'preact' | 'solid' | 'svelte' | 'vanilla'
export type FrameworkFn = typeof Vue
export type Component = DefineComponent
export type Id = string
export type Props = Record<string, unknown>
export type Slots = Record<string, string>
export type MountArgs = [FrameworkFn, Component, Id, Props]
export type HydrationArgs = [FrameworkFn, Component, Id, Props, Slots]
