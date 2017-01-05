#!/bin/bash

# Go to the project root directory
cd $(dirname $0)/../

# Check if all other modes passed successfully.
if [ "$TRAVIS_PULL_REQUEST" = "false" ] && node src/index.js; then
  echo "Everything passed"
else
  echo "Something failed"
fi