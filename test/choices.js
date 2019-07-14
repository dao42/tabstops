'use strict';

require('mocha');
const assert = require('assert').strict;
const Snippet = require('../lib/Snippet');
const parse = input => {
  const snippet = new Snippet(input);
  return snippet.parse();
};

const choices = (input, fn) => {
  const ast = parse(input);
  const node = fn ? fn(ast) : ast.nodes[0];
  return node.choices;
};

describe('choices', () => {
  describe('parse', () => {
    it('should parse placeholder choices', () => {
      assert.deepEqual(choices('${1|one,two,three|}'), ['one', 'two', 'three']);
      assert.deepEqual(choices('${1|one,  two,    three|}'), ['one', '  two', '    three']);
    });

    it('should parse nested placeholder choices', () => {
      const find = ast => ast.find('choices');
      assert.deepEqual(choices('${FOO:${1|one,two,three|}}', find), ['one', 'two', 'three']);
    });

    it('should ignore snippets that do not start with an integer', () => {
      assert.deepEqual(choices('${TM_FILENAME|one,two,three|}'), void 0);
    });

    it('should ignore escaped templates', () => {
      assert.deepEqual(choices('\\${1|one,two,three|}'), void 0);
    });

    it('should ignore escaped pipes and commas', () => {
      assert.deepEqual(choices('${1|one\\,  two,    three|}'), ['one\\,  two', '    three']);
      assert.deepEqual(choices('${1|one\\,  two \\| three|}'), ['one\\,  two \\| three']);
    });

    it('should parse escaped choices', () => {
      assert.deepEqual(choices('${1|\\,,},$,\\|,\\\\|}'), ['\\,', '}', '$', '\\|', '\\\\']);
    });
  });

  describe('stringify', () => {
    const stringify = input => {
      return parse(input).stringify() === input;
    };

    it('should stringify choices', () => {
      assert(stringify('${TM_FILENAME|one,two,three|}'));
      assert(stringify('${1|one,two,three|}'));
      assert(stringify('\\${1|one,two,three|}'));
      assert(stringify('${1|one,  two,    three|}'));
      assert(stringify('${1|one\\,  two,    three|}'));
      assert(stringify('${1|one\\,  two \\| three|}'));
      assert(stringify('${1|\\,,},$,\\|,\\\\|}'));
    });
  });

  describe('outer', () => {
    const output = input => {
      return parse(input).outer() === input;
    };

    it('should get the outer string for choices', () => {
      assert(output('foo ${TM_FILENAME|one,two,three|} bar'));
      assert(output('foo ${1|one,two,three|} bar'));
      assert(output('foo \\${1|one,two,three|} bar'));
      assert(output('foo ${1|one,  two,    three|} bar'));
      assert(output('foo ${1|one\\,  two,    three|} bar'));
      assert(output('foo ${1|one\\,  two \\| three|} bar'));
      assert(output('foo ${1|\\,,},$,\\|,\\\\|} bar'));
    });
  });

  describe('inner', () => {
    const output = input => {
      return parse(input).nodes[0].inner() === input.slice(2, -1);
    };

    it('should get the inner string for choices', () => {
      assert(output('${1|one,two,three|}'));
      assert(output('${1|one,  two,    three|}'));
      assert(output('${1|one\\,  two,    three|}'));
      assert(output('${1|one\\,  two \\| three|}'));
      assert(output('${1|\\,,},$,\\|,\\\\|}'));
    });
  });

  describe('compile', () => {

  });
});
