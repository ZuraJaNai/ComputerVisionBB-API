/* eslint-disable */
var request = require('request');
var entities_url = 'http://localhost:5000/api/entities';

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

// POST
describe('POST request', () => {
  describe('POST /', () => {
    it('entity created', done => {
      request.post(
        entities_url,
        { json: { color: 'white', label: 'testLabel' } },
        (err, res, body) => {
          body;
          expect(res.statusCode).toBe(201);
          done();
        },
      );
    });
  });
});
