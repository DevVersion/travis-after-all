'use strict';

if (!process.env['TRAVIS_BUILD_ID']) {
  console.error('The script can only run inside of a Travis CI build.');
  process.exit(1);
}


const request = require('request');

const API_ENDPOINT = 'https://api.travis-ci.org';
const BUILD_ID = process.env['TRAVIS_BUILD_ID'];

sendRequest('builds/' + BUILD_ID);

function sendRequest(requestUrl) {
  request(`${API_ENDPOINT}/${requestUrl}`, (err, response, body) => {
    console.log(body);
  });
}