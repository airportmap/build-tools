const { mkdir, writeFile } = require( 'node:fs/promises' );
const { dirname, join } = require( 'node:path' );
const fetch = require( 'node-fetch' ).default;

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

function path2Parts ( filePath ) {

    const [ , lng, ns ] = filePath.match( /^([^/]+)\/([^/]+)\.json$/ ) || [];

    return [ lng, ns ];

}

function matchesPattern ( filePath, lngs, namespaces ) {

    const [ lng, ns ] = path2Parts( filePath );
    if ( ! lng || ! ns ) return false;

    const match = ( v, patterns ) => patterns.some( pattern => {

        if ( pattern === '*' ) return true;
        if ( ! pattern.includes( '*' ) ) return pattern === v;

        const regex = new RegExp( '^' + pattern.replace( /\*/g, '.*' ) + '$' );
        return regex.test( v );

    } );

    return match( lng, lngs ) && match( ns, namespaces );

}

async function syncI18n ( config, i18nDir ) {

    const { i18n, matrix } = config;
    const localesPath = join( process.cwd(), i18nDir, i18n.path );

    const availableFiles = await fetchFileList();

    const lngs = matrix.lngs || [ '*' ];
    const namespaces = matrix.ns || [ '*' ];

    const matchingFiles = availableFiles.filter( filePath =>
        matchesPattern( filePath, lngs, namespaces )
    );

    const downloadedFiles = [];

    for ( const filePath of matchingFiles ) {

        const [ lng, ns ] = path2Parts( filePath );

        const targetPath = join( localesPath, resolvePattern( i18n.pattern, lng, ns ) );
        await downloadFile( filePath, targetPath );

        downloadedFiles.push( { lng, ns, path: targetPath } );

    }

    const supportedLngs = [ ...new Set ( downloadedFiles.map( f => f.lng ) ) ].sort();
    const supportedNs = [ ...new Set ( downloadedFiles.map ( f => f.ns ) ) ].sort();

    log( `>> Processed ${ downloadedFiles.length } files for ${ supportedLngs.length } languages` );

    return { supportedLngs, namespaces: supportedNs };

}

module.exports = { syncI18n };
