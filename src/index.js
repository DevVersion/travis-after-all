'use strict';

if (!process.env['TRAVIS_BUILD_ID']) {
  console.error('The script can only run inside of a Travis CI build.');
  process.exit(2);
}

const request = require('request-promise');

const API_ENDPOINT = 'https://api.travis-ci.org';
const CHECK_INTERVAL = 10 * 1000;

const buildId = process.env['TRAVIS_BUILD_ID'];
const jobNumber = process.env['TRAVIS_JOB_NUMBER'];

// The leader job will always wait for the others jobs to finish.
if (!jobNumber.endsWith('.1')) {
  return;
}

console.log("Waiting for other jobs to finish.");

/* Runs an interval which checks for the other modes to finish. */
setInterval(() => {

  getOtherJobs().then(jobs => {

    if (jobs.every(job => !!job['finished_at'] === false)) {
      /* Not all modes finished yet. Wait for the next run. */
      return;
    }

    let hasSuccess = jobs.every(job => job['result'] === 0);

    process.exit(hasSuccess ? 0 : 1)
  });

}, CHECK_INTERVAL);

/**
 * Retrieves data about the other Travis CI jobs running in a matrix.
 * @returns {Promise.<Object>}
 */
function getOtherJobs() {
  return sendRequest('builds/' + buildId)
    .then(result => result['matrix'])
    .then(jobs => {
      return jobs.filter(job => job.number !== jobNumber)
    });
}

/**
 * Sends a request to the Travis CI API and parses its json.
 * @param requestUrl Rest URL to access
 * @returns {Promise.<Object>} Parsed JSON Object
 */
function sendRequest(requestUrl) {
  return request({
    url: `${API_ENDPOINT}/${requestUrl}`,
    json: true
  })
}