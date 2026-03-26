/// <reference types="vite/client" />

import Plugin from '../dist/node/plugin/plugin'

export default Plugin
export * from './shared'
export * from '../dist/client/index'
export * from '../dist/node/index'

import 'vue-router'
import './virtual'
import './client'
