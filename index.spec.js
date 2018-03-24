const browserify = require('browserify');
const cp = require( 'child_process' );
const clearRequire = require( 'clear-require' );

jest.mock('child_process');
jest.mock('browserify');

const nodeJxa = require( './node-jxa' );


beforeEach( () => {
  // jest.resetModules();
  jest.resetAllMocks();
    // delete require.cache[require.resolve("./index")];
})

  test( 'adds stdlib to top of script', () => {})
  test( 'adds exit to bottom of script', () => {})
  test( 'adds debug option given env var', () => {})
  test( 'adds debug option based on executed script', () => {})
  test( 'omits debug option properly, absent env var and debug script', () => {})
  test( '', () => {})
  test( '', () => {})

test('adds top line', () => {
  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  let cpMock = {
    exec: jest.fn()
  }

  let src = 'SRC';

  cp.exec.mockReturnValue(cpMock);
  browserify.mockReturnValue(b)

  process.argv = [ 'node', 'index', './example' ]; // we don't care about the first two

  require( './index' );
  
  expect( b.add.mock.calls[0][0]).toBe( './example' );

  // expect( b.bundle.mock.calls[0][1]).toBe( 'SRC' );
  // expect( cpMock.exec.mock.calls[0][0]).toBe( 'osascript -l JavaScript' );
  // expect( b.bundle.mock.calls[0][0]).toBe( '')
  
});

test( 'handles missing script argument', () => {

  process.argv = [ 'node', 'index' ]; // missing script arg

  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  browserify.mockReturnValue(b);

  require( './index' );

  expect(b.add.mock.calls.length).toBe(0);  

})
test( 'handles debug argument to enable sourcemaps', () => {

  clearRequire('./index')

  let b = {
    add: jest.fn(),
    bundle: jest.fn()
  }
  let cpMock = {
    exec: jest.fn()
  }

  browserify.mockReturnValue(b);
  cp.exec.mockReturnValue(cpMock);
  
  process.argv = [ 'node', 'index', './example.js', '--debug' ];

  require( './index' );


  expect( b.add.mock.calls[0][1]).toHaveProperty( 'debug', true );
  expect( b.add.mock.calls[0][0]).toBe( './example.js' );


})

// test( 'runs osascript command', () => {

//   process.argv = [ 'node', 'index', './example' ]; // we don't care about the first two

//   require( './index' );

// });