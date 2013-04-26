/*global require, console, describe, it, expect */
require('../objgrep.js');

// suppress objgrep chatter
console.log = function () {};

describe('.grep', function () {
  describe('one level deep', function () {
    it('finds string keys', function () {
      expect({foo: 1, bar: 2}.grep(/f/)).toEqual(['.foo']);
    });
    it('finds numerical keys', function () {
      expect(['foo', 'bar'].grep(/\d/)).toEqual(['[0]', '[1]']);
    });
    it('finds string values', function () {
      expect({foo: 'xyz', bar: 'abc'}.grep(/xyz/)).toEqual(['.foo']);
    });
    it('finds boolean keys', function () {
      expect({foo: false, bar: true}.grep(/false/)).toEqual(['.foo']);
    });
  });

  var readmeExample = {
    beamish: 'thought',
    outgrabe: 10,
    toves: ['thou', 'borogoves', 'wabe']
  };

  describe('example from the README', function () {
    it('finds string', function () {
      expect(
        readmeExample.grep(/abe/)
      ).toEqual(['.outgrabe', '.toves[2]']);
    });
    it('finds digits', function () {
      expect(
        readmeExample.grep(/\d+/)
      ).toEqual(['.outgrabe', '.toves[0]', '.toves[1]', '.toves[2]']);
    });
  });

  describe('with depth limit', function () {
    it('finds string', function () {
      expect(
        readmeExample.grep(/abe/, {depth:2})
      ).toEqual(['.outgrabe']);
    });
  });

  describe('with a prototype', function () {
    it('finds prototypal members in object', function () {
      var X = function () {}, x;
      X.prototype.a = 1;
      x = new X();
      expect(x.grep(/a/)).toEqual(['.a']);
    });
  });
});
