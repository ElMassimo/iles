import { UserApp, UserConfig } from '../../types/shared'

export {
  ViteOptions,
  ConfigEnv,
  Router,
  RouteRecordRaw,
  PageMeta,
  RouterOptions,
  HeadConfig,
  IslandDefinition,
  CreateAppConfig,
  SSGContext,
  CreateAppFactory,
  Plugin,
  PluginOption,
  UserApp,
  UserConfig,
  AppClientConfig,
  AppConfig,
  AppPlugins,
} from '../../types/shared'

export const EXTERNAL_URL_RE = /^https?:/i

export const inBrowser = typeof window !== 'undefined'

export function defineConfig (config: UserConfig) {
  return config
}

export function defineApp (app: UserApp) {
  return app
}
