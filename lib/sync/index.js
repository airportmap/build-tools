#!/usr/bin/env node

const { parseArgv, loadConfig } = require( '../config' );
const { log, err } = require( '../logger' );

async function main () {

    log( `[SYNC] Syncing translation files ...` );

    const args = parseArgv();

    try {

        log( `>> Loading configuration file ...` );
        const config = await loadConfig( args.config );

    } catch ( e ) {

        err( `[!] Error during i18n sync: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };