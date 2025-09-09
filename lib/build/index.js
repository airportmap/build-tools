#!/usr/bin/env node

const { loadConfig, parseArgv } = require( '../config' );
const { err, log, tOut, tTime } = require( '../logger' );
const { buildScss } = require( './sass' );
const { buildTypeScript } = require( './typescript' );

async function main () {

    log( `[BUILD] Build assets (css/js) ...` );

    const perf = tTime(), args = parseArgv();
    const compressing = !! args.compressed;

    if ( compressing ) log( `>> Compressing output files is enabled` );

    try {

        log( `>> Loading configuration file ...` );
        const config = await loadConfig( args.config );

        log( `>> Build SCSS files ...` );
        await buildScss ( config, compressing );

        log( `>> Build TypeScript files ...` );
        await buildTypeScript( config, compressing );

        log( `>> Build assets completed successfully!` );
        log( `   Finished after ${ tOut( perf ) } sec.` );

    } catch ( e ) {

        err( `[!] Error during build: ${ e.message }` );
        process.exit( 1 );

    }

}

module.exports = { main };
