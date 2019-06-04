/* eslint-disable */
const request = require('request');
const images = require('../src/data/images.json');
const images_url = 'http://localhost:5000/api/images';

// GET
describe('GET request', () => {
  it('returns status code 200', done => {
    request.get(images_url, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('returns corresponded data', done => {
    request.get(images_url, (err, res, body) => {
      expect(images).toEqual(JSON.parse(body));
      done();
    });
  });
});
