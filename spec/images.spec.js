/* eslint-disable */
var request = require('request');
var entities_url = 'http://localhost:5000/api/images';

// GET
describe('GET request', () => {
  describe('GET /', () => {
    it('returns status code 200', done => {
      request.get(entities_url, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});
