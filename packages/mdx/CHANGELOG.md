# [0.8.0](https://github.com/ElMassimo/iles/compare/mdx@0.7.7...mdx@0.8.0) (2022-07-14)


### Bug Fixes

* cannot detect kebab-case components ([#152](https://github.com/ElMassimo/iles/issues/152)) ([30ea6d0](https://github.com/ElMassimo/iles/commit/30ea6d080bd4de84c9755be6239f80c1c7066529)), closes [#151](https://github.com/ElMassimo/iles/issues/151)


### Features

* add pwa module by [@userquin](https://github.com/userquin) ([#127](https://github.com/ElMassimo/iles/issues/127)) ([8d9c2bf](https://github.com/ElMassimo/iles/commit/8d9c2bfb12ae5326815b34699b3c75e03bb7a2de))
* convert to ESM and add support for Vite 3 ([#147](https://github.com/ElMassimo/iles/issues/147)) ([7e397b9](https://github.com/ElMassimo/iles/commit/7e397b908746cd8ec875da2a636ae667ae98cb30))
* upgrade to vite 2.9 🚀 ([f47b6b3](https://github.com/ElMassimo/iles/commit/f47b6b346ef2efc88590749e2d8c8a2fbba7a42a))



## [0.7.7](https://github.com/ElMassimo/iles/compare/mdx@0.7.6...mdx@0.7.7) (2022-03-22)


### Features

* add built-in support for drafts in pages and documents ([#105](https://github.com/ElMassimo/iles/issues/105)) ([90a5948](https://github.com/ElMassimo/iles/commit/90a5948853111a71ffd8019d4624c6d9c9f620dc))
* expose remark and rehype vfile data in `meta` ([11a7741](https://github.com/ElMassimo/iles/commit/11a77412b30c72d98ad967f644e0ae4b5afc32f8))



## [0.7.6](https://github.com/ElMassimo/iles/compare/mdx@0.7.5...mdx@0.7.6) (2022-03-16)


### Bug Fixes

* always handle raw nodes at the root level of mdx (close [#104](https://github.com/ElMassimo/iles/issues/104)) ([844060f](https://github.com/ElMassimo/iles/commit/844060f00aa6ed94b848d03ef5ca2cfb365c19e1))
* support for solid 1.3 (close [#88](https://github.com/ElMassimo/iles/issues/88)) ([#97](https://github.com/ElMassimo/iles/issues/97)) ([77dedd1](https://github.com/ElMassimo/iles/commit/77dedd1f7f81affd01b2f0f27c85b47590835d68))



## [0.7.5](https://github.com/ElMassimo/iles/compare/mdx@0.7.4...mdx@0.7.5) (2022-01-24)


### Bug Fixes

* anchor links in MDX files when prettyUrls is false ([#78](https://github.com/ElMassimo/iles/issues/78)) ([6fb5b59](https://github.com/ElMassimo/iles/commit/6fb5b592095deb3b708d89f1508928e44cdb2f2a))
* prevent double .html suffix when using prettyUrls: false ([b9f3ce6](https://github.com/ElMassimo/iles/commit/b9f3ce6cae179418916781fe2db6f3d9c040f5c3))



## [0.7.4](https://github.com/ElMassimo/iles/compare/mdx@0.7.3...mdx@0.7.4) (2021-12-28)


### Features

* hoist static MDX content instead of creating vnodes ([#66](https://github.com/ElMassimo/iles/issues/66)) ([07a7a36](https://github.com/ElMassimo/iles/commit/07a7a36430c6d97792910e346409027dfe10909b))



## [0.7.3](https://github.com/ElMassimo/iles/compare/mdx@0.7.2...mdx@0.7.3) (2021-12-18)


### Features

* useDocuments composable as a faster and more convenient version of import.meta.globEager ([#62](https://github.com/ElMassimo/iles/issues/62)) ([676a804](https://github.com/ElMassimo/iles/commit/676a80495da4178691c455238d27b8da447fb0a9))



## [0.7.2](https://github.com/ElMassimo/iles/compare/mdx@0.7.1...mdx@0.7.2) (2021-12-13)


### Features

* upgrade to @vitejs/plugin-vue@2.0.0 ([f7656e3](https://github.com/ElMassimo/iles/commit/f7656e37976c206d801f6b7476322cbf1c91aaac))



## [0.7.1](https://github.com/ElMassimo/iles/compare/mdx@0.7.0...mdx@0.7.1) (2021-12-09)


### Bug Fixes

* add dependency to keep package size lighter ([d71a2a1](https://github.com/ElMassimo/iles/commit/d71a2a156caddb14d420ba11b8206d2757d4905e))



# [0.7.0](https://github.com/ElMassimo/iles/compare/mdx@0.3.3...mdx@0.7.0) (2021-12-09)


### Features

* improve extendRoute to have access to the frontmatter ([#56](https://github.com/ElMassimo/iles/issues/56)) ([9eb84e9](https://github.com/ElMassimo/iles/commit/9eb84e9ec7387bcfbd7ffabb4dd7c9b5696c24f2))



## [0.3.3](https://github.com/ElMassimo/iles/compare/mdx@0.3.2...mdx@0.3.3) (2021-12-07)


### Features

* allow mdx render function to receive props ([894c953](https://github.com/ElMassimo/iles/commit/894c953a0d73373c74ed4f06401588849221cdaa))



## [0.3.2](https://github.com/ElMassimo/iles/compare/mdx@0.3.1...mdx@0.3.2) (2021-12-01)


### Features

* expose _raw in MDX to efficiently serialize HTML ([1468435](https://github.com/ElMassimo/iles/commit/1468435e930c671fe7e3b0e910f2b85c65f23af8))



## [0.3.1](https://github.com/ElMassimo/iles/compare/mdx@0.3.0...mdx@0.3.1) (2021-11-30)


### Features

* add withImageSrc option to `markdown` to enable imagetools customization ([6da38bb](https://github.com/ElMassimo/iles/commit/6da38bbe218f53505cd6acb04563e6342b67c66a))



# 0.3.0 (2021-11-26)



