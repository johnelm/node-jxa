const nodeJxa = require('./node-jxa');

jest.mock('./node-jxa');

afterEach(() => {
  // delete require.cache[require.resolve("./index")];
  // jest.resetModules();
})

beforeEach(() => {
  // jest.resetModules();
  // jest.resetAllMocks();
  delete require.cache[require.resolve("./index")];
})
describe('debug mode is properly enabled', () => {


  test('adds debug option given NODE_DEBUG_JXA=1 env var', () => {
    process.env.NODE_DEBUG_JXA = '1';
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option given NODE_DEBUG_JXA=1 env var', () => {
    process.env.NODE_DEBUG_JXA = 'true';
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })


  test('adds debug option based on -d switch', () => {
    process.argv = ['node', 'index', './example.js', '-d']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option based on --debug switch', () => {
    process.argv = ['node', 'index', './example.js', '--debug']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option with switch first in args', () => {
    process.argv = ['node', 'index', '--debug', './example.js']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('omits debug option properly, absent env var and debug script', () => {
    process.argv = ['node', 'index', './example.js']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', false);
  })
})

describe('handles jxa script argument properly', () => {
  test('passes jxa script name', () => {
    process.argv = ['node', 'index', './example.js']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
   test('passes jxa script name, with debug switch', () => {
    process.argv = ['node', 'index', './example.js', '-d']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
   test('passes jxa script name, with debug switch first', () => {
    process.argv = ['node', 'index', '-d', './example.js']; // we don't care about the first two
    require('./index');
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
   test('handles missing script argument', () => {
    process.argv = ['node', 'index']; // missing script arg
    require('./index');
    expect(nodeJxa.mock.calls.length).toBe(0);
  });
   test('handles missing script argument, with debug switch', () => {
    process.argv = ['node', 'index', '--debug']; // missing script arg
    require('./index');
    expect(nodeJxa.mock.calls.length).toBe(0);
  });

});