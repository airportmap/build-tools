#!/usr/bin/env node

const { loadConfig } = require( './lib/config' );
const { generateConfig } = require( './lib/generator' );
const { log } = require( './lib/logger' );
const { syncI18n } = require( './lib/syncI18n' );

async function main () {}

if ( require.main === module ) main();

module.exports = { main };
