## [0.7.32](https://github.com/ElMassimo/iles/compare/v0.7.31...v0.7.32) (2022-02-22)


### Bug Fixes

* support for solid 1.3 (close [#88](https://github.com/ElMassimo/iles/issues/88)) ([#97](https://github.com/ElMassimo/iles/issues/97)) ([77dedd1](https://github.com/ElMassimo/iles/commit/77dedd1f7f81affd01b2f0f27c85b47590835d68))



## [0.7.31](https://github.com/ElMassimo/iles/compare/v0.7.29...v0.7.31) (2022-02-17)


### Bug Fixes

* add tsconfig.json since .npmignore is not working in combination ([d4fa36f](https://github.com/ElMassimo/iles/commit/d4fa36f227e9f71b2fc54c521366b4fd87fb23a8))
* allow to prevent navigation during dev ([6b3a088](https://github.com/ElMassimo/iles/commit/6b3a08886ab82cc16c3c006467a44ab457b5df55))
* avoid using display: contents for client:visible islands ([5e748ad](https://github.com/ElMassimo/iles/commit/5e748ad07b85edb7e4d2d605623ba9817eb2c244))


### BREAKING CHANGES

* Necessary when using non-Vue components, as the root
will be initially empty, which wouldn't allow it to be detected as
visible.



## [0.7.30](https://github.com/ElMassimo/iles/compare/v0.7.29...v0.7.30) (2022-02-11)


### Bug Fixes

* add tsconfig.json since .npmignore is not working in combination ([d4fa36f](https://github.com/ElMassimo/iles/commit/d4fa36f227e9f71b2fc54c521366b4fd87fb23a8))



## [0.7.29](https://github.com/ElMassimo/iles/compare/v0.7.28...v0.7.29) (2022-02-11)


### Bug Fixes

* avoid adding tsconfig.json to the published package (close [#87](https://github.com/ElMassimo/iles/issues/87)) ([7a553f3](https://github.com/ElMassimo/iles/commit/7a553f3f304b97a76b8c2770e55a73c5380833ec))



## [0.7.28](https://github.com/ElMassimo/iles/compare/v0.7.27...v0.7.28) (2022-02-10)


### Bug Fixes

* compatibility with upcoming vite 2.8 ([780ec86](https://github.com/ElMassimo/iles/commit/780ec86bb399da3d61709bed0264e6e6b72f2db9))



## [0.7.27](https://github.com/ElMassimo/iles/compare/v0.7.26...v0.7.27) (2022-01-26)


### Bug Fixes

* race conditions in useDocuments when adding pages in development ([52f2a7d](https://github.com/ElMassimo/iles/commit/52f2a7dde4088aac0536cc459d5f98851eef8d37))



## [0.7.26](https://github.com/ElMassimo/iles/compare/v0.7.25...v0.7.26) (2022-01-24)


### Features

* upgrade to vue@3.2.29 which fixes static content reinsertion ([6b08c39](https://github.com/ElMassimo/iles/commit/6b08c39e53b3a0b122d03a1471c46094e92406d0))



## [0.7.25](https://github.com/ElMassimo/iles/compare/v0.7.24...v0.7.25) (2022-01-24)


### Bug Fixes

* explicitly set meta.filename for all documents ([a7c04c3](https://github.com/ElMassimo/iles/commit/a7c04c36b2a407cb45e30c29b6c33308650d41d2))
* prevent double .html suffix when using prettyUrls: false ([b9f3ce6](https://github.com/ElMassimo/iles/commit/b9f3ce6cae179418916781fe2db6f3d9c040f5c3))



## [0.7.24](https://github.com/ElMassimo/iles/compare/v0.7.23...v0.7.24) (2022-01-22)


### Bug Fixes

* explicitly use UTF-8 charset in development (close [#77](https://github.com/ElMassimo/iles/issues/77)) ([9dd89c2](https://github.com/ElMassimo/iles/commit/9dd89c2856eb3d3382f1dda2076c71ceb3ce764e))



## [0.7.23](https://github.com/ElMassimo/iles/compare/v0.7.22...v0.7.23) (2022-01-21)


### Bug Fixes

* windows compatibility of island import paths in development ([c3b0860](https://github.com/ElMassimo/iles/commit/c3b0860c8c171c8f51e31a18c1731b966888b933))



## [0.7.22](https://github.com/ElMassimo/iles/compare/v0.7.22-0...v0.7.22) (2022-01-19)


### Bug Fixes

* deterministic src for image presets ([66994d4](https://github.com/ElMassimo/iles/commit/66994d4418115530ad73ca5f75e0518497da9613))


### Features

* add `onSiteBundled` hook that runs before pages are written ([936e279](https://github.com/ElMassimo/iles/commit/936e27992b537acd013e1b92aae5a686b9799304))



## [0.7.22-0](https://github.com/ElMassimo/iles/compare/v0.7.21...v0.7.22-0) (2022-01-06)


### Bug Fixes

* ensure the cjs workaround package.json is written before rendering begins ([3d92c55](https://github.com/ElMassimo/iles/commit/3d92c553ccb61da34a196390575242f9e8a28b0a))


### Features

* additional debug information for useDocuments ([42a4457](https://github.com/ElMassimo/iles/commit/42a4457d2a80e247954b37452d26135d9bfa3cc6))



## [0.7.21](https://github.com/ElMassimo/iles/compare/v0.7.20...v0.7.21) (2022-01-02)


### Bug Fixes

* `ERR_REQUIRE_ESM` error when project type is set to `module` ([#69](https://github.com/ElMassimo/iles/issues/69)) ([6878911](https://github.com/ElMassimo/iles/commit/687891132aa21ebbb23ac90f37efa77517d5bed1))
* ensure sitemap preserves double slashes when targeting a subdomain ([334a4e6](https://github.com/ElMassimo/iles/commit/334a4e67bff30c624434463a95abf0692c00dc8a))



## [0.7.20](https://github.com/ElMassimo/iles/compare/v0.7.19...v0.7.20) (2021-12-28)


### Features

* hoist static MDX content instead of creating vnodes ([#66](https://github.com/ElMassimo/iles/issues/66)) ([07a7a36](https://github.com/ElMassimo/iles/commit/07a7a36430c6d97792910e346409027dfe10909b))
* use internal not found page during development as it's more helpful ([#64](https://github.com/ElMassimo/iles/issues/64)) ([ccbb001](https://github.com/ElMassimo/iles/commit/ccbb0019e67f6bf82a0bfb21ae030e34869ef786))



## [0.7.19](https://github.com/ElMassimo/iles/compare/v0.7.18...v0.7.19) (2021-12-24)


### Bug Fixes

* remove useFile to allow the latest vitest to load iles correctly ([94f7723](https://github.com/ElMassimo/iles/commit/94f77230bed69ffd720a872f094fbdd3d55537da))


### BREAKING CHANGES

* `useFile` can be replicated in userland, sites relying
on it can copy this short composable and adapt it to their needs.

Most of the time, it's not necessary to resolve against the root, as fs
will resolve relative paths against `process.cwd`.



## [0.7.18](https://github.com/ElMassimo/iles/compare/v0.7.17...v0.7.18) (2021-12-24)


### Bug Fixes

* include config.js in the package ([0cd660a](https://github.com/ElMassimo/iles/commit/0cd660a7abf216fb0b66f905aa65f7ea6678da4b))



## [0.7.17](https://github.com/ElMassimo/iles/compare/v0.7.16...v0.7.17) (2021-12-20)


### Bug Fixes

* ensure ~/ and @/ aliases are resolved using the provided srcDir ([7731f16](https://github.com/ElMassimo/iles/commit/7731f16218579759ae1a2f705e123d238944436d))
* resolve DebugPanel explicitly instead of using unplugin-vue-components ([4adb38a](https://github.com/ElMassimo/iles/commit/4adb38a301b7c3728e7d0580d9c07274c9f8c1bf))



## [0.7.16](https://github.com/ElMassimo/iles/compare/v0.7.15...v0.7.16) (2021-12-19)


### Bug Fixes

* node 14 compatibility, replaceAll => replace ([587a176](https://github.com/ElMassimo/iles/commit/587a176ace6114b0abcd49be1f8eb65c8a532f31))



## [0.7.15](https://github.com/ElMassimo/iles/compare/v0.7.14...v0.7.15) (2021-12-19)


### Bug Fixes

* preserve exit code when running iles test ([0178b20](https://github.com/ElMassimo/iles/commit/0178b207262e577a1933dfb0aaea981633fd79dc))
* prevent bug in vue during hmr when no instances are active ([4008502](https://github.com/ElMassimo/iles/commit/40085025afe987f647003557a43e79fdf078d372))


### Features

* allow async items in feeds ([2cda3fc](https://github.com/ElMassimo/iles/commit/2cda3fcdb743a1e80c902a69aef0d2ea12ba1dd9))



## [0.7.14](https://github.com/ElMassimo/iles/compare/v0.7.13...v0.7.14) (2021-12-18)


### Features

* useDocuments composable as a faster and more convenient version of import.meta.globEager ([#62](https://github.com/ElMassimo/iles/issues/62)) ([676a804](https://github.com/ElMassimo/iles/commit/676a80495da4178691c455238d27b8da447fb0a9))



## [0.7.13](https://github.com/ElMassimo/iles/compare/v0.7.12...v0.7.13) (2021-12-17)


### Bug Fixes

* navigate to hash when using turbo ([bfd9b14](https://github.com/ElMassimo/iles/commit/bfd9b14a288ea82953554f672880d491e7f12171))



## [0.7.12](https://github.com/ElMassimo/iles/compare/v0.7.11...v0.7.12) (2021-12-17)


### Bug Fixes

* scroll behavior during development when navigating to hashes ([524f64c](https://github.com/ElMassimo/iles/commit/524f64c88b48934f51c7d57738f227e23e262b66))



## [0.7.11](https://github.com/ElMassimo/iles/compare/v0.7.10...v0.7.11) (2021-12-16)


### Bug Fixes

* clean up interaction observer and media query listeners (turbo) ([783236c](https://github.com/ElMassimo/iles/commit/783236c37b883d5300814a47ae8e6639b872f112))



## [0.7.10](https://github.com/ElMassimo/iles/compare/v0.7.9...v0.7.10) (2021-12-16)


### Bug Fixes

* ensure turbo.js is shipped ([dbf667b](https://github.com/ElMassimo/iles/commit/dbf667b02cdcb34cd2be7cf41b509d34dd9845b1))



## [0.7.9](https://github.com/ElMassimo/iles/compare/v0.7.8...v0.7.9) (2021-12-16)


### Bug Fixes

* off-by-one error in extendSite when a base is provided ([3729e6d](https://github.com/ElMassimo/iles/commit/3729e6dbe3e404f5fbaaee4f9ffb10001d445ede))


### Features

* add `turbo` setting to enable navigation without full-page reloads ([#59](https://github.com/ElMassimo/iles/issues/59)) ([9c1d11a](https://github.com/ElMassimo/iles/commit/9c1d11ab604194410637c2679490ba99805cfebe))
* dispose islands on unmount during development ([70b663a](https://github.com/ElMassimo/iles/commit/70b663a49bdeec3660f97b5e63007c2086108e5c))



## [0.7.8](https://github.com/ElMassimo/iles/compare/v0.7.7...v0.7.8) (2021-12-14)


### Features

* add `test` command that runs vitest ([e317bb5](https://github.com/ElMassimo/iles/commit/e317bb58870d13d12adf221c9ad105ac218b3831))



## [0.7.7](https://github.com/ElMassimo/iles/compare/v0.7.6...v0.7.7) (2021-12-13)



## [0.7.6](https://github.com/ElMassimo/iles/compare/v0.7.5...v0.7.6) (2021-12-13)


### Bug Fixes

* typings for page frontmatter and page meta ([40e4f3e](https://github.com/ElMassimo/iles/commit/40e4f3e09e85804f150035591ddaa4d049a2d5b5))


### Features

* add @islands/excerpt module to extract excerpts from mdx documents ([d2445ad](https://github.com/ElMassimo/iles/commit/d2445ad6f60512a7dfd7acc2e1d7881cf8711247))



## [0.7.5](https://github.com/ElMassimo/iles/compare/v0.7.4...v0.7.5) (2021-12-13)


### Bug Fixes

* avoid optimizing @vue/server-rendered dep ([586f4ed](https://github.com/ElMassimo/iles/commit/586f4edc34a0c64f04e65ff80c90da499904be13))



## [0.7.4](https://github.com/ElMassimo/iles/compare/v0.7.3...v0.7.4) (2021-12-13)


### Bug Fixes

* vue is a peer dependency for @islands/pages ([aa9e82a](https://github.com/ElMassimo/iles/commit/aa9e82a39eaefb90ebeca7c709d10dd4766c81f8))


### Features

* upgrade to @vitejs/plugin-vue@2.0.0 ([f7656e3](https://github.com/ElMassimo/iles/commit/f7656e37976c206d801f6b7476322cbf1c91aaac))



## [0.7.3](https://github.com/ElMassimo/iles/compare/v0.7.2...v0.7.3) (2021-12-10)


### Features

* create @islands/feed module to generate RSS, Atom, and JSON feeds ([#57](https://github.com/ElMassimo/iles/issues/57)) ([5d8f0a4](https://github.com/ElMassimo/iles/commit/5d8f0a4f59a5fba7205bcfed4f36d442b22e29f6))



## [0.7.2](https://github.com/ElMassimo/iles/compare/v0.7.1...v0.7.2) (2021-12-10)


### Bug Fixes

* avoid incorrect resolution of `<Layout>` ([c9618fc](https://github.com/ElMassimo/iles/commit/c9618fc0adcbabab10536819fcb09e9cf1198d77))
* move plugin-vue_export-helper to the vite chunk ([7ba3c5b](https://github.com/ElMassimo/iles/commit/7ba3c5bff187680806aadc8b3b2cbdfa6fa9b3d4))



## [0.7.1](https://github.com/ElMassimo/iles/compare/v0.7.0...v0.7.1) (2021-12-09)



# [0.7.0](https://github.com/ElMassimo/iles/compare/v0.6.13...v0.7.0) (2021-12-09)


### Features

* improve extendRoute to have access to the frontmatter ([#56](https://github.com/ElMassimo/iles/issues/56)) ([9eb84e9](https://github.com/ElMassimo/iles/commit/9eb84e9ec7387bcfbd7ffabb4dd7c9b5696c24f2))



## [0.6.13](https://github.com/ElMassimo/iles/compare/v0.6.12...v0.6.13) (2021-12-07)



## [0.6.12](https://github.com/ElMassimo/iles/compare/v0.6.11...v0.6.12) (2021-12-07)


### Bug Fixes

* useVueRenderer now preserves appContext and currentInstance ([cd90b41](https://github.com/ElMassimo/iles/commit/cd90b417b8cb44109a66dc085338777a7526a81f))


### Features

* auto-detect non-html pages and skip layout ([f687ce5](https://github.com/ElMassimo/iles/commit/f687ce5276fb85314e805fe16f8d18e1ade38866))



## [0.6.11](https://github.com/ElMassimo/iles/compare/v0.6.10...v0.6.11) (2021-12-06)


### Features

* add `prettyUrls: false` to support services without transparent redirects ([3185aea](https://github.com/ElMassimo/iles/commit/3185aeaa6d7c4e49ec3da0ae60252ab660a70c6c))



## [0.6.10](https://github.com/ElMassimo/iles/compare/v0.6.9...v0.6.10) (2021-12-03)


### Bug Fixes

* avoid requiring preact-render-to-string before it's used ([3eb3bb4](https://github.com/ElMassimo/iles/commit/3eb3bb4cba1c3d6c95eb402e349731f64134732f))
* regression in non-HTML pages such as json, rss, and txt ([0006bc0](https://github.com/ElMassimo/iles/commit/0006bc05e151ceee6601374575c1c9286012aee2))


### Features

* add `beforePageRender` and `onSiteRendered` hooks ([579e164](https://github.com/ElMassimo/iles/commit/579e164042ae789e1faa4e64551acaa39e45ee20))
* add a preview command to the cli (no extra deps) ([22ba9bc](https://github.com/ElMassimo/iles/commit/22ba9bc1f9f1dbaac792b4cad0b1bdc61745706a))
* support html entrypoints that coexist with the generated pages ([#53](https://github.com/ElMassimo/iles/issues/53)) ([4bc300e](https://github.com/ElMassimo/iles/commit/4bc300e99ca4bbc6cc0781cee9614ab317b7b783))



## [0.6.9](https://github.com/ElMassimo/iles/compare/v0.6.8...v0.6.9) (2021-12-01)


### Features

* expose _raw in MDX to efficiently serialize HTML ([1468435](https://github.com/ElMassimo/iles/commit/1468435e930c671fe7e3b0e910f2b85c65f23af8))
* new @islands/prism module with code and line highlighting ([f7416ec](https://github.com/ElMassimo/iles/commit/f7416ec8ea45b10fd199bdb2806ea54373ec2bf9))



## [0.6.8](https://github.com/ElMassimo/iles/compare/v0.6.7...v0.6.8) (2021-11-30)



## [0.6.7](https://github.com/ElMassimo/iles/compare/v0.6.6...v0.6.7) (2021-11-28)



## [0.6.6](https://github.com/ElMassimo/iles/compare/v0.6.5...v0.6.6) (2021-11-28)


### Bug Fixes

* workaround Firefox bug related to async module scripts ([74a8d1f](https://github.com/ElMassimo/iles/commit/74a8d1fce738f036c165055acd86fa19261a1d04)), closes [#51](https://github.com/ElMassimo/iles/issues/51)



## [0.6.5](https://github.com/ElMassimo/iles/compare/v0.6.4...v0.6.5) (2021-11-26)


### Bug Fixes

* resolve import aliases in island component paths ([edc014a](https://github.com/ElMassimo/iles/commit/edc014ae2f4e41be8c772202bd893051c00f610a))


### Performance Improvements

* avoid treeshaking on temporary bundles ([9a5df2c](https://github.com/ElMassimo/iles/commit/9a5df2cf210d45a1af2683aa064163c5b291c607))



## [0.6.4](https://github.com/ElMassimo/iles/compare/v0.6.3...v0.6.4) (2021-11-10)


### Bug Fixes

* remove unused `getCurrentInstance` import ([12c615f](https://github.com/ElMassimo/iles/commit/12c615fabee9880b24dcc25abbb6a7dba510f216))



## [0.6.3](https://github.com/ElMassimo/iles/compare/v0.6.2...v0.6.3) (2021-11-10)


### Features

* add `provideMDXComponents` to simplify certain use cases ([de9f331](https://github.com/ElMassimo/iles/commit/de9f331d678ace129eef62a9b269b70fa095d298))



## [0.6.2](https://github.com/ElMassimo/iles/compare/v0.6.2-beta.4...v0.6.2) (2021-11-10)


### Features

* add mdxComponents config option to provide components globally ([a2d63e1](https://github.com/ElMassimo/iles/commit/a2d63e1ad089a2e15debd4433b450d6d4c1434bd))

* allow layouts to pass props to pages ([20eaa3b](https://github.com/ElMassimo/iles/commit/20eaa3b56a18b717b61a306f37ea3d60b82448f5))

* perf: skip babel transform and `@vitejs/plugin-vue-jsx` for MDX components


## [0.6.1](https://github.com/ElMassimo/iles/compare/v0.6.0...v0.6.1) (2021-11-05)


### Bug Fixes

* auto-import iles composables only in srcDir files ([81a68a0](https://github.com/ElMassimo/iles/commit/81a68a0995031bcca0df2da9c659ee85ef70072d))


### Features

* fail on incorrect usage of hydration strategies (close [#31](https://github.com/ElMassimo/iles/issues/31)) ([c7fd936](https://github.com/ElMassimo/iles/commit/c7fd93680c55fc67a8b69dff3389262c71a2731e))



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



