# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-02-27

### Changed

- Moved to bun.
- Removed some dependencies.

## [1.3.4] - 2024-02-27

### Security

- Updated dependencies.

## [1.3.3] - 2023-08-20

### Security

- Updated dependencies.

## [1.3.2] - 2023-06-24

### Security

- Updated dependencies.

## [1.3.1] - 2022-11-28

### Added

- `y` is now a valid truthy value.

### Security

- Updated dependencies.

## [1.3.0] - 2022-10-20

### Removed

- Login with username and password as it's considered deprecated.

### Added

- `LOG_LEVEL` env variable.
- Config parsing and validation.

### Changed

- Removed Cloudflare SDK due to outdated and bloated package.

## [1.2.1] - 2022-05-14

### Added

- Support for `proxied` parameter thanks to @borisbm.

### Security

- Updated dependencies.

## [1.2.0] - 2022-02-07

### Added

- Sigterm and Sigkill hooks for graceful shutdown

### Changed

- Multistage steps to reduce image size

## [1.1.1] - 2022-02-07

### Security

- Updated dependencies.

## [1.1.0] - 2021-10-22

### Changed

- Added typescript for type safety.
- Switched to pnpm.

## [1.0.0] - 2021-05-05

### Added

- Automated build & tagging.
- Arm images.

### Security

- Updated dependencies.
