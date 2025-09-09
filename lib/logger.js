const { parseArgs } = require( './config' );

const isCI = !! parseArgs().ci;

function log ( msg ) { if ( ! isCI ) console.log( msg ) }

function err ( msg ) { console.error( msg ) }

module.exports = { isCI, log, err };
