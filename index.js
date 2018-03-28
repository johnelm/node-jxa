#!/usr/bin/env node
const nodeJxa = require('./node-jxa');
const DEBUG_ENV_VAR = 'NODE_DEBUG_JXA';
const DEBUG_SWITCHES = [ '--debug', '-d' ];

module.exports = ( processArgs ) => {

  const nonProcessArgs = processArgs.argv.slice( 2 );
  const nonDebugSwitchArgs = nonProcessArgs.filter( arg => !DEBUG_SWITCHES.includes( arg ));
  const jxaScriptArg = nonDebugSwitchArgs[ 0 ];

  if ( !nonDebugSwitchArgs.length ) {
    console.error( 'error: no jxa script specified' );
  } else {
    nodeJxa(
      jxaScriptArg,
      {
        debug: 
          ['true', '1'].includes ( processArgs.env[ DEBUG_ENV_VAR ] ) 
          ||
          !!(nonProcessArgs.filter( arg => DEBUG_SWITCHES.includes( arg )).length)
      }
    )
  }
};

module.exports( { argv: process.argv, env: process.env } );
