#!/usr/bin/env node

const { loadConfig } = require( './lib/config' );
const { generateConfig } = require( './lib/generator' );
const { log } = require( './lib/logger' );

async function main () {}

if ( require.main === module ) main();

module.exports = { main };
