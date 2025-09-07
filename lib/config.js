const { readFile } = require( 'node:fs/promises' );
const { load } = require( 'js-yaml' );
const { join } = require( 'node:path' );

async function loadConfig () {

    const cfgPath = join( process.cwd(), 'i18n/i18n.config.yml' );

    try {

        const cfgContent = await readFile( cfgPath, { encoding: 'utf8' } );
        const config = load( cfgContent, { json: cfgPath.endsWith( '.json' ) } );

        if ( ! config.i18n || ! config.matrix ) throw new Error (
            `Invalid configuration: missing i18n or matrix section`
        );

        return config;

    } catch ( err ) {

        if ( err.code === 'ENOENT' ) throw new Error (
            `Configuration file not found: ${ cfgPath }`
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
