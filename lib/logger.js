const { parseArgv } = require( './config' );

const isCI = !! parseArgv().ci;

function log ( msg ) { if ( ! isCI ) console.log( msg ) }

function err ( msg ) { console.error( msg ) }

module.exports = { isCI, log, err };
