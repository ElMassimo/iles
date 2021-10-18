/// <reference types="vite/client" />

import type { DefineComponent } from 'vue'
import type Vue from './vue'

export type Framework = typeof Vue
export type Component = DefineComponent
export type Id = string
export type Props = Record<string, unknown>
export type Slots = Record<string, string>
export type MountArgs = [Framework, Component, Id, Props]
export type HydrationArgs = [Framework, Component, Id, Props, Slots]
export type PrerenderFn = (component: any, props: Props, slots: Slots | undefined) => Promise<string>
