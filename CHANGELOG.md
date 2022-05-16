<a name="2.1.5"></a>
## [2.1.5](https://github.com/apartmenttherapy/react-gpt/compare/v2.1.4...v2.1.5) (2022-05-16)

* negative viewable threshold ([28] (https://github.com/apartmenttherapy/react-gpt/pull/28))

<a name="2.1.4"></a>
## [2.1.4](https://github.com/apartmenttherapy/react-gpt/compare/v2.1.3...v2.1.4) (2022-05-03)



<a name="2.1.3"></a>
## [2.1.3](https://github.com/apartmenttherapy/react-gpt/compare/v2.1.2...v2.1.3) (2022-02-24)

* Remove deprecated ContentService ([23] (https://github.com/apartmenttherapy/react-gpt/pull/23))

<a name="2.1.2"></a>
## [2.1.2](https://github.com/apartmenttherapy/react-gpt/compare/v2.1.1...v2.1.2) (2022-02-22)

* Prefix deprecated React lifecyle methods with `UNSAFE` ([#20](https://github.com/apartmenttherapy/react-gpt/pull/20))
* Use `securepubads.g.doubleclick.net` instead of `www.googletagservices.com` ([#20](https://github.com/apartmenttherapy/react-gpt/pull/20))
* Minor documentation updates ([#21](https://github.com/apartmenttherapy/react-gpt/pull/21))
* Fix tests ([#22](https://github.com/apartmenttherapy/react-gpt/pull/22))


<a name="2.1.1"></a>
## [2.1.1](https://github.com/apartmenttherapy/react-gpt/compare/v2.1.0...v2.1.1) (2019-02-05)


### Performance Improvements

* Use googletag.cmd.push instead of timeout to process queue ([#16](https://github.com/apartmenttherapy/react-gpt/issues/16)) ([5af9ce7](https://github.com/apartmenttherapy/react-gpt/commit/5af9ce7))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/apartmenttherapy/react-gpt/compare/v2.0.3...v2.1.0) (2019-01-28)


### Features

* Add support for custom refresh function ([#14](https://github.com/apartmenttherapy/react-gpt/issues/14)) ([a425e5e](https://github.com/apartmenttherapy/react-gpt/commit/a425e5e))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/apartmenttherapy/react-gpt/compare/v2.0.2...v2.0.3) (2019-01-24)


### Bug Fixes

* Stop multiple refresh on mq change ([#11](https://github.com/apartmenttherapy/react-gpt/issues/11)) ([3cff653](https://github.com/apartmenttherapy/react-gpt/commit/3cff653))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/apartmenttherapy/react-gpt/compare/v2.0.1...v2.0.2) (2019-01-22)


### Bug Fixes

* Do not refresh all ads when new component loads ([#8](https://github.com/apartmenttherapy/react-gpt/issues/8)) ([9f143a8](https://github.com/apartmenttherapy/react-gpt/commit/9f143a8))
* Don't setState on unmounted ad ([#5](https://github.com/apartmenttherapy/react-gpt/issues/5)) ([d7d6173](https://github.com/apartmenttherapy/react-gpt/commit/d7d6173))
* Fix undefined function if apiNotReady ([#6](https://github.com/apartmenttherapy/react-gpt/issues/6)) ([d292947](https://github.com/apartmenttherapy/react-gpt/commit/d292947))
* Replace hasOwnProperty with more reliable check ([#7](https://github.com/apartmenttherapy/react-gpt/issues/7)) ([d6521a7](https://github.com/apartmenttherapy/react-gpt/commit/d6521a7))



<a name="2.0.1"></a>

## [2.0.1](https://github.com/nfl/react-gpt/compare/v2.0.0...v2.0.1) (2018-03-13)

### Code Refactoring

* Adds `onSlotOnload` event
* Allows `["fluid"]` slotSize as an array

<a name="2.0.0"></a>

## [2.0.0](https://github.com/nfl/react-gpt/compare/v1.1.1...v2.0.0) (2018-01-04)

### Bug Fixes

* Removed test util dependencies from distribution ([27187e0](https://github.com/nfl/react-gpt/commit/27187e0))

### Migration notes

**< 2.0.0** you may have imported `createManagerTest` like this:

```
import {createManagerTest} from "react-gpt";
```

**>= 2.0.0** you now need to import `createManagerTest` like this:

```
import {createManagerTest} from "react-gpt/es/utils/createManagerTest";
```

<a name="1.1.1"></a>

## [1.1.1](https://github.com/nfl/react-gpt/compare/v1.0.1...v1.1.1) (2017-11-08)

### Bug Fixes

* Fixed bug in example Router project ([7687ee9](https://github.com/nfl/react-gpt/commit/7687ee9))

### Code Refactoring

* Updated to support React 16 and unit tests refactored for React 16 ([84264e7](https://github.com/nfl/react-gpt/commit/84264e7))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/nfl/react-gpt/compare/v1.0.0...v1.0.1) (2017-09-19)

### Bug Fixes

* **package.json:** Add es folder to published package ([2aa1a03](https://github.com/nfl/react-gpt/commit/2aa1a03))

<a name="1.0.0"></a>

## [1.0.0](https://github.com/nfl/react-gpt/compare/v0.3.0...v1.0.0) (2017-09-18)

### Features

* **createManager:** Export AdManager ([#53](https://github.com/nfl/react-gpt/issues/53)) ([9ed1807](https://github.com/nfl/react-gpt/commit/9ed1807)), closes [#42](https://github.com/nfl/react-gpt/issues/42)
* **package.json:** Add Yarn ([#38](https://github.com/nfl/react-gpt/issues/38)) ([8b7a570](https://github.com/nfl/react-gpt/commit/8b7a570))
* **package.json:** Export es modules ([#54](https://github.com/nfl/react-gpt/issues/54)) ([2d7a3ec](https://github.com/nfl/react-gpt/commit/2d7a3ec)), closes [#29](https://github.com/nfl/react-gpt/issues/29)

<a name="0.3.0"></a>

## [0.3.0](https://github.com/nfl/react-gpt/compare/v0.2.5...v0.3.0) (2017-09-18)

### Code Refactoring

* Throttles scroll-check to render ad faster ([7130060a](https://github.com/nfl/react-gpt/commit/7130060a))
* Use smaller invariant / canUseDom dependencies ([b187381](https://github.com/nfl/react-gpt/commit/b187381))

### Features

* Check bundle-size on PR ([8e51e26](https://github.com/nfl/react-gpt/commit/8e51e26))
* Upgrade eslint and introduce prettier ([17c8b89](https://github.com/nfl/react-gpt/commit/17c8b89))

<a name="0.2.5"></a>

## [0.2.5](https://github.com/nfl/react-gpt/compare/v0.2.4...v0.2.5) (2017-07-31)

### Bug Fixes

* Add yarn.lock ([b7c7c50](https://github.com/nfl/react-gpt/commit/b7c7c50))
* Import PropTypes from prop-types package ([34b61be](https://github.com/nfl/react-gpt/commit/34b61be))
* Move MockGPT out of distribution files ([775fe26](https://github.com/nfl/react-gpt/commit/775fe26))
* Import ReactTestUtils from test-utils ([75e74f6](https://github.com/nfl/react-gpt/commit/75e74f6))

<a name="0.2.4"></a>

## [0.2.4](https://github.com/nfl/react-gpt/compare/v0.2.3...v0.2.4) (2017-03-23)

### Bug Fixes

* more gracefully handle adSlot becoming empty object due to AdBlocker ([7f9a989](https://github.com/nfl/react-gpt/commit/7f9a989))

<a name="0.2.3"></a>

## [0.2.3](https://github.com/nfl/react-gpt/compare/v0.2.2...v0.2.3) (2017-02-21)

### Bug Fixes

* fix calling the same pubads API on Bling not overriding the previous one ([fc374b6](https://github.com/nfl/react-gpt/commit/fc374b6))

<a name="0.2.2"></a>

## [0.2.2](https://github.com/nfl/react-gpt/compare/v0.2.1...v0.2.2) (2016-10-13)

### Code Refactoring

* **API:** update GPT API list ([993c0e0](https://github.com/nfl/react-gpt/commit/993c0e0))

## 0.2.1

Features:

* Initial release
