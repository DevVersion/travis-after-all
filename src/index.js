'use strict';

if (!process.env['TRAVIS_BUILD_ID']) {
  console.error('The script can only run inside of a Travis CI build.');
  process.exit(1);
}

const request = require('request-promise');
const Rx = require('rxjs');

const API_ENDPOINT = 'https://api.travis-ci.org';
const CHECK_INTERVAL = 10 * 1000;

const buildId = process.env['TRAVIS_BUILD_ID'];
const jobNumber = process.env['TRAVIS_JOB_NUMBER'];

// The leader job will always wait for the others jobs to finish.
if (!jobNumber.endsWith('.1')) {
  console.log("Not waiting for other jobs because only leader waits.");
  return;
}

console.log("Waiting for other jobs to finish.");

Rx.Observable
  .interval(CHECK_INTERVAL)
  .flatMap(() => getOtherJobs())
  .filter(jobs => jobs.every(job => !!job['finished_at']))
  .take(1)
  .subscribe(x => console.log("Finished with all builds"));

/**
 * Retrieves data about the other Travis CI jobs running in a matrix.
 * @returns {Observable.<Object>}
 */
function getOtherJobs() {
  return sendRequest('builds/' + buildId)
    .map(result => result['matrix']);
}

/**
 * Sends a request to the Travis CI API and parses its json.
 * @param requestUrl Rest URL to access
 * @returns {Observable.<Object>} Parsed JSON Object
 */
function sendRequest(requestUrl) {
  return Rx.Observable.fromPromise(
    request({
      url: `${API_ENDPOINT}/${requestUrl}`,
      json: true
    })
  );
}