## [0.8.1](https://github.com/ElMassimo/iles/compare/headings@0.8.0...headings@0.8.1) (2022-09-19)


### Bug Fixes

* prevent duplicated slugs for headings with the same title ([#155](https://github.com/ElMassimo/iles/issues/155)) ([b156ecc](https://github.com/ElMassimo/iles/commit/b156eccd4e089082f51af11802c33b69d25df200))



# [0.8.0](https://github.com/ElMassimo/iles/compare/headings@0.1.2...headings@0.8.0) (2022-07-14)


### Features

* convert to ESM and add support for Vite 3 ([#147](https://github.com/ElMassimo/iles/issues/147)) ([7e397b9](https://github.com/ElMassimo/iles/commit/7e397b908746cd8ec875da2a636ae667ae98cb30))



## [0.1.2](https://github.com/ElMassimo/iles/compare/headings@0.1.1...headings@0.1.2) (2022-03-22)


### Features

* add typings for meta.headings ([0ca6cde](https://github.com/ElMassimo/iles/commit/0ca6cdef836293aff2d5415b8cd0afdc8172dafd))
* expose remark and rehype vfile data in `meta` ([11a7741](https://github.com/ElMassimo/iles/commit/11a77412b30c72d98ad967f644e0ae4b5afc32f8))
* new @islands/prism module with code and line highlighting ([f7416ec](https://github.com/ElMassimo/iles/commit/f7416ec8ea45b10fd199bdb2806ea54373ec2bf9))



## [0.1.1](https://github.com/ElMassimo/iles/compare/headings@0.1.0...headings@0.1.1) (2021-11-03)


### Bug Fixes

* allow manually requiring from CJS applications ([664235d](https://github.com/ElMassimo/iles/commit/664235dc0414fa7c9bb37e9c92bddaca5d01bd6e))



# 0.1.0 (2021-11-02)

- Add ids and anchor links to headings, and extract them to meta
- Renamed from `@islands/headers` to `@islands/headings`
- Now it's an îles plugin that registers the rehype plugin
