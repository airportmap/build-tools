const { err, log } = require( '../logger' );
const glob = require( 'glob' );
const { writeFile } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );
const sass = require( 'sass' );

const resolvePattern = ( pattern, module, file ) => pattern.replaceAll( '{{module}}', module ).replaceAll( '{{file}}', file );

function parseFilePath ( filePath ) {

    const [ module, ...parts ] = filePath.replaceAll( '\\', '/' ).split( '/' );
    return [ module, parts.filter( p => p !== 'css' ).join( '.' ).replace( /\.scss$/, '' ) ];

}

async function buildScss ( config, compressing = false ) {

    const srcDir = join( process.cwd(), config.sourceDir || 'ui' );
    const outDir = join( process.cwd(), config.outputDir || 'public', 'css' );
    const res = [];

    const scssFiles = glob.sync( config.patterns?.scss || '**/css/*.scss', {
        cwd: srcDir, ignore: config.patterns?.exclude || '**/_*'
    } );

    for ( const file of scssFiles ) {

        try {

            const fullPath = join( srcDir, file );
            const [ module, filename ] = parseFilePath( file );

            log(`   Processing ${ file } ...` );

            const result = sass.compile( fullPath, {
                style: compressing ? 'compressed' : 'expanded',
                loadPaths: [ srcDir ]
            } );

            const outName = resolvePattern( config.naming?.css || '{{module}}.{{file}}.css', module, filename );
            const outPath = join( outDir, outName );

            await writeFile( outPath, result.css );

            log(`   ... ${ file } → ${ outPath }` );

            res.push( { source: file, output: outPath } );

        } catch ( e ) {

            err(`   [!] Error processing ${ file }: ${ e.message }` );

        }

    }

    return res;

}

module.exports = { buildScss };
