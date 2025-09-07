const { mkdir, writeFile } = require( 'node:fs/promises' );
const { dirname } = require( 'node:path' );
const fetch = require( 'node-fetch' );

const REPO = 'airportmap/i18n';
const BRANCH = 'master';

async function fetchFileList () {

    const apiUrl = `https://api.github.com/repos/${ REPO }/git/trees/${ BRANCH }?recursive=1`;
    const response = await fetch( apiUrl );

    if ( ! response.ok ) throw new Error (
        `Failed to fetch file list: ${ response.statusText }`
    );

    const data = await response.json();

    return data.tree
        .filter( i => i.type === 'blob' && i.path.endsWith( '.json' ) )
        .map( i => i.path );

}

async function downloadFile ( filePath, targetPath ) {

    const url = `https://raw.githubusercontent.com/${ REPO }/${ BRANCH }/${ filePath }`;
    const response = await fetch( url );

    if ( ! response.ok ) throw new Error (
        `Failed to download ${ filePath }: ${ response.statusText }`
    );

    const content = await response.text();

    await mkdir( dirname( targetPath ), { recursive: true } );
    await writeFile( targetPath, content, 'utf8' );

    log( `   ... ${ filePath } → ${ targetPath }` );

}

function matchesPattern ( filePath, lngs, namespaces ) {

    const [ , lng, ns ] = filePath.match( /^([^/]+)\/([^/]+)\.json$/ ) || [];
    if ( ! lng || ! ns ) return false;

    const match = ( value, patterns ) => patterns.some( pattern => {

        if ( pattern === '*' ) return true;
        if ( ! pattern.includes( '*' ) ) return pattern === value;

        const regex = new RegExp( '^' + pattern.replace( /\*/g, '.*' ) + '$' );
        return regex.test( value );

    } );

    return match( lng, lngs ) && match( ns, namespaces );

}

async function syncI18n ( config, i18nDir ) {}

module.exports = { syncI18n };
