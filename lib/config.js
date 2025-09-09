const { readFile } = require( 'node:fs/promises' );
const { load } = require( 'js-yaml' );
const { join } = require( 'node:path' );

async function loadConfig ( path ) {

    const cfgPath = join( process.cwd(), path );

    try {

        const cfgContent = await readFile( cfgPath, { encoding: 'utf8' } );
        const config = load( cfgContent, { json: cfgPath.endsWith( '.json' ) } );

        return config;

    } catch ( err ) {

        if ( err.code === 'ENOENT' ) throw new Error (
            `Configuration file not found: ${ cfgPath }`
        );

        throw err;

    }

}

module.exports = { loadConfig };
