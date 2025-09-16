const { fetchFileList, downloadFile } = require( '../fetch' );
const { log } = require( '../logger' );
const { join } = require( 'node:path' );

const REPO = 'airportmap/i18n';
const BRANCH = 'master';

async function getAvailableFiles () {

    const tree = await fetchFileList( REPO, BRANCH );

    return tree
        .filter( i => i.type === 'blob' && i.path.endsWith( '.json' ) )
        .map( i => i.path );

}

const path2Parts = ( filePath ) => ( filePath.match( /^([^/]+)\/([^/]+)\.json$/ ) || [] ).slice( 1 );

const resolvePattern = ( pattern, lng, ns ) => pattern.replaceAll( '{{lng}}', lng ).replaceAll( '{{ns}}', ns );

function matchesPattern ( filePath, lngs, namespaces ) {

    const [ lng, ns ] = path2Parts( filePath );
    if ( ! lng || ! ns ) return false;

    const match = ( v, patterns ) => patterns.some( pattern => {

        if ( pattern === '_schema' ) return false;
        if ( pattern === '*' ) return true;
        if ( ! pattern.includes( '*' ) ) return pattern === v;

        const regex = new RegExp( '^' + pattern.replace( /\*/g, '.*' ) + '$' );
        return regex.test( v );

    } );

    return match( lng, lngs ) && match( ns, namespaces );

}

async function syncI18n ( config ) {

    const { i18n, matrix } = config;
    const localesPath = join( process.cwd(), i18n.path );

    const availableFiles = await getAvailableFiles();

    const lngs = matrix.lngs || [ '*' ];
    const namespaces = matrix.ns || [ '*' ];

    const matchingFiles = availableFiles.filter( filePath =>
        matchesPattern( filePath, lngs, namespaces )
    );

    const downloadedFiles = [];

    for ( const filePath of matchingFiles ) {

        const [ lng, ns ] = path2Parts( filePath );

        const targetPath = join( localesPath, resolvePattern( i18n.pattern, lng, ns ) );
        await downloadFile( REPO, BRANCH, filePath, targetPath );

        downloadedFiles.push( { lng, ns, path: targetPath } );

    }

    const supportedLngs = [ ...new Set ( downloadedFiles.map( f => f.lng ) ) ].sort();
    const supportedNs = [ ...new Set ( downloadedFiles.map ( f => f.ns ) ) ].sort();

    log( `   Processed ${ downloadedFiles.length } files for ${ supportedLngs.length } languages` );

    return { supportedLngs, namespaces: supportedNs };

}

module.exports = { REPO, BRANCH, syncI18n };
