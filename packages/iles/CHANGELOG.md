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



