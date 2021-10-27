export type {
  AppClientConfig,
  AppConfig,
  AppPlugins,
  Awaited,
  ConfigEnv,
  CreateAppConfig,
  CreateAppFactory,
  HeadConfig,
  IslandDefinition,
  OnLoadFn,
  IslandsByPath,
  LayoutFactory,
  NamedPlugins,
  PageComponent,
  PageData,
  PageFrontmatter,
  PageMeta,
  PageProps,
  Plugin,
  PluginOption,
  RouteMeta,
  Router,
  RouteRecordRaw,
  RouterOptions,
  AppContext,
  GetStaticPaths,
  StaticPath,
  RouteToRender,
  UserApp,
  UserSite,
  UserConfig,
  ViteOptions,
} from '../../types/shared'

import type { ComponentOptionsWithoutProps } from 'vue'
import { UserConfig, UserApp, GetStaticPaths } from '../../types/shared'

export function defineConfig (config: UserConfig) {
  return config
}

export function defineApp (app: UserApp) {
  return app
}

export function definePageComponent<T> (page: ComponentOptionsWithoutProps<T> & { getStaticPaths?: GetStaticPaths<T> }) {
  return page
}
