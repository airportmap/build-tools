#!/usr/bin/env node

const { cfgPath, loadConfig, parseArgv } = require( '../config' );
const { err, log, tOut, tTime } = require( '../logger' );
const { generateConfig } = require( './generator' );
const { REPO, BRANCH, syncI18n } = require( './sync' );

async function main () {

    log( `[SYNC] Syncing translation files ...` );

    const perf = tTime();
    const args = parseArgv();

    try {

        log( `>> Loading configuration file ...` );
        const config = await loadConfig( args.config );
        const path = cfgPath( args.config );

        log( `>> Syncing translation files from GitHub ... ` );
        log( `   Download from @${ REPO }::${ BRANCH }` );
        const syncResult = await syncI18n( config );

        log( `>> Generating dynamic configuration ...` );
        await generateConfig( syncResult, path );

        log( `>> I18n sync completed successfully!` );
        log( `   Finished after ${ tOut( perf ) } sec.` );

    } catch ( e ) {

        err( `[!] Error during i18n sync: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };
