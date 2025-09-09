const { findFiles, getDirs, parseFilePath, resolvePattern } = require( './helper' );
const { err, log } = require( '../logger' );
const { writeFile } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );
const sass = require( 'sass' );

async function buildScss ( config, compressing = false ) {

    const { sourceDir = 'ui', outputDir = 'public', patterns = {}, naming = {} } = config;
    const { scss = '**/css/*.scss', exclude = '**/_*' } = patterns;
    const { css = '{{module}}.{{file}}.css' } = naming;

    const { srcDir, outDir } = await getDirs( sourceDir, outputDir, 'css' );
    const files = findFiles( srcDir, scss, exclude );

    const res = [];

    for ( const file of files ) {

        try {

            const fullPath = join( srcDir, file );
            const [ module, filename ] = parseFilePath( file );

            log(`   Processing ${ file } ...` );

            const result = sass.compile( fullPath, {
                style: compressing ? 'compressed' : 'expanded',
                loadPaths: [ srcDir ]
            } );

            const outName = resolvePattern( css, module, filename );
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
