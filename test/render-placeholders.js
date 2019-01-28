'use strict';

require('mocha');
const assert = require('assert');
const render = require('../lib/render');

describe('placeholders - render', () => {
  it('should render a template literal', () => {
    assert.equal(render('${foo}', { foo: 'bar' }), 'bar');
    assert.equal(render('(${foo})', { foo: 'bar' }), '(bar)');
  });

  it('should render nested template literals', () => {
    assert.equal(render('${foo:${ABC}}', {}), '');
    assert.equal(render('(${foo:${ABC}})', {}), '()');
    assert.equal(render('(${foo:(${ABC})})', {}), '(())');
    assert.equal(render('(${foo:(${ABC})})', { foo: 'bar' }), '(bar)');
    assert.equal(render('${foo:${ABC}}', { ABC: 'bar' }), 'bar');
    assert.equal(render('${foo:${ABC}}', { ABC: 'bar', foo: 'xyz' }), 'xyz');
    assert.equal(render('(${foo:${ABC}})', { ABC: 'bar' }), '(bar)');
    assert.equal(render('(${foo:(${ABC})})', { ABC: 'bar' }), '((bar))');
    assert.equal(render('(${foo:(${ABC})})', { foo: 'bar' }), '(bar)');
    assert.equal(render('(${foo:${ABC}})', { foo: 'bar', ABC: 'XYZ' }), '(bar)');
    assert.equal(render('(${foo:${ABC}})', { foo: 'bar' }), '(bar)');
  });

  it('should render multiple nested template literals', () => {
    assert.equal(render('${foo:before ${ABC} middle ${XYZ} after}', { ABC: 'one', XYZ: 'two' }), 'before one middle two after');
  });
});
