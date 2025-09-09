const { err, log } = require( '../logger' );
const { sanitizePkgName } = require( './helper' );
const { buildScss } = require( './sass' );
const { buildTypeScript } = require( './typescript' );
const { join } = require( 'node:path' );

async function buildVendor ( config, compressed ) {

    const { naming = {}, vendor = {} } = config;
    const { vendorCss = '{{pkg}}.{{file}}.vendor.css', vendorJs = '{{pkg}}.{{file}}.vendor.js' } = naming;

    for ( const [ pkg, cfg ] of Object.entries( vendor ) ) {

        const { name = null, sourceDir = '', ...patterns } = cfg;
        const pkgName = name || sanitizePkgName( name );

        try {

            config.sourceDir = join( 'node_modules', pkg, patterns.sourceDir || '' );
            config.patterns = patterns;
            config.naming = {
                css: vendorCss.replaceAll( '{{pkg}}', pkgName ),
                js: vendorJs.replaceAll( '{{pkg}}', pkgName )
            };

            log( `   Processing package: ${ pkg } as ${ pkgName } ...` );

            await buildScss( config, compressed );
            await buildTypeScript( config, compressed );

        } catch ( e ) { err( `   [!] Error processing ${ pkg }: ${ e.message }` ) }

    }

}

module.exports = { buildVendor };
