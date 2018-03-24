const nodeJxa = require('./node-jxa');

if ( process.argv.length < 3 ) {
  console.error( 'error: no jxa script specified' );
  process.exit( 1 );
}

nodeJxa(
  process.argv[ 2 ],
  {
    debug: ['true', '1'].includes ( process.env.NODE_DEBUG_JXA ) 
    || 
    process.argv[ 1 ].includes( 'debug' )
  }
)

