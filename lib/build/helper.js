const { log } = require( '../logger' );
const glob = require( 'glob' );
const { existsSync } = require( 'node:fs' );
const { mkdir, readFile, writeFile } = require( 'node:fs/promises' );
const { join, resolve } = require( 'node:path' );

const sanitizePkgName = ( pkg ) => pkg
    .replace( /[^a-zA-Z0-9]/g, '-' )
    .replace( /-([a-z])/g, ( _, l ) => l.toUpperCase() );

const resolvePattern = ( pattern, module, file ) => pattern
    .replaceAll( '{{module}}', module )
    .replaceAll( '{{file}}', file );

const findFiles = ( cwd, pattern, ignore = '', absolute = undefined ) =>
    glob.sync( pattern, { cwd, ignore, absolute } );

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

async function resolveTsPaths ( pkgName, sourceDir = '' ) {

    const pkgRoot = join( process.cwd(), 'node_modules', pkgName );
    const tscPath = join( pkgRoot, 'tsconfig.json' );

    if ( ! existsSync( tscPath ) ) return;

    const tsConfig = JSON.parse( await readFile( tscPath, 'utf8' ) );
    const baseUrl = tsConfig.compilerOptions?.baseUrl || '.';
    const paths = tsConfig.compilerOptions?.paths || {};

    if ( Object.keys( paths ).length === 0 ) return;

    const tsFiles = findFiles(
        join( pkgRoot, sourceDir ),
        '**/*.ts', '**/node_modules/**',
        true
    );

    for ( const file of tsFiles ) {

        let content = await readFile( file, 'utf8' );
        let changed = false;

        for ( const [ alias, targets ] of Object.entries( paths ) ) {

            const aliasPattern = alias.replace( /\*/g, '(.+)' );
            const importRegex = new RegExp( `(['"])${aliasPattern}\\1`, 'g' );

            content = content.replace( importRegex, ( _, quote, subpath ) => {

                let target = targets[ 0 ];

                if ( subpath ) target = target.replace( /\*/, subpath );

                changed = true;
                const absTarget = resolve( pkgRoot, baseUrl, target );
                const relTarget = './' + resolve( absTarget )
                    .replace( resolve( file, '..' ) + '\\', '')
                    .replace( /\\/g, '/' );

                return `${quote}${relTarget}${quote}`;

            } );

        }

        if ( changed ) await writeFile( file, content, 'utf8' );

    }

}

module.exports = {
    sanitizePkgName, resolvePattern, findFiles, getDirs,
    parseFilePath, saveFile, resolveTsPaths
};
