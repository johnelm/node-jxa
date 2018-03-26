const nodeJxa = require('./node-jxa');
jest.mock('./node-jxa');

const index = require('./index');

const defaultProcessArgs = {
  env: {},
  argv: ['node', 'index', 'example.js']
};

beforeEach(() => {
  jest.resetAllMocks();
})


describe('debug mode is properly enabled', () => {
  test('adds debug option given NODE_DEBUG_JXA=1 env var', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        env: {
          NODE_DEBUG_JXA: '1'
        }
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option given NODE_DEBUG_JXA=true env var', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        env: {
          NODE_DEBUG_JXA: 'true'
        }
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })

  test('adds debug option based on -d switch', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', './example.js', '-d']
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option based on --debug switch', () => {

    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', './example.js', '--debug']
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('adds debug option with switch first in args', () => {

    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', '--debug', './example.js']
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', true);
  })
  test('omits debug option properly, absent env var and debug script', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', './example.js']
      })
    );
    expect(nodeJxa.mock.calls[0][1]).toHaveProperty('debug', false);
  })
})

describe('handles jxa script argument properly', () => {
  test('passes jxa script name', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', './example.js']
      })
    );
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
  test('passes jxa script name, with debug switch', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', './example.js', '-d']
      })
    );
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
  test('passes jxa script name, with debug switch first', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', '-d', './example.js']
      })
    );
    expect(nodeJxa.mock.calls[0][0]).toBe('./example.js');
  });
  test('handles missing script argument', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index']
      })
    );
    expect(nodeJxa.mock.calls.length).toBe(0);
  });
  test('handles missing script argument, with debug switch', () => {
    index(
      Object.assign({}, defaultProcessArgs, {
        argv: ['node', 'index', '--debug']
      })
    );
    expect(nodeJxa.mock.calls.length).toBe(0);
  });

});