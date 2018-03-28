const browserify = require( 'browserify' );
const cp = require( 'child_process' );

const HEAD = 'window = this;\nObjC.import("stdlib");\n';
const TAIL = ';\n$.exit(0);';
const OSA_JXA_CMD = 'osascript -l JavaScript';


module.exports = ( scriptFile, browserifyOptions = { debug: false } ) => {
  const b = browserify();
  b.add( scriptFile, browserifyOptions );
  b.bundle( ( error, src ) => {
    if ( !!error ) {
      console.error( error );
      process.exit( 1 );
    }

    let modifiedScriptCode = HEAD;
    modifiedScriptCode += src.toString();
    modifiedScriptCode += TAIL;

    let osaProcess = cp.exec( OSA_JXA_CMD, ( error, stdout, stderr ) => {
      if ( !!error ) {
        console.error( error );
        process.exit( 1 );
      }
      console.log( stdout );
      console.error( stderr );
    });
    osaProcess.stdin.write( modifiedScriptCode );
    osaProcess.stdin.end();
  });
}

