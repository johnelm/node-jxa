const browserify = require('browserify');
const cp = require( 'child_process' );

const nodeJxa = require( './node-jxa' );

jest.mock('browserify');
jest.mock('child_process');

const SRC = 'var foo = "bar";';


test( 'adds script arg to browserify bundle, debug defaulting to false', () => {

  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  
  browserify.mockReturnValue(b)

  nodeJxa( './example.js' );
  expect( b.add.mock.calls[0][0]).toBe( './example.js' );
  expect( b.add.mock.calls[0][1]).toHaveProperty( 'debug', false );
});

test( 'adds script arg to browserify bundle, with debug option', () => {

  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  
  browserify.mockReturnValue(b)

  nodeJxa( './example.js', { debug: true } );
  expect( b.add.mock.calls[0][0]).toBe( './example.js' );
  expect( b.add.mock.calls[0][1]).toHaveProperty( 'debug', true );
});

test( 'decorates input script properly', () => {

  let b = {
    add: jest.fn(),
    bundle: jest.fn( cb => { cb( null, SRC ) } )
  }
  browserify.mockReturnValue( b );

  let write = jest.fn();
  let end = jest.fn();
  let on = jest.fn();
  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( {
    stdin: { write, end },
    on
  })

  nodeJxa( './example.js', { debug: true } );

  expect( cp.spawn.mock.calls[0][0]).toBe( 'osascript' );
  expect( cp.spawn.mock.calls[0][1]).toEqual(expect.arrayContaining( [ '-l', 'JavaScript' ] ) );
  expect( cp.spawn.mock.calls[0][2]).toHaveProperty( 'stdio', [ 'pipe', 1, 2 ] )

  expect( write.mock.calls[0][0]).toContain ( 'window = this' );
  expect( write.mock.calls[0][0]).toContain ( 'ObjC.import("stdlib")' );
  expect( write.mock.calls[0][0]).toContain ( SRC );
  expect( write.mock.calls[0][0]).toContain ( '$.exit(0)' );

  expect( on ).toBeCalled();
  expect( end ).toBeCalled();

});
test( 'runs a valid script with no error', () => {
  let ObjC = { // eslint-disable-line no-unused-vars
    import: jest.fn()
  }
  let $ = { // eslint-disable-line no-unused-vars
    exit: jest.fn()
  }
  let b = {
    add: jest.fn(),
    bundle: jest.fn( cb => { cb( null, SRC ) } )
  }
  browserify.mockReturnValue( b );
  let write = jest.fn( codeToRun => eval( codeToRun ));
  let end = jest.fn();
  let on = jest.fn();
  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( {
    stdin: { write, end },
    on
  })

  nodeJxa( './example.js', { debug: true } );

  expect( $.exit.mock.calls[0][0]).toBe( 0 );

});
test( 'returns non-zero exit code when child process encounters error', () => {
  let ObjC = { // eslint-disable-line no-unused-vars
    import: jest.fn()
  }
  let $ = { // eslint-disable-line no-unused-vars
    exit: jest.fn()
  }
  let b = {
    add: jest.fn(),
    // bundle: jest.fn( cb => { cb( null, 'throw new Error("error!");' ) } )
    bundle: jest.fn( cb => { cb( null, 'var foo = bar;' ) } )
  }
  browserify.mockReturnValue( b );
  let write = jest.fn( codeToRun => {
    console.log( codeToRun ); 
    eval( codeToRun );
  });
  // TODO maybe should be integration testing too by letting it run in the child process
  let end = jest.fn();
  let on = jest.fn();
  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( {
    stdin: { write, end },
    on
  })

  nodeJxa( './example.js', { debug: true } );

  expect( $.exit.mock.calls[0][0]).toBeGreaterThan( 0 );

});
test( 'returns non-zero exit code when child process errors', () => {

  let b = {
    add: jest.fn(),
    bundle: jest.fn( cb => { cb( null, SRC ) } )
  }
  browserify.mockReturnValue( b );

  let write = jest.fn();
  let end = jest.fn();
  let on = jest.fn();
  on.mockReturnValueOnce( 1 );
  on.mockReturnValueOnce( Error( 'an error occured while spawning the process') );


  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( {
    stdin: { write, end },
    on
  })

  nodeJxa( './example.js', { debug: true } );

  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( {
    stdin: { write, end },
    on
  })

  let onCalls = { // could do a forEach or map on this
    [on.mock.calls[0][0]]: on.mock.calls[0],
    [on.mock.calls[1][0]]: on.mock.calls[1]
  }
  
  expect( onCalls['exit'][0] ).toBe( 'exit' );
  expect( on.mock.calls[1][0] ).toBe( 'error' );

  // expect( onCalls.exit( 0 ) ).toBeGreaterThan( 0 );

  nodeJxa( './example.js', { debug: true } );

});
test( 'handles browserify or IO error properly', () => {
  let b = {
    add: jest.fn(),
    bundle: jest.fn( cb => { cb( new Error( "Error: Cannot find module '/Users/jdoe/code/node-jxa/blah.js'"), null ) } )
  }
  browserify.mockReturnValue( b );
  process.exit = jest.fn();

  global.console = { error: jest.fn() }

  nodeJxa( 'blah.js', { debug: true } );

  expect( console.error ).toBeCalled();
  expect( process.exit ).toBeCalled();
  expect( process.exit.mock.calls[0][0] ).toBeGreaterThan( 0 );

} );
