const browserify = require('browserify');
const cp = require( 'child_process' );

const jxaNode = require( './.index' );

jest.mock('browserify');
jest.mock('child_process');


test('adds top line', () => {

  jxaNode();




});