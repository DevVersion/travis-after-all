#!/bin/bash

# Go to the project root directory
cd $(dirname $0)/../

node src/index.js

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "Everything passed"
else
  echo "Something failed"
fi