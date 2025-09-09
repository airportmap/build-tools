const { load } = require( 'js-yaml' );
const { readFile } = require( 'node:fs/promises' );
const { dirname, join } = require( 'node:path' );
const yargs = require( 'yargs' );
const { hideBin } = require( 'yargs/helpers' );

const parseArgv = () => yargs( hideBin( process.argv ) ).parse();

const cfgPath = ( path ) => dirname( path );

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

module.exports = { parseArgv, cfgPath, loadConfig };
