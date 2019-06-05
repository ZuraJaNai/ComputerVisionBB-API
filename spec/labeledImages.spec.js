/* eslint-disable */
const request = require('request');
const labeled_images = require('../src/data/labeledImages.json');
const image = '1558696407626.a.jpg';
const labeled_url = 'http://localhost:5000/api/labeled/' + image;

// GET
describe('GET request', () => {
  it('returns status code 200', done => {
    request.get(labeled_url, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('returns corresponded data', done => {
    request.get(labeled_url, (err, res, body) => {
      expect(labeled_images[1]).toEqual(JSON.parse(body));
      done();
    });
  });
});

// DELETE
describe('DELETE request', () => {
  it('zall labeledImg deleted', done => {
    request.delete('http://localhost:5000/api/labeled/', (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
