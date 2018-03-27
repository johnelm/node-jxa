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
  cp.exec = jest.fn() ;
  cp.exec.mockReturnValue( { stdin: { write, end }})

  nodeJxa( './example.js', { debug: true } );

  expect( cp.exec.mock.calls[0][0]).toBe( 'osascript -l JavaScript' );
  expect( write.mock.calls[0][0]).toContain ( 'window = this' );
  expect( write.mock.calls[0][0]).toContain ( 'ObjC.import("stdlib")' );
  expect( write.mock.calls[0][0]).toContain ( SRC );
  expect( write.mock.calls[0][0]).toContain ( '$.exit(0)' );

  expect( end ).toBeCalled();

});
