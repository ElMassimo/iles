import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './styles/main.scss'
import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

export const createApp = ViteSSG(App, { routes })
