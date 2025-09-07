const { readFile } = require( 'node:fs/promises' );
const { load } = require( 'js-yaml' );

async function loadConfig ( path ) {

    try {

        const cfgContent = await readFile( path, { encoding: 'utf8' } );
        const config = load( cfgContent, { json: path.endsWith( '.json' ) } );

        if ( ! config.i18n || ! config.matrix ) throw new Error (
            `Invalid configuration: missing i18n or matrix section`
        );

        return config;

    } catch ( err ) {

        if ( err.code === 'ENOENT' ) throw new Error (
            `Configuration file not found: ${ path }`
        );

        throw err;

    }

}

function resolvePattern ( pattern, lng, ns ) {

    return pattern
        .replaceAll( '{{lng}}', lng )
        .replaceAll( '{{ns}}', ns );

}

module.exports = { loadConfig, resolvePattern };
