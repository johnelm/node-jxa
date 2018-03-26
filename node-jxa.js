const browserify = require( 'browserify' );
const cp = require( 'child_process' );

const HEAD = 'window = this;\nObjC.import("stdlib");\n';
const TAIL = ';\n$.exit(0);';
const OSA_JXA_CMD = 'osascript -l JavaScript';


module.exports = ( scriptFile, browserifyOptions = {} ) => {
  const b = browserify();
  b.add( scriptFile, browserifyOptions );
  b.bundle( ( error, src ) => {
    if ( !!error ) {
      console.error( error );
      process.exit( 1 );
    }

    let fixed = HEAD;
    fixed += src.toString();
    fixed += TAIL;

    let process = cp.exec( OSA_JXA_CMD, ( error, stdout, stderr ) => {
      //TODO recall how to pipe with parent's IPC channels
      if ( !!error ) {
        console.error( error );
        process.exit( 1 );
      }
      console.log( stdout );
      console.error( stderr );
      // stdout.pipe(process.stdout);
      // stderr.pipe(process.stderr);
    });
    process.stdin.write( fixed );
    process.stdin.end();
  });
}

