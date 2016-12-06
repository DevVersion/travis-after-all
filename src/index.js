'use strict';

if (!process.env['TRAVIS_BUILD_ID']) {
  console.error('The script can only run inside of a Travis CI build.');
  process.exit(1);
}

const request = require('request-promise');

const API_ENDPOINT = 'https://api.travis-ci.org';
const BUILD_ID = process.env['TRAVIS_BUILD_ID'];

sendRequest('builds/' + BUILD_ID)
  .then(result => result['matrix'])
  .then(matrixes => console.log(matrixes));

/**
 * Sends a request to the Travis CI API and parses its json.
 * @param requestUrl Rest URL to access
 * @returns {Promise.<Object>} Parsed JSON Object
 */
function sendRequest(requestUrl) {
  return request({
    url: `${API_ENDPOINT}/${requestUrl}`,
    json: true
  });
}