const { log } = require( '../logger' );
const { writeFile } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );

async function generateConfig ( syncResult, path ) {

    const { supportedLngs = [], namespaces = [] } = syncResult;

    const generatedCfg = { supportedLngs, namespaces };
    const outputPath = join( process.cwd(), path, 'i18n.generated.json' );

    await writeFile( outputPath, JSON.stringify( generatedCfg, null, 2 ), 'utf8' );

    log( `>> Generated configuration: ${ outputPath }` );
    log( `   Languages: ${ supportedLngs.join( ', ' ) }` );
    log( `   Namespaces: ${ namespaces.join( ', ' ) }` );

}

module.exports = { generateConfig };
