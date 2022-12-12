# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [15.3.0](https://github.com/mojaloop/ml-testing-toolkit/compare/v15.2.1...v15.3.0) (2022-12-07)


### Features

* **mojaloop/2890:** redesigned ttk definition report ([#223](https://github.com/mojaloop/ml-testing-toolkit/issues/223)) ([eb87fa6](https://github.com/mojaloop/ml-testing-toolkit/commit/eb87fa60476410d063c1ee3b38605514d43e78ce))

### [15.2.1](https://github.com/mojaloop/ml-testing-toolkit/compare/v15.2.0...v15.2.1) (2022-11-07)


### Bug Fixes

* parameterized the inbound request size ([#221](https://github.com/mojaloop/ml-testing-toolkit/issues/221)) ([ad8226a](https://github.com/mojaloop/ml-testing-toolkit/commit/ad8226ae048de0ea5e1b51e80fed82fc6d7c91c5))

## [15.2.0](https://github.com/mojaloop/ml-testing-toolkit/compare/v15.1.0...v15.2.0) (2022-10-31)


### Features

* **mojaloop/2997:** dynamic ttk rules and request mutation ([#219](https://github.com/mojaloop/ml-testing-toolkit/issues/219)) ([1374c24](https://github.com/mojaloop/ml-testing-toolkit/commit/1374c24d2b6f6d08b247f349922f42dffc07e999))

## [15.1.0](https://github.com/mojaloop/ml-testing-toolkit/compare/v15.0.0...v15.1.0) (2022-08-24)


### Features

* **mojaloop/2814:** added moja sim inbound api ([#218](https://github.com/mojaloop/ml-testing-toolkit/issues/218)) ([0b877af](https://github.com/mojaloop/ml-testing-toolkit/commit/0b877af8f1d0cb27d17e29c62eb1c7b7219d23ac))

## [15.0.0](https://github.com/mojaloop/ml-testing-toolkit/compare/v14.2.0...v15.0.0) (2022-07-28)


### ⚠ BREAKING CHANGES

* **mojaloop/#2092:** Major version bump for node v16 LTS support, re-structuring of project directories to align to core Mojaloop repositories and docker image now uses `/opt/app` instead of `/opt/mojaloop-testing-toolkit` which will impact config mounts, and changed the port number from 5000 to 4040 which will impact the values in TTK environment files used in test executions and helm values files used in K8S deployments.

Major version bump since this is a big upgrade.

### Features

* **mojaloop/#2092:** upgraded node version  and refactored postman functional tests ([#215](https://github.com/mojaloop/ml-testing-toolkit/issues/215)) ([4ac6f40](https://github.com/mojaloop/ml-testing-toolkit/commit/4ac6f407a1ca274efb930ea99846c96790ca2d8a)), closes [mojaloop/#2092](https://github.com/mojaloop/project/issues/2092)
