#! /usr/bin/env node

'use strict';

if (!process.env['TRAVIS_BUILD_ID']) {
  console.error('The script can only run inside of a Travis CI build.');
  process.exit(1);
}

const request = require('request-promise');

const API_ENDPOINT = 'https://api.travis-ci.org';
const CHECK_INTERVAL = 10 * 1000;

const buildId = process.env['TRAVIS_BUILD_ID'];
const jobNumber = process.env['TRAVIS_JOB_NUMBER'];

// The leader job will always wait for the others jobs to finish.
if (!jobNumber.endsWith('.1')) {
  process.exit(1);
}

let waitInterval = setInterval(() => {

  getOtherJobs().then(jobs => {

    if (jobs.every(job => !!job['finished_at']) === false) {
      // Print a message each interval, because otherwise Travis might exit due to no output.
      process.stdout.write('.');
      return;
    }

    let hasSuccess = jobs.every(job => job['result'] === 0);

    /* Start a new line due to the progress bar */
    console.log('');

    /* Exit the process with the retrieved exit code. */
    process.exit(hasSuccess ? 0 : 1);

    /* Stop the interval because all jobs finished properly. */
    clearInterval(waitInterval);
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
      return jobs.filter(job => job.number !== jobNumber && !job['allow_failure'])
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
