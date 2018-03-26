return;

const browserify = require('browserify');
const cp = require( 'child_process' );
// const clearRequire = require( 'clear-require' );
const nodeJxa = require( './node-jxa' );

jest.mock('browserify');
jest.mock('child_process');


// let b;
// let cpMock;
// let src = 'SRC';

beforeEach(() => {
  // jest.resetAllMocks();
  // cpMock = {
  //   exec: jest.fn()
  // }
  
})

test( 'adds script arg to browserify bundle', () => {

  let bundleCb = (error, src) => {

  }

  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  let cpMock = {
    exec: jest.fn()
  }
  
  browserify.mockReturnValue(b)
  // cp.exec.mockReturnValue(cpMock);

  nodeJxa( './example.js', { debug: true } );
  expect( b.add.mock.calls[0][0]).toBe( './example.js' );
  expect( b.add.mock.calls[0][1]).toHaveProperty( 'debug', true );
  expect( b.bundle.mock.calls[0][0]()).toHaveProperty( 'debug', true );
  // expect( b.bundle.mock.calls[0][0]).toHaveProperty( 'debug', true );
});


test( 'adds stdlib to top of script', () => {
  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  let cpMock = {
    exec: jest.fn()
  }
  
  browserify.mockReturnValue(b)
  cp.exec.mockReturnValue(cpMock);

  nodeJxa( './example.js', { debug: true } );
  // expect( b.add.mock.calls[0][0]).toBe( './example.js' );
  expect( cpMock.exec.mock.calls[0][0]).toBe( 'osascript -l JavaScript' );


});



// test( 'adds exit to bottom of script', () => {})
// test( 'passes debug option to browserify', () => {})
// test( '', () => {})
// test( '', () => {})

// test('adds top line', () => {

//   cp.exec.mockReturnValue(cpMock);
//   browserify.mockReturnValue(b)

//   expect( b.add.mock.calls[0][0]).toBe( './example' );

//   // expect( b.bundle.mock.calls[0][1]).toBe( 'SRC' );
//   // expect( cpMock.exec.mock.calls[0][0]).toBe( 'osascript -l JavaScript' );
//   // expect( b.bundle.mock.calls[0][0]).toBe( '')
  
// });



// expect(b.add.mock.calls.length).toBe(0);  

// clearRequire('./index')


// browserify.mockReturnValue(b);
// cp.exec.mockReturnValue(cpMock);

