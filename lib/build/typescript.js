const { findFiles, getDirs, saveFile } = require( './helper' );
const { err } = require( '../logger' );
const esbuild = require( 'esbuild' );
const { join } = require( 'node:path' );

async function buildTypeScript ( config, compressed = false ) {

    const { sourceDir = 'ui', outputDir = 'public', patterns = {}, naming = {}, external = [] } = config;
    const { typescript = '**/src/*.ts', exclude = '**/_*' } = patterns;
    const { js = '{{module}}.{{file}}.js' } = naming;

    const { srcDir, outDir } = await getDirs( sourceDir, outputDir, 'js' );
    const files = findFiles( srcDir, typescript, exclude );

    const res = [];

    for ( const file of files ) {

        try {

            const result = await esbuild.build( {
                entryPoints: [ join( srcDir, file ) ],
                bundle: true,
                minify: compressed,
                format: 'iife',
                target: 'es2020',
                write: false,
                external
            } );

            const out = await saveFile( js, file, outDir, result.outputFiles[ 0 ].text );

            res.push( out );

        } catch ( e ) { err( `   [!] Error processing ${ file }: ${ e.message }` ) }

    }

    return res;

}

module.exports = { buildTypeScript };
