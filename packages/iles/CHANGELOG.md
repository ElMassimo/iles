# [0.6.0](https://github.com/ElMassimo/iles/compare/v0.5.4...v0.6.0) (2021-11-04)


### Features

* auto-import iles composables: usePage, useRoute, useHead, definePageComponent ([2dba5fa](https://github.com/ElMassimo/iles/commit/2dba5fa40db4a834497bf688c21260023680c220))



## [0.5.4](https://github.com/ElMassimo/iles/compare/v0.5.3...v0.5.4) (2021-11-03)



## [0.5.3](https://github.com/ElMassimo/iles/compare/v0.5.2...v0.5.3) (2021-11-03)

### Features

* auto-install iles modules. improve vite plugins auto-install ([56cd478](https://github.com/ElMassimo/iles/commit/56cd4783b56e0169421b5cbc148189a6136d1b10))

### Bug Fixes

* ensure client:only components are not imported in SSR ([241fb95](https://github.com/ElMassimo/iles/commit/241fb956cfeb81ddad168376d4e05ad7631ddd5f))


## [0.5.2](https://github.com/ElMassimo/iles/compare/v0.5.1...v0.5.2) (2021-11-03)


### Bug Fixes

* missing types for markdown config option ([e03cde2](https://github.com/ElMassimo/iles/commit/e03cde25eefd86d20c9ee73e080a30013620887f))



## [0.5.1](https://github.com/ElMassimo/iles/compare/v0.5.0...v0.5.1) (2021-11-02)


### Bug Fixes

* ensure non-mdx markdown files can be processed ([6a9b941](https://github.com/ElMassimo/iles/commit/6a9b941bc17b59fee058ea7a03bc1482d2f639c2))



# [0.5.0](https://github.com/ElMassimo/iles/compare/v0.4.6...v0.5.0) (2021-11-02)

* 🔌 Modules: ESM imports and configResolved 🔌 (#28)


## [0.4.6](https://github.com/ElMassimo/iles/compare/v0.4.5...v0.4.6) (2021-10-28)


### Bug Fixes

* ensure errors are thrown when layout or props are not resolved ([9a9f6a1](https://github.com/ElMassimo/iles/commit/9a9f6a1cff09174addd95c6313fd84d778ab89e1))
* ensure vite:esbuild runs on .tsx files when using preact ([6bd4639](https://github.com/ElMassimo/iles/commit/6bd4639f704554cc898b4df9f854c8de2576d2f4))



## [0.4.5](https://github.com/ElMassimo/iles/compare/v0.4.4...v0.4.5) (2021-10-28)


### Features

* (devtools) display props passed to island components ([d5f0ede](https://github.com/ElMassimo/iles/commit/d5f0ede1483b1e204a7d332107c983a790f5d113))



## [0.4.4](https://github.com/ElMassimo/iles/compare/v0.4.4-1...v0.4.4) (2021-10-28)


### Bug Fixes

* ensure dynamic parameters in catch-all routes can be matched ([89631e7](https://github.com/ElMassimo/iles/commit/89631e77b08d3f0cf77ed0dce4124219d17460ed))



## [0.4.4-1](https://github.com/ElMassimo/iles/compare/v0.4.4-0...v0.4.4-1) (2021-10-28)


### Bug Fixes

* typings for resolveProps ([1f33fcf](https://github.com/ElMassimo/iles/commit/1f33fcf53bd1c2e6186c8ec5c1afa768198eb771))



## [0.4.4-0](https://github.com/ElMassimo/iles/compare/v0.4.3...v0.4.4-0) (2021-10-27)


### Bug Fixes

* drop remark-frontmatter and add micromark plugins directly ([8d6f3f3](https://github.com/ElMassimo/iles/commit/8d6f3f3b184674e30181a7ca52361de3baaeb5ac))



## [0.4.3](https://github.com/ElMassimo/iles/compare/v0.4.2...v0.4.3) (2021-10-27)


### Bug Fixes

* ensure getStaticPaths is only called once per page during build ([e2d1768](https://github.com/ElMassimo/iles/commit/e2d1768a61ff8ea2d3a4ba9e6bb8e17c6c3455db))


### Features

* add page props to devtools ([c583c6a](https://github.com/ElMassimo/iles/commit/c583c6aeae9db1a538eee7b6dc4f814b7cf49b99))
* provide route to `getStaticPaths` for more advanced scenarios ([753e03d](https://github.com/ElMassimo/iles/commit/753e03d396c97d7a0691e9440815d183dbd37781))



## [0.4.2](https://github.com/ElMassimo/iles/compare/v0.4.1...v0.4.2) (2021-10-27)


### Bug Fixes

* revert change to d.ts ([89f2d5e](https://github.com/ElMassimo/iles/commit/89f2d5ede96a82480f387245c6edba0f2c5a9a08))



## [0.4.1](https://github.com/ElMassimo/iles/compare/v0.4.0...v0.4.1) (2021-10-27)


### Bug Fixes

* define all no-op helpers in shared ([07d63f5](https://github.com/ElMassimo/iles/commit/07d63f53d9d47adc0f7d31035c3ffb2646729298))



# [0.4.0](https://github.com/ElMassimo/iles/compare/v0.3.12...v0.4.0) (2021-10-27)


### Features

* 🛣 Dynamic Parameters 🛣 ([#25](https://github.com/ElMassimo/iles/issues/25)) ([9148e4a](https://github.com/ElMassimo/iles/commit/9148e4a16f8ca79d6f14d8d3df34462a6e07cd6b))



## [0.3.12](https://github.com/ElMassimo/iles/compare/v0.3.11...v0.3.12) (2021-10-25)


### Bug Fixes

* node 14 compatibility ([9368926](https://github.com/ElMassimo/iles/commit/93689260c6676894813653ccb39340a45fa3c1c3))



## [0.3.11](https://github.com/ElMassimo/iles/compare/v0.3.10...v0.3.11) (2021-10-22)


### Bug Fixes

* can't close debug panel ([0433abf](https://github.com/ElMassimo/iles/commit/0433abf3eb796f279da2a185020f4063c9ca9bc1))



## [0.3.10](https://github.com/ElMassimo/iles/compare/v0.3.9...v0.3.10) (2021-10-22)


### Bug Fixes

* could not resolve Head component ([97c2cae](https://github.com/ElMassimo/iles/commit/97c2cae979bb66deb4cbc5891d9572c206e9abc9))



## [0.3.9](https://github.com/ElMassimo/iles/compare/v0.3.8...v0.3.9) (2021-10-22)


### Bug Fixes

* import composables explicitly to allow typechecking ([a804f5b](https://github.com/ElMassimo/iles/commit/a804f5b5f0a8297bc98c81cb17920c8d7d86b201))



## [0.3.8](https://github.com/ElMassimo/iles/compare/v0.3.7...v0.3.8) (2021-10-22)


### Bug Fixes

* allow base html to be transformed by vite plugins ([568f8fe](https://github.com/ElMassimo/iles/commit/568f8fe7b5f1b8b2a7288b1afbdc444c282caffc))
* include global properties in types/index.d.ts ([4cbaa5d](https://github.com/ElMassimo/iles/commit/4cbaa5dd1c74ec87e7e4aebea186935e39e4232e))


### Features

* display mounted element in island devtools ([b1c7cd3](https://github.com/ElMassimo/iles/commit/b1c7cd3c68b5de4077258e726b6a331ca2ff1a11))



## [0.3.7](https://github.com/ElMassimo/iles/compare/v0.3.6...v0.3.7) (2021-10-21)


### Features

* allow passing multiple slots to Svelte islands ([3bb76eb](https://github.com/ElMassimo/iles/commit/3bb76eb592c36a5a2249af92a43e97aa84fd4140))



## [0.3.6](https://github.com/ElMassimo/iles/compare/v0.3.5...v0.3.6) (2021-10-20)


### Bug Fixes

* ensure content is rendered when default layout is missing ([3d4538e](https://github.com/ElMassimo/iles/commit/3d4538e5defb841874cd8e7d1108be451e6f824a))



## [0.3.5](https://github.com/ElMassimo/iles/compare/v0.3.4...v0.3.5) (2021-10-20)


### Bug Fixes

* ensure that iles.config.ts and src/layouts/default.vue are optional ([7b9c99e](https://github.com/ElMassimo/iles/commit/7b9c99ed211fd7eb2730182c0f9621c52104fcad))



## [0.3.4](https://github.com/ElMassimo/iles/compare/v0.3.3...v0.3.4) (2021-10-20)


### Bug Fixes

* island resolution in windows (close [#15](https://github.com/ElMassimo/iles/issues/15)). thanks [@gustojs](https://github.com/gustojs)! ([bd6e1fa](https://github.com/ElMassimo/iles/commit/bd6e1fa203c2ed73ebf5f68222cfb88fa629028b))



## [0.3.3](https://github.com/ElMassimo/iles/compare/v0.3.2...v0.3.3) (2021-10-20)


### Features

* add 'info' command to print the version ([698ce22](https://github.com/ElMassimo/iles/commit/698ce22964662d95e88d408a4f5023787702c03a))



## [0.3.2](https://github.com/ElMassimo/iles/compare/v0.3.1...v0.3.2) (2021-10-19)


### Bug Fixes

* ref transform typo ([1744f32](https://github.com/ElMassimo/iles/commit/1744f32c4c1956b746ee551f7759e59840635c00))
* use refTransform in client scripts if needed ([378e03a](https://github.com/ElMassimo/iles/commit/378e03ae46fe965db082b4efb2b7d9ae5382cf92))



## [0.3.1](https://github.com/ElMassimo/iles/compare/v0.3.0...v0.3.1) (2021-10-19)

### Bug Fixes

* wait for installation of optional plugins ([bfb8f20](https://github.com/ElMassimo/iles/commit/bfb8f20fd93bdbef20c6b343ab8741a6f7807345))


# [0.3.0](https://github.com/ElMassimo/iles/compare/v0.2.3...v0.3.0) (2021-10-19)

This release added support for Preact, SolidJS, and Svelte islands.

- New `jsx: 'preact' | 'solid' | 'vue'` option in `iles.config.ts`
- New `preact`, `solid`, and `svelte` options in `iles.config.ts` to configure plugins
- Will automatically install the relevant Vite.js plugin when any of these options are set
- Introduced `client:none` to allow embedding these components without hydration

### Additional Features ✨

- Use dynamic imports to avoid loading island components until hydration strategy is met
- Added new chunk naming strategy based on the framework
- Added `ssg.manualChunks` option to `iles.config.ts` to manually override as needed
- Framwork color coding in DevTools islands

## 0.2.3 (2021-10-15)

### Bug Fixes

* allow typescript in app.ts by using the new transformWithEsbuild API ([8990571](https://github.com/ElMassimo/iles/commit/8990571eba6212e645577c9bd301b845ef9b2f5f))
* avoid using ref sugar in internals, the syntax is experimental ([db846aa](https://github.com/ElMassimo/iles/commit/db846aa66f0dbfdbb8c69c6b9c91c391aa659235))
* avoid workspace dep and add devalue ([87b62f6](https://github.com/ElMassimo/iles/commit/87b62f676387f7b3493e194925f9e610cd14068e))
* ensure iles dependencies are resolved without shamefully hoisting ([1cf863b](https://github.com/ElMassimo/iles/commit/1cf863b9d8310c89f4c289d07153e5720e84585d))
* explicitly import `performance` to support Node 14 (close [#7](https://github.com/ElMassimo/iles/issues/7)) ([66b22ff](https://github.com/ElMassimo/iles/commit/66b22ff43706d30550943d10a5d3b6224e5fbc95))
* frontmatter is always available and can be used to define head refs ([fad2eef](https://github.com/ElMassimo/iles/commit/fad2eef6aaec45689b820fdfe760cc0e6593e153))
* import vueuse/head explicitly in App.vue ([47b50e3](https://github.com/ElMassimo/iles/commit/47b50e38f3eb2b7b6bdf34036fe63ee98a931ac8))
* inline JSX elements in MDX with client directives should be wrapped ([8f36e23](https://github.com/ElMassimo/iles/commit/8f36e23c93fca10721984f5133424d71c2191cd4))
* move esm dependencies to exclude ([9fd7e46](https://github.com/ElMassimo/iles/commit/9fd7e468fabac1d86b7a3fc98c69258bbc3e1500))
* prevent dep scan on layouts file ([170b79d](https://github.com/ElMassimo/iles/commit/170b79d7e9e75a2fa477433b60463e722a5c91b7))
* prevent duplicates of vue runtime ([2de396d](https://github.com/ElMassimo/iles/commit/2de396db7b79d9e7b773546cf89bcacfac168271))
* prevent vue import query string in chunk filenames ([38bfa75](https://github.com/ElMassimo/iles/commit/38bfa754c3e165bf117ee6e81cdd0d5e1b53b3c5))
* router link should alway scrolls to the top in development ([a1cd7f5](https://github.com/ElMassimo/iles/commit/a1cd7f5fb923b87c16ae7f8e30c62c724a463d06))
* simplify @islands/hydration resolution ([8ee99f3](https://github.com/ElMassimo/iles/commit/8ee99f3a94d5a43e277b3eee40bf4e9a4fe18d60))
* smaller output for islands with empty slots ([e982e01](https://github.com/ElMassimo/iles/commit/e982e01820675f31feeb3c00f7a62b1516079454))
* throw error if manifest.json is missing when there are islands ([a3f9536](https://github.com/ElMassimo/iles/commit/a3f9536141f94b24bba6b588d4eaa07896008622))
* typings for EnhanceApp ([86250ce](https://github.com/ElMassimo/iles/commit/86250ce278e2fd6c359db71477f261bc81938ab5))
* use a canonical import path to prevent HMR breakage ([e6552f3](https://github.com/ElMassimo/iles/commit/e6552f31ec7ee2e3080568ac04fee7ac8fdaca38))
* use default layout when no name is specified in <Layout> ([5afd159](https://github.com/ElMassimo/iles/commit/5afd159dbf9f5174c9f475d1fa1bfd7a833dc19d))
* use unjs/pathe to prevent incompatibilities with windows paths ([#4](https://github.com/ElMassimo/iles/issues/4)) ([f2ffacb](https://github.com/ElMassimo/iles/commit/f2ffacb7cf808600ce565990e7021b409d451d3b))


### Features

* add `@/` alias that can be used in vue template image src ([17cced3](https://github.com/ElMassimo/iles/commit/17cced308a11d5f3805dc57f02149538141e977a))
* Add Layout component to easily reference other layouts ([95fa649](https://github.com/ElMassimo/iles/commit/95fa649866814382de94f608cf15a605d6d79338))
* add sitemap.xml generation ([5a748e4](https://github.com/ElMassimo/iles/commit/5a748e4ff4b49981b664beb8f709b5d9f0e41f23))
* allow 'layout' as a top-level attribute in <route> ([02cdd5b](https://github.com/ElMassimo/iles/commit/02cdd5b83df36fbf65261c4dd7a022a075e5244b))
* allow to use no-runtime islands with any JS. prepare support for other frameworks ([546e8d3](https://github.com/ElMassimo/iles/commit/546e8d3dc686c7545d11bfdd928fd7fd0e120a9a))
* defineOnLoad helper to strongly type parameters ([4f93671](https://github.com/ElMassimo/iles/commit/4f93671c40412c1135a7d326f8610bea3524b005))
* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))
* expose route in usePageData ([d227650](https://github.com/ElMassimo/iles/commit/d227650ca39bb217dd3b64cd2f851284bd28f0cd))
* extendFrontmatter hook. unified usage as route.meta.frontmatter ([31062e0](https://github.com/ElMassimo/iles/commit/31062e04193822cddf1ef9069bec9c448b6d3b72))
* implement <script client:...> in Vue components ([03e5abc](https://github.com/ElMassimo/iles/commit/03e5abca90f25689d9c3dcfbbecfb18be9f7a8d5))
* improve debug panel for light color preference ([3c426a6](https://github.com/ElMassimo/iles/commit/3c426a60cf07306c163b030fe86b7b25f4b7c605))
* output async module scripts by default, it's safe for islands ([dd88c99](https://github.com/ElMassimo/iles/commit/dd88c9944a1b27d9c2f9abcff4e1bd59f879efee))
* provide filename in extendFrontmatter hook ([35b55c6](https://github.com/ElMassimo/iles/commit/35b55c6505561c0151960697a7bcebc4953ad968))
* use remark plugin to accurately wrap islands in MDX ([946240d](https://github.com/ElMassimo/iles/commit/946240d9ab0e90536b0aa6e3d6d3b4e564cecc07))
* use Vue SFC parser to detect islands instead of regexes ([e4f319b](https://github.com/ElMassimo/iles/commit/e4f319b48514c2dabdebbf40989ad65352f8bda4))
* warn about missing parenthesis in media query expressions ([aea3b72](https://github.com/ElMassimo/iles/commit/aea3b72f1f0ccfd28f285a55e54d34d7f0bdf844))
* warn when not selecting one of the available hydration strategies ([c7f6c79](https://github.com/ElMassimo/iles/commit/c7f6c7931f5ad72f5dc02a2ca3d23c15c3cfa967))



## [0.2.2](https://github.com/ElMassimo/iles/compare/v0.2.1...v0.2.2) (2021-10-14)


### Bug Fixes

* use unjs/pathe to prevent incompatibilities with windows paths ([#4](https://github.com/ElMassimo/iles/issues/4)) ([f2ffacb](https://github.com/ElMassimo/iles/commit/f2ffacb7cf808600ce565990e7021b409d451d3b))



## [0.2.1](https://github.com/ElMassimo/iles/compare/v0.2.0...v0.2.1) (2021-10-13)



# [0.2.0](https://github.com/ElMassimo/iles/compare/v0.1.1...v0.2.0) (2021-10-13)


### Bug Fixes

* ensure iles dependencies are resolved without shamefully hoisting ([1cf863b](https://github.com/ElMassimo/iles/commit/1cf863b9d8310c89f4c289d07153e5720e84585d))


### Features

* defineOnLoad helper to strongly type parameters ([4f93671](https://github.com/ElMassimo/iles/commit/4f93671c40412c1135a7d326f8610bea3524b005))
* implement <script client:...> in Vue components ([03e5abc](https://github.com/ElMassimo/iles/commit/03e5abca90f25689d9c3dcfbbecfb18be9f7a8d5))
* warn about missing parenthesis in media query expressions ([aea3b72](https://github.com/ElMassimo/iles/commit/aea3b72f1f0ccfd28f285a55e54d34d7f0bdf844))



## [0.1.1](https://github.com/ElMassimo/iles/compare/v0.1.0...v0.1.1) (2021-10-10)


### Features

* add `@/` alias that can be used in vue template image src ([17cced3](https://github.com/ElMassimo/iles/commit/17cced308a11d5f3805dc57f02149538141e977a))



# [0.1.0](https://github.com/ElMassimo/iles/compare/v0.0.16...v0.1.0) (2021-10-08)


### Bug Fixes

* allow typescript in app.ts by using the new transformWithEsbuild API ([8990571](https://github.com/ElMassimo/iles/commit/8990571eba6212e645577c9bd301b845ef9b2f5f))
* use default layout when no name is specified in <Layout> ([5afd159](https://github.com/ElMassimo/iles/commit/5afd159dbf9f5174c9f475d1fa1bfd7a833dc19d))


### Features

* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))
* provide filename in extendFrontmatter hook ([35b55c6](https://github.com/ElMassimo/iles/commit/35b55c6505561c0151960697a7bcebc4953ad968))



## [0.0.16](https://github.com/ElMassimo/iles/compare/v0.0.15...v0.0.16) (2021-09-20)


### Bug Fixes

* router link should alway scrolls to the top in development ([a1cd7f5](https://github.com/ElMassimo/iles/commit/a1cd7f5fb923b87c16ae7f8e30c62c724a463d06))
* smaller output for islands with empty slots ([e982e01](https://github.com/ElMassimo/iles/commit/e982e01820675f31feeb3c00f7a62b1516079454))
* typings for EnhanceApp ([86250ce](https://github.com/ElMassimo/iles/commit/86250ce278e2fd6c359db71477f261bc81938ab5))


### Features

* output async module scripts by default, it's safe for islands ([dd88c99](https://github.com/ElMassimo/iles/commit/dd88c9944a1b27d9c2f9abcff4e1bd59f879efee))



## [0.0.15](https://github.com/ElMassimo/iles/compare/v0.0.14...v0.0.15) (2021-09-20)


### Bug Fixes

* import vueuse/head explicitly in App.vue ([47b50e3](https://github.com/ElMassimo/iles/commit/47b50e38f3eb2b7b6bdf34036fe63ee98a931ac8))


### Features

* add sitemap.xml generation ([5a748e4](https://github.com/ElMassimo/iles/commit/5a748e4ff4b49981b664beb8f709b5d9f0e41f23))



## [0.0.14](https://github.com/ElMassimo/iles/compare/v0.0.13...v0.0.14) (2021-09-20)



## [0.0.13](https://github.com/ElMassimo/iles/compare/v0.0.12...v0.0.13) (2021-09-20)


### Bug Fixes

* inline JSX elements in MDX with client directives should be wrapped ([8f36e23](https://github.com/ElMassimo/iles/commit/8f36e23c93fca10721984f5133424d71c2191cd4))



## [0.0.12](https://github.com/ElMassimo/iles/compare/v0.0.11...v0.0.12) (2021-09-20)


### Features

* use remark plugin to accurately wrap islands in MDX ([946240d](https://github.com/ElMassimo/iles/commit/946240d9ab0e90536b0aa6e3d6d3b4e564cecc07))



## [0.0.11](https://github.com/ElMassimo/iles/compare/v0.0.10...v0.0.11) (2021-09-19)


### Bug Fixes

* simplify @islands/hydration resolution ([8ee99f3](https://github.com/ElMassimo/iles/commit/8ee99f3a94d5a43e277b3eee40bf4e9a4fe18d60))



## 0.0.10 (2021-09-17)


### Features

* allow to use no-runtime islands with any JS. prepare support for other frameworks ([546e8d3](https://github.com/ElMassimo/iles/commit/546e8d3dc686c7545d11bfdd928fd7fd0e120a9a))


## 0.0.9 (2021-09-16)


### Bug Fixes

* prevent vue import query string in chunk filenames ([38bfa75](https://github.com/ElMassimo/iles/commit/38bfa754c3e165bf117ee6e81cdd0d5e1b53b3c5))


### Features

* expose route in usePageData ([d227650](https://github.com/ElMassimo/iles/commit/d227650ca39bb217dd3b64cd2f851284bd28f0cd))
* improve debug panel for light color preference ([3c426a6](https://github.com/ElMassimo/iles/commit/3c426a60cf07306c163b030fe86b7b25f4b7c605))



## 0.0.8 (2021-09-16)

### Features

* use Vue SFC parser to detect islands instead of regexes ([e4f319b](https://github.com/ElMassimo/iles/commit/e4f319b48514c2dabdebbf40989ad65352f8bda4))
* warn when not selecting one of the available hydration strategies ([c7f6c79](https://github.com/ElMassimo/iles/commit/c7f6c7931f5ad72f5dc02a2ca3d23c15c3cfa967))



## 0.0.7 (2021-09-15)


### Bug Fixes

* avoid workspace dep and add devalue ([87b62f6](https://github.com/ElMassimo/iles/commit/87b62f676387f7b3493e194925f9e610cd14068e))
* frontmatter is always available and can be used to define head refs ([fad2eef](https://github.com/ElMassimo/iles/commit/fad2eef6aaec45689b820fdfe760cc0e6593e153))
* prevent duplicates of vue runtime ([2de396d](https://github.com/ElMassimo/iles/commit/2de396db7b79d9e7b773546cf89bcacfac168271))
* use a canonical import path to prevent HMR breakage ([e6552f3](https://github.com/ElMassimo/iles/commit/e6552f31ec7ee2e3080568ac04fee7ac8fdaca38))


### Features

* Add Layout component to easily reference other layouts ([95fa649](https://github.com/ElMassimo/iles/commit/95fa649866814382de94f608cf15a605d6d79338))
* allow 'layout' as a top-level attribute in <route> ([02cdd5b](https://github.com/ElMassimo/iles/commit/02cdd5b83df36fbf65261c4dd7a022a075e5244b))
* extendFrontmatter hook. unified usage as route.meta.frontmatter ([31062e0](https://github.com/ElMassimo/iles/commit/31062e04193822cddf1ef9069bec9c448b6d3b72))



## 0.0.6 (2021-09-15)

### Bug Fixes

* avoid using ref sugar in internals, the syntax is experimental ([c941a0e](https://github.com/ElMassimo/iles/commit/c941a0eed3af9610d4fa20c2c790d65e8b080786))
* move esm dependencies to exclude ([8260215](https://github.com/ElMassimo/iles/commit/8260215a1a8396c3bfa44ab27ca0af75d52041c5))
* prevent dep scan on layouts file ([170b79d](https://github.com/ElMassimo/iles/commit/170b79d7e9e75a2fa477433b60463e722a5c91b7))



