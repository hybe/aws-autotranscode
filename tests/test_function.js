var expect = require("expect");
var pseudolambda = require("./pseudolambda");
pseudolambda.init();

var blank = function () {};

describe('skeleton', function() {
  it('Returns the key1 of the input', function(done) {
    pseudolambda.run({key1:'foobar'}).then(function(response) {
      expect(response.key1).toMatch(/foobar/);
      done();
    }, blank).catch(function(error) {
      done(error)
    });
  });
  it('Returns an error if key1 is missing', function(done) {
    pseudolambda.run({key2:'foobar'}).then(null, function(error) {
      expect(error).toMatch(/.*missing.*/);
      done();
    }, blank).catch(function(error) {
      done(error)
    });
  });
});


