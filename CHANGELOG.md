# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [15.0.0](https://github.com/mojaloop/ml-testing-toolkit/compare/v14.2.0...v15.0.0) (2022-07-28)


### ⚠ BREAKING CHANGES

* **mojaloop/#2092:** Major version bump for node v16 LTS support, re-structuring of project directories to align to core Mojaloop repositories and docker image now uses `/opt/app` instead of `/opt/mojaloop-testing-toolkit` which will impact config mounts, and changed the port number from 5000 to 4040 which will impact the values in TTK environment files used in test executions and helm values files used in K8S deployments.

Major version bump since this is a big upgrade.

### Features

* **mojaloop/#2092:** upgraded node version  and refactored postman functional tests ([#215](https://github.com/mojaloop/ml-testing-toolkit/issues/215)) ([4ac6f40](https://github.com/mojaloop/ml-testing-toolkit/commit/4ac6f407a1ca274efb930ea99846c96790ca2d8a)), closes [mojaloop/#2092](https://github.com/mojaloop/project/issues/2092)