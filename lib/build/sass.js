const { findFiles, getDirs, saveFile } = require( './helper' );
const { err } = require( '../logger' );
const { join } = require( 'node:path' );
const sass = require( 'sass' );

async function buildScss ( config, compressed = false ) {

    const { pkg = '', sourceDir = 'ui', outputDir = 'public', patterns = {}, naming = {} } = config;
    const { scss = '**/css/*.scss', exclude = '**/_*' } = patterns;
    const { css = '{{module}}.{{file}}.css' } = naming;

    const { srcDir, outDir } = await getDirs( sourceDir, outputDir, 'css' );
    const files = findFiles( srcDir, scss, exclude );

    const res = [];

    for ( const file of files ) {

        try {

            const result = sass.compile( join( srcDir, file ), {
                style: compressed ? 'compressed' : 'expanded',
                loadPaths: [ srcDir ]
            } );

            const out = await saveFile( pkg, css, file, outDir, result.css );

            res.push( out );

        } catch ( e ) { err( `   [!] Error processing ${ file }: ${ e.message }` ) }

    }

    return res;

}

module.exports = { buildScss };
