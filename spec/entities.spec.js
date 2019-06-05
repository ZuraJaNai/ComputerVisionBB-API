/* eslint-disable */
const request = require('request');
const fs = require('fs');
var entities = require('../src/data/entities.json');
const entities_url = 'http://localhost:5000/api/entities';

// GET
describe('GET request', () => {
  it('returns status code 200', done => {
    request.get(entities_url, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('returns corresponded data', done => {
    request.get(entities_url, (err, res, body) => {
      expect(
        JSON.parse(fs.readFileSync(`${__dirname}/../src/data/entities.json`)),
      ).toEqual(JSON.parse(body));
      done();
    });
  });
});

// POST
describe('POST request', () => {
  it('entity created', done => {
    request.post(
      entities_url,
      { json: { color: 'white', label: 'testLabel' } },
      (err, res, body) => {
        expect(res.statusCode).toBe(201);
        done();
      },
    );
  });
});

// DELETE
describe('DELETE request', () => {
  it('entity deletion', done => {
    request.delete(`${entities_url}/0`, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});

// PUT
describe('PUT request', () => {
  it('entity modify', done => {
    request(
      {
        url: entities_url,
        method: 'PUT',
        json: { index: 1, data: 'modified' },
      },
      (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      },
    );
  });
});
