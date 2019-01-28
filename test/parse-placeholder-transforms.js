'use strict';

require('mocha');
const assert = require('assert');
const parse = require('../lib/parse');
const transform = async input => {
  let node = (await parse(input)).nodes[1];
  delete node.transform;
  delete node.value;
  delete node.type;
  return node;
};

describe('placeholder transforms - parse', () => {
  it('should parse placeholder transform snippets', async () => {
    assert.deepEqual(await transform('Foo ${1/./=/g} Bar'), {
      varname: '1',
      regex: /./g,
      format: '=',
      flags: 'g',
      groups: [
        {
          type: 'text',
          value: '='
        }
      ]
    });
  });

  it('should parse format variable', async () => {
    assert.deepEqual(await transform('Foo ${1/(.)/${1}/g} Bar'), {
      varname: '1',
      regex: /(.)/g,
      format: '${1}',
      flags: 'g',
      groups: [
        {
          type: 'match',
          group: 1
        }
      ]
    });

    assert.deepEqual(await transform('Foo ${1/(.)/${1:upcase}/g} Bar'), {
      varname: '1',
      regex: /(.)/g,
      format: '${1:upcase}',
      flags: 'g',
      groups: [
        {
          group: 1,
          placeholder: 'upcase',
          type: 'match'
        }
      ]
    });
  });
});