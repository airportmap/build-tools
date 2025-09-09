const { findFiles, getDirs, parseFilePath, resolvePattern } = require( './helper' );
const { err, log } = require( '../logger' );
const esbuild = require( 'esbuild' );
const { writeFile } = require( 'node:fs/promises' );
const { join } = require( 'node:path' );

async function buildTypeScript ( config, compressing = false ) {

    const { sourceDir = 'ui', outputDir = 'public', patterns = {}, naming = {} } = config;
    const { typescript = '**/src/*.ts', exclude = '**/_*' } = patterns;
    const { js = '{{module}}.{{file}}.js' } = naming;

    const { srcDir, outDir } = await getDirs( sourceDir, outputDir, 'js' );
    const files = findFiles( srcDir, typescript, exclude );

    const res = [];

    for ( const file of files ) {

        try {

            const fullPath = join( srcDir, file );
            const [ module, filename ] = parseFilePath( file );

            log(`   Processing ${ file } ...` );

            const result = await esbuild.build( {
                entryPoints: [ fullPath ],
                bundle: true,
                minify: compressing,
                format: 'iife',
                target: 'es2020',
                write: false
            } );

            const outName = resolvePattern( js, module, filename );
            const outPath = join( outDir, outName );

            await writeFile( outPath, result.outputFiles[ 0 ].text );

            log(`   ... ${ file } → ${ outPath }` );

            res.push( { source: file, output: outPath } );

        } catch ( e ) {

            err(`   [!] Error processing ${ file }: ${ e.message }` );

        }

    }

    return res;

}

module.exports = { buildTypeScript };
