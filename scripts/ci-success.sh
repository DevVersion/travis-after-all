#!/bin/bash

# Go to the project root directory
cd $(dirname $0)/../

RESULT=`node src/index.js`

echo $RESULT

if [ "$RESULT" = "PASSED" ]; then
  echo "Everything passed"
else
  echo "Something failed"
fi