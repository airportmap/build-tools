const isCI = process.argv.includes( '--ci' );

function log ( msg ) { if ( ! isCI ) console.log( msg ) }

function err ( msg ) { console.error( msg ) }

module.exports = { log, err };
