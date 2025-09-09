#!/usr/bin/env node

const { loadConfig, parseArgv } = require( '../config' );
const { err, log, tOut, tTime } = require( '../logger' );
const { buildScss } = require( './sass' );
const { buildTypeScript } = require( './typescript' );
const { buildVendor } = require( './vendor' );

async function main () {

    log( `[BUILD] Build assets (css/js) ...` );

    const perf = tTime(), args = parseArgv();
    const compressed = !! args.compressed;

    if ( compressed ) log( `>> Compressing output files is enabled` );

    try {

        log( `>> Loading configuration file ...` );
        const config = await loadConfig( args.config );

        log( `>> Build SCSS files ...` );
        await buildScss( config, compressed );

        log( `>> Build TypeScript files ...` );
        await buildTypeScript( config, compressed );

        log( `>> Build vendor files ...` );
        await buildVendor( config, compressed );

        log( `>> Build assets completed successfully!` );
        log( `   Finished after ${ tOut( perf ) } sec.` );

    } catch ( e ) {

        err( `[!] Error during build: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };
