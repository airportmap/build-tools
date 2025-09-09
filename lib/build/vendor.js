const { err, log } = require( '../logger' );
const { buildScss } = require( './sass' );
const { buildTypeScript } = require( './typescript' );
const { join } = require( 'node:path' );

async function buildVendor ( config, compressed ) {

    const { naming = {}, vendor = {} } = config;
    const { vendorCss = 'vendor.{{pkg}}.{{file}}.css', vendorJs = 'vendor.{{pkg}}.{{file}}.js' } = naming;

    config.naming = { css: vendorCss, js: vendorJs };

    for ( const [ pkg, patterns ] of Object.entries( vendor ) ) {

        try {

            log( `   Processing package: ${ pkg } ...` );

            config.sourceDir = join( process.cwd(), 'node_modules', pkg, patterns.sourceDir || '' );
            config.patterns = patterns;

            await buildScss( config, compressed );
            await buildTypeScript( config, compressed );

        } catch ( e ) { err( `   [!] Error processing ${ pkg }: ${ e.message }` ) }

    }

}

module.exports = { buildVendor };
