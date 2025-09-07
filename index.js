#!/usr/bin/env node

const { loadConfig } = require( './lib/config' );
const { generateConfig } = require( './lib/generator' );
const { log, err } = require( './lib/logger' );
const { syncI18n } = require( './lib/syncI18n' );

async function main () {

    try {

        log( `>> Starting i18n sync process ...` );

        log( `>> Loading configuration file ...` );
        const config = await loadConfig();

        log( `>> Syncing translation files from GitHub ... ` );
        const syncResult = await syncI18n( config );

        log( `>> Generating dynamic configuration ...` );
        await generateConfig( syncResult );

        log( `>> i18n sync completed successfully!` );

    } catch ( e ) {

        err( `[!] Error during i18n sync: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };
