require('../objgrep.js');

// suppress objgrep chatter
console.log = function () {};

describe(".grep", function () {
  describe("one level deep", function () {
    it ("finds string keys", function () {
      expect({foo: 1, bar: 2}.grep(/f/)).toEqual(['.foo']);
    });
    it ("finds numerical keys", function () {
      expect(['foo', 'bar'].grep(/\d/)).toEqual(['[0]', '[1]']);
    });
    it ("finds string values", function () {
      expect({foo: 'xyz', bar: 'abc'}.grep(/xyz/)).toEqual(['.foo']);
    });
    it ("finds boolean keys", function () {
      expect({foo: false, bar: true}.grep(/false/)).toEqual(['.foo']);
    });
  });

  var readme_example = {
    beamish: 'thought',
    outgrabe: 10,
    toves: ['thou', 'borogoves', 'wabe']
  };

  describe("example from the README", function () {
    it ("finds string", function () {
      expect(
        readme_example.grep(/abe/)
      ).toEqual([".outgrabe", ".toves[2]"]);
    });
    it ("finds digits", function () {
      expect(
        readme_example.grep(/\d+/)
      ).toEqual([".outgrabe", ".toves[0]", ".toves[1]", ".toves[2]"]);
    });
  });

  describe("with depth limit", function () {
    it ("finds string", function () {
      expect(
        readme_example.grep(/abe/, {depth:2})
      ).toEqual([".outgrabe"]);
    });
  });
});
