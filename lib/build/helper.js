const { log } = require( '../logger' );
const glob = require( 'glob' );
const { mkdir, writeFile } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );

const sanitizePkgName = ( pkg ) => pkg
    .replace( /[^a-zA-Z0-9]/g, '-' )
    .replace( /-([a-z])/g, ( _, l ) => l.toUpperCase() );

const resolvePattern = ( pattern, module, file, pkg = '' ) => pattern
    .replaceAll( '{{pkg}}', sanitizePkgName( pkg ) )
    .replaceAll( '{{module}}', module )
    .replaceAll( '{{file}}', file );

const findFiles = ( cwd, pattern, ignore = '' ) => glob.sync( pattern, { cwd, ignore } );

async function getDirs ( sourceDir, outputDir, type = '' ) {

    const srcDir = join( process.cwd(), sourceDir );
    const outDir = join( process.cwd(), outputDir, type );

    await mkdir( outDir, { recursive: true } );

    return { srcDir, outDir };
    
}

function parseFilePath ( filePath ) {

    const [ module, ...parts ] = filePath.replaceAll( '\\', '/' ).split( '/' );

    return [ module, parts.filter(
        ( p ) => p !== 'css' && p !== 'js' && p !== 'src'
    ).join( '.' ).replace( /\.scss|\.js|\.ts$/, '' ) ];

}

async function saveFile ( pattern, file, outDir, content ) {

    const [ module, filename ] = parseFilePath( file );
    const outName = resolvePattern( pattern, module, filename );
    const outPath = join( outDir, outName );

    await writeFile( outPath, content );

    log( `   ... ${ file } → ${ outPath }` );

    return { source: file, output: outPath };

}

module.exports = {
    sanitizePkgName, resolvePattern, findFiles,
    getDirs, parseFilePath, saveFile
};
