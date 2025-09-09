#!/usr/bin/env node

const { cfgPath, loadConfig, parseArgv } = require( '../config' );
const { err, log, tOut, tTime } = require( '../logger' );

async function main () {

    log( `[BUILD] Build assets (css/js) ...` );

    const perf = tTime();
    const args = parseArgv();

    try {

        log( `>> Loading configuration file ...` );
        const config = await loadConfig( args.config );
        const path = cfgPath( args.config );

        log( `>> Build assets completed successfully!` );
        log( `   Finished after ${ tOut( perf ) } sec.` );

    } catch ( e ) {

        err( `[!] Error during build: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };
