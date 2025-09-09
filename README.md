# @airportmap/build-tools

This repository contains various build tools for use in Airportmap projects.

## Installation

Install via npm from GitHub repository:

```bash
npm install --save-dev github:airportmap/build-tools
```

## Tools

### build-assets

Use `build-assets` to build assets (css/js):

```bash
build-assets --config=project/build-assets.config.yml
build-assets --config=project/build-assets.config.yml --compressed
build-assets --config=project/build-assets.config.yml --ci
```

### i18n-sync

Use `i18n-sync` to sync translation files:

```bash
i18n-sync --config=i18n/i18n.config.yml
i18n-sync --config=i18n/i18n.config.yml --ci
```
