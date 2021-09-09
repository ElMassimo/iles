import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './styles/main.scss'
import ViteIslandsSSG from 'vite-islands/client'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

export const createApp = ViteIslandsSSG(App, { routes })
