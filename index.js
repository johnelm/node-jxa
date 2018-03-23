const browserify = require( 'browserify' );
const cp = require( 'child_process' );

const HEAD = 'window = this;\nObjC.import("stdlib");\n';
const TAIL = ';\n$.exit(0);';
const OSA_JXA_CMD = 'osascript -l JavaScript';

const b = browserify();

b.add( process.argv[ 2 ] );
b.bundle( ( err, src ) => {
  if ( !!err ) {
    console.err( err );
    process.exit( 1 );
  }

  let fixed = HEAD;
  fixed += src.toString();
  fixed += TAIL;

  let process = cp.exec( OSA_JXA_CMD, ( error, stdout, stderr ) => {
    console.log( error, stdout, stderr );
  });
  process.stdin.write( fixed );
  process.stdin.end();
});

