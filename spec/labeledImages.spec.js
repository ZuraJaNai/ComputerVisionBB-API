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

// POST
describe('POST request', () => {
  it('entity created', done => {
    request.post(
      'http://localhost:5000/api/labeled/',
      {
        json: {
          image: {
            name: '1558696407649.d.jpg',
          },
          shapes: [
            {
              index: 0,
              label: 'treeTest',
              color: '#e01f1f',
              x: 136,
              y: 71,
              width: 399,
              height: 263,
              name: 'Figure0',
            },
          ],
        },
      },
      (err, res, body) => {
        expect(res.statusCode).toBe(201);
        done();
      },
    );
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
