const { parseArgv } = require( './config' );
const { performance } = require( 'node:perf_hooks' );

const isCI = !! parseArgv().ci;

const log = ( msg ) => ! isCI ? console.log( msg ) : void[];

const err = ( msg ) => console.error( msg );

const tTime = () => performance.now();

const tDelta = ( ts ) => tTime() - ts;

const tOut = ( ts ) => ( tDelta( ts ) / 1000 ).toFixed( 3 );

module.exports = { isCI, log, err, tTime, tDelta, tOut };
