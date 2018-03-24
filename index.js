const browserify = require( 'browserify' );
const cp = require( 'child_process' );

const HEAD = 'window = this;\nObjC.import("stdlib");\n';
const TAIL = ';\n$.exit(0);';
const OSA_JXA_CMD = 'osascript -l JavaScript';

const b = browserify();

let options = {};
if ( process.argv.includes('--debug')) {
  options.debug = true;
}

if ( process.argv.length < 3 ) {
  console.error( 'error: no jxa script specified' );
  process.exit( 1 );
}

b.add( process.argv[ 2 ], options );
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

