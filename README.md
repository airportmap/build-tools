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
build-assets --config=build-assets.config.json
build-assets --config=build-assets.config.json --compressed
build-assets --config=build-assets.config.json --ci
```

### i18n-sync

Use `i18n-sync` to sync translation files:

```bash
i18n-sync --config=i18n/i18n.config.json
i18n-sync --config=i18n/i18n.config.json --ci
```
