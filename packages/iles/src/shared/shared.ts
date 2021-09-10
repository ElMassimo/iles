export {
  Router,
  RouteRecordRaw,
  PageMeta,
  RouterOptions,
  HeadConfig,
  CreateAppConfig,
  SSGContext,
  CreateAppFactory,
  IlesPlugin,
  IlesPluginOption,
  IlesUserConfig,
  IlesConfig,
} from '../../types/shared'

export const EXTERNAL_URL_RE = /^https?:/i

export const inBrowser = typeof window !== 'undefined'
