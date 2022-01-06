## [0.7.7-0](https://github.com/ElMassimo/iles/compare/pages@0.7.6...pages@0.7.7-0) (2022-01-06)


### Features

* additional debug information for useDocuments ([42a4457](https://github.com/ElMassimo/iles/commit/42a4457d2a80e247954b37452d26135d9bfa3cc6))



## [0.7.6](https://github.com/ElMassimo/iles/compare/pages@0.7.5...pages@0.7.6) (2022-01-04)


### Bug Fixes

* resolve file before reading frontmatter (windows incompatibility) ([a13986c](https://github.com/ElMassimo/iles/commit/a13986c5bafb736a658e7836c4e783f0cd15ad16))



## [0.7.5](https://github.com/ElMassimo/iles/compare/pages@0.7.4...pages@0.7.5) (2022-01-02)


### Bug Fixes

* apply changes in extendRoutes that don't mutate the array ([31f3508](https://github.com/ElMassimo/iles/commit/31f3508071a7cc21b9bc3e2d7240c08036675a01))
* avoid calling extendFrontmatter or extendRoute before buildStart ([4341cf9](https://github.com/ElMassimo/iles/commit/4341cf9e8ae632a740f296ce3827dde427d7f6d2))



## [0.7.4](https://github.com/ElMassimo/iles/compare/pages@0.7.3...pages@0.7.4) (2021-12-18)


### Features

* useDocuments composable as a faster and more convenient version of import.meta.globEager ([#62](https://github.com/ElMassimo/iles/issues/62)) ([676a804](https://github.com/ElMassimo/iles/commit/676a80495da4178691c455238d27b8da447fb0a9))



## [0.7.3](https://github.com/ElMassimo/iles/compare/pages@0.7.2...pages@0.7.3) (2021-12-17)


### Bug Fixes

* filename parameter in extendFrontmatter should be relative to the root ([9b4dd57](https://github.com/ElMassimo/iles/commit/9b4dd57dc813ea4a4d7deab3299c2cd95920cf6e))


### Features

* upgrade to @vitejs/plugin-vue@2.0.0 ([f7656e3](https://github.com/ElMassimo/iles/commit/f7656e37976c206d801f6b7476322cbf1c91aaac))



## [0.7.2](https://github.com/ElMassimo/iles/compare/pages@0.7.1...pages@0.7.2) (2021-12-11)


### Bug Fixes

* vue is a peer dependency for @islands/pages ([aa9e82a](https://github.com/ElMassimo/iles/commit/aa9e82a39eaefb90ebeca7c709d10dd4766c81f8))



## [0.7.1](https://github.com/ElMassimo/iles/compare/pages@0.7.0...pages@0.7.1) (2021-12-10)


### Features

* extract date and slug from filename and add in meta ([8a77a78](https://github.com/ElMassimo/iles/commit/8a77a786f5868fdb162520b92754eba91a403e62))



# 0.7.0 (2021-12-09)


### Features

* improve extendRoute to have access to the frontmatter ([#56](https://github.com/ElMassimo/iles/issues/56)) ([9eb84e9](https://github.com/ElMassimo/iles/commit/9eb84e9ec7387bcfbd7ffabb4dd7c9b5696c24f2))



## [0.4.2](https://github.com/ElMassimo/iles/compare/frontmatter@0.4.1...frontmatter@0.4.2) (2021-12-06)


### Features

* add `prettyUrls: false` to support services without transparent redirects ([3185aea](https://github.com/ElMassimo/iles/commit/3185aeaa6d7c4e49ec3da0ae60252ab660a70c6c))



## [0.4.1](https://github.com/ElMassimo/iles/compare/frontmatter@0.4.0...frontmatter@0.4.1) (2021-11-30)


### Features

* add withImageSrc option to `markdown` to enable imagetools customization ([6da38bb](https://github.com/ElMassimo/iles/commit/6da38bbe218f53505cd6acb04563e6342b67c66a))



# [0.4.0](https://github.com/ElMassimo/iles/compare/frontmatter@0.3.0...frontmatter@0.4.0) (2021-11-28)


### Bug Fixes

* explicitly catch any import errors that may occur ([821d6cf](https://github.com/ElMassimo/iles/commit/821d6cf4b93d0c676fd29c0b627deca5a697a241))


### Features

* import images in MDX files to enable asset fingerprinting ([832855b](https://github.com/ElMassimo/iles/commit/832855b4a19ac67b572074ba7613cc46e7a6c552))



# [0.3.0](https://github.com/ElMassimo/iles/compare/frontmatter@0.2.0...frontmatter@0.3.0) (2021-11-02)



# [0.2.0](https://github.com/ElMassimo/iles/compare/frontmatter@0.0.3-0...frontmatter@0.2.0) (2021-11-02)

- __BREAKING CHANGES__: Now it's an îles plugin that registers the remark plugin.

## 0.0.3-0 (2021-10-27)


### Bug Fixes

* drop remark-frontmatter and add micromark plugins directly ([8d6f3f3](https://github.com/ElMassimo/iles/commit/8d6f3f3b184674e30181a7ca52361de3baaeb5ac))


### Features

* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))
* extendFrontmatter hook. unified usage as route.meta.frontmatter ([31062e0](https://github.com/ElMassimo/iles/commit/31062e04193822cddf1ef9069bec9c448b6d3b72))
* provide filename in extendFrontmatter hook ([35b55c6](https://github.com/ElMassimo/iles/commit/35b55c6505561c0151960697a7bcebc4953ad968))
* use remark plugin to accurately wrap islands in MDX ([946240d](https://github.com/ElMassimo/iles/commit/946240d9ab0e90536b0aa6e3d6d3b4e564cecc07))



## 0.0.2 (2021-10-08)


### Features

* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))
* extendFrontmatter hook. unified usage as route.meta.frontmatter ([31062e0](https://github.com/ElMassimo/iles/commit/31062e04193822cddf1ef9069bec9c448b6d3b72))
* provide filename in extendFrontmatter hook ([35b55c6](https://github.com/ElMassimo/iles/commit/35b55c6505561c0151960697a7bcebc4953ad968))
* use remark plugin to accurately wrap islands in MDX ([946240d](https://github.com/ElMassimo/iles/commit/946240d9ab0e90536b0aa6e3d6d3b4e564cecc07))



## 0.0.1 (2021-09-16)


### Features

* extendFrontmatter hook. unified usage as route.meta.frontmatter ([31062e0](https://github.com/maximomussini/iles/commit/31062e04193822cddf1ef9069bec9c448b6d3b72))



