## [0.3.7](https://github.com/ElMassimo/iles/compare/hydration@0.3.6...hydration@0.3.7) (2022-02-17)


### Bug Fixes

* avoid using display: contents for client:visible islands ([5e748ad](https://github.com/ElMassimo/iles/commit/5e748ad07b85edb7e4d2d605623ba9817eb2c244))


### Features

* add attribute on island hydration, useful for integration tests ([776ad6b](https://github.com/ElMassimo/iles/commit/776ad6b363b0cdf4ce0f521fae896e3a8691b993))
* upgrade to vue@3.2.29 which fixes static content reinsertion ([6b08c39](https://github.com/ElMassimo/iles/commit/6b08c39e53b3a0b122d03a1471c46094e92406d0))


### BREAKING CHANGES

* Necessary when using non-Vue components, as the root
will be initially empty, which wouldn't allow it to be detected as
visible.



## [0.3.6](https://github.com/ElMassimo/iles/compare/hydration@0.3.5...hydration@0.3.6) (2021-12-16)


### Bug Fixes

* hydration package in ssr ([926377b](https://github.com/ElMassimo/iles/commit/926377be882fb4092749f070c6fe27718f237309))



## [0.3.5](https://github.com/ElMassimo/iles/compare/hydration@0.3.4...hydration@0.3.5) (2021-12-16)


### Bug Fixes

* clean up interaction observer and media query listeners (turbo) ([783236c](https://github.com/ElMassimo/iles/commit/783236c37b883d5300814a47ae8e6639b872f112))



## [0.3.4](https://github.com/ElMassimo/iles/compare/hydration@0.3.3...hydration@0.3.4) (2021-12-16)


### Bug Fixes

* vue is a peer dependency for @islands/pages ([aa9e82a](https://github.com/ElMassimo/iles/commit/aa9e82a39eaefb90ebeca7c709d10dd4766c81f8))


### Features

* add `turbo` setting to enable navigation without full-page reloads ([#59](https://github.com/ElMassimo/iles/issues/59)) ([9c1d11a](https://github.com/ElMassimo/iles/commit/9c1d11ab604194410637c2679490ba99805cfebe))
* dispose islands on unmount during development ([70b663a](https://github.com/ElMassimo/iles/commit/70b663a49bdeec3660f97b5e63007c2086108e5c))
* upgrade to @vitejs/plugin-vue@2.0.0 ([f7656e3](https://github.com/ElMassimo/iles/commit/f7656e37976c206d801f6b7476322cbf1c91aaac))



## [0.3.3](https://github.com/ElMassimo/iles/compare/hydration@0.3.2...hydration@0.3.3) (2021-11-09)


### Bug Fixes

* drop remark-frontmatter and add micromark plugins directly ([8d6f3f3](https://github.com/ElMassimo/iles/commit/8d6f3f3b184674e30181a7ca52361de3baaeb5ac))


### Features

* **devtools:** display props in hydration timeline ([112ba62](https://github.com/ElMassimo/iles/commit/112ba62890234573f86200ffd4082af8f64f2634))



## [0.3.2](https://github.com/ElMassimo/iles/compare/hydration@0.3.1...hydration@0.3.2) (2021-10-21)


### Features

* allow passing multiple slots to Svelte islands ([3bb76eb](https://github.com/ElMassimo/iles/commit/3bb76eb592c36a5a2249af92a43e97aa84fd4140))



## [0.3.1](https://github.com/ElMassimo/iles/compare/hydration@0.3.0...hydration@0.3.1) (2021-10-19)



## [0.3.1](https://github.com/ElMassimo/iles/compare/hydration@0.3.0...hydration@0.3.1) (2021-10-19)



# 0.3.0 (2021-10-19)


### Features

* allow to use no-runtime islands with any JS. prepare support for other frameworks ([546e8d3](https://github.com/ElMassimo/iles/commit/546e8d3dc686c7545d11bfdd928fd7fd0e120a9a))
* defineOnLoad helper to strongly type parameters ([4f93671](https://github.com/ElMassimo/iles/commit/4f93671c40412c1135a7d326f8610bea3524b005))
* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))



## [0.0.5](https://github.com/ElMassimo/iles/compare/hydration@0.0.4...hydration@0.0.5) (2021-10-13)


### Features

* defineOnLoad helper to strongly type parameters ([4f93671](https://github.com/ElMassimo/iles/commit/4f93671c40412c1135a7d326f8610bea3524b005))



## [0.0.4](https://github.com/ElMassimo/iles/compare/hydration@0.0.3...hydration@0.0.4) (2021-10-08)


### Features

* Docs + Layout Shortcuts + Meta + Site + SEO Tags ([#3](https://github.com/ElMassimo/iles/issues/3)) ([4ed90b7](https://github.com/ElMassimo/iles/commit/4ed90b72cf354823f023dd09f6797b8b71cff35b))



## 0.0.3 (2021-09-17)


### Features

* allow to use no-runtime islands with any JS. prepare support for other frameworks ([546e8d3](https://github.com/ElMassimo/iles/commit/546e8d3dc686c7545d11bfdd928fd7fd0e120a9a))



