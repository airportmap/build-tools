const glob = require( 'glob' );
const { mkdir } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );

const resolvePattern = ( pattern, module, file ) => pattern.replaceAll( '{{module}}', module ).replaceAll( '{{file}}', file );

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

async function saveFile ( pattern, module, file, source, dir, content ) {

    const outName = resolvePattern( pattern, module, file );
    const outPath = join( dir, outName );

    await writeFile( outPath, content );

    log( `   ... ${ source } → ${ outPath }` );

    return { source, file, output: outPath };

}

module.exports = { resolvePattern, findFiles, getDirs, parseFilePath, saveFile };
