#!/usr/bin/env node
const nodeJxa = require('./node-jxa');
const DEBUG_SWITCHES = [ '--debug', '-d' ];
const nonProcessArgs = process.argv.slice( 2 );
const nonDebugSwitchArgs = nonProcessArgs.filter( arg => !DEBUG_SWITCHES.includes( arg ));
const jxaScriptArg = nonDebugSwitchArgs[ 0 ];

if ( !nonDebugSwitchArgs.length ) {
  console.error( 'error: no jxa script specified' );
} else {
  nodeJxa(
    jxaScriptArg,
    {
      debug: 
        ['true', '1'].includes ( process.env.NODE_DEBUG_JXA ) 
        ||
        !!(nonProcessArgs.filter( arg => DEBUG_SWITCHES.includes( arg )).length)
    }
  )
}
