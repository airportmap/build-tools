const { findFiles, getDirs, saveFile } = require( './helper' );
const { err } = require( '../logger' );
var CleanCSS = require( 'clean-css' );
const { join } = require( 'node:path' );
const sass = require( 'sass' );

async function buildScss ( config, compressed = false ) {

    const { sourceDir = 'ui', outputDir = 'public', patterns = {}, naming = {} } = config;
    const { scss = '**/css/*.scss', exclude = '**/_*' } = patterns;
    const { css = '{{module}}.{{file}}.css' } = naming;

    const { srcDir, outDir } = await getDirs( sourceDir, outputDir, 'css' );
    const files = findFiles( srcDir, scss, exclude );

    const cleanCSS = new CleanCSS( { compatibility: '*', level: { 1: { all: true }, 2: { all: true } } } );
    const res = [];

    for ( const file of files ) {

        try {

            const result = sass.compile( join( srcDir, file ), {
                style: compressed ? 'compressed' : 'expanded',
                loadPaths: [ srcDir ]
            } );

            const output = compressed ? cleanCSS.minify( result.css ).styles : result.css;

            const out = await saveFile( css, file, outDir, output );

            res.push( out );

        } catch ( e ) { err( `   [!] Error processing ${ file }: ${ e.message }` ) }

    }

    return res;

}

module.exports = { buildScss };
