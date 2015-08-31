var expect = require('expect');
var lambda = require('lambda-wrapper').init();

describe('lambda-skeleton', function() {
    it('Returns the key1 of the input', function(done) {
        lambda.run({
            key1: 'foobar'
        }, function(error, response) {
            if (error) {
                return done(error);
            }
            expect(response.key1).toMatch(/foobar/);
            done();
        });
    });
    
    it('Returns an error if key1 is missing', function(done) {
        lambda.run({
            key2: 'foobar'
        }, function(error, response) {
            expect(error).toMatch(/.*missing.*/);
            done();
        });
    });
});

