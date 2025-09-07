#!/usr/bin/env node

const { loadConfig } = require( './lib/config' );
const { generateConfig } = require( './lib/generator' );
const { log, err } = require( './lib/logger' );
const { syncI18n } = require( './lib/syncI18n' );
const { join } = require( 'node:path' );

async function main () {

    const i18nDir = process.argv.find( arg => arg.startsWith( '--dir=' ) )?.split( '=' )[ 1 ] || 'i18n';
    const configPath = join( process.cwd(), i18nDir, 'i18n.config.yml' );

    try {

        log( `>> Starting i18n sync process ...` );

        log( `>> Loading configuration from ${ configPath }` );
        const config = await loadConfig( configPath );

        log( `>> Syncing translation files from GitHub ... ` );
        const syncResult = await syncI18n( config, i18nDir );

        log( `>> Generating dynamic configuration ...` );
        await generateConfig( syncResult, i18nDir );

        log( `>> i18n sync completed successfully!` );

    } catch ( e ) {

        err( `[!] Error during i18n sync: ${ e.message }` );
        process.exit( 1 );

    }

}

if ( require.main === module ) main();

module.exports = { main };
