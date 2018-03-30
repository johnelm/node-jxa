#!/usr/bin/env node
const nodeJxa = require('./node-jxa');
const DEBUG_ENV_VAR = 'NODE_DEBUG_JXA';
const DEBUG_SWITCHES = [ '--debug', '-d' ];

module.exports = ( processArgs ) => {

  const nonProcessArgs = processArgs.argv.slice( 2 );  // lose the 'node' and 'index.js'
  const nonDebugSwitchArgs = nonProcessArgs.filter( arg => !DEBUG_SWITCHES.includes( arg )); // ignoring debug switch
  const jxaScriptArg = nonDebugSwitchArgs[ 0 ];

  if ( !jxaScriptArg ) {
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
