const { findFiles, getDirs, saveFile } = require( './helper' );
const { err } = require( '../logger' );
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

            const result = sass.compile( fullPath, {
                style: compressing ? 'compressed' : 'expanded',
                loadPaths: [ srcDir ]
            } );

            const out = await saveFile( css, file, outDir, result.css );

            res.push( out );

        } catch ( e ) {

            err(`   [!] Error processing ${ file }: ${ e.message }` );

        }

    }

    return res;

}

module.exports = { buildScss };
