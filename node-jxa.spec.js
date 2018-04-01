const browserify = require('browserify');
const cp = require( 'child_process' );

const nodeJxa = require( './node-jxa' );

jest.mock('browserify');
jest.mock('child_process');

const SRC = 'console.log("I am the JXA script!";';


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
  cp.spawn = jest.fn() ;
  cp.spawn.mockReturnValue( { stdin: { write, end }})

  nodeJxa( './example.js', { debug: true } );

  expect( cp.spawn.mock.calls[0][0]).toBe( 'osascript' );
  expect( cp.spawn.mock.calls[0][1]).toEqual(expect.arrayContaining( [ '-l', 'JavaScript' ] ) );
  expect( cp.spawn.mock.calls[0][2]).toHaveProperty( 'stdio', [ 'pipe', 1, 2 ] )

  expect( write.mock.calls[0][0]).toContain ( 'window = this' );
  expect( write.mock.calls[0][0]).toContain ( 'ObjC.import("stdlib")' );
  expect( write.mock.calls[0][0]).toContain ( SRC );
  expect( write.mock.calls[0][0]).toContain ( '$.exit(0)' );

  expect( end ).toBeCalled();

});
test( 'handles file error properly', () => {
  let b = {
    add: jest.fn(),
    bundle: jest.fn( cb => { cb( new Error( "Error: Cannot find module '/Users/jelm1/code/node-jxa/blah.js'"), null ) } )
  }
  browserify.mockReturnValue( b );
  process.exit = jest.fn();

  global.console = { error: jest.fn() }

  nodeJxa( 'blah.js', { debug: true } );

  expect( console.error ).toBeCalled();
  expect( process.exit ).toBeCalled();
  expect( process.exit.mock.calls[0][0] ).toBeGreaterThan( 0 );

} );
