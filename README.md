# travis-after-modes 
[![Build Status](https://travis-ci.org/DevVersion/travis-after-modes.svg?branch=master)](https://travis-ci.org/DevVersion/travis-after-modes)

Travis CI After All Event Implementation

### Installation
- `npm install travis-after-modes --save-dev`

### Configuration

```yml
after_success:
  - ./scripts/ci/after-success.sh
```

```bash
if $(npm bin)/travis-after-modes; then
  echo "All travis modes passed"
else 
  echo "Some travis modes failed"
fi
```
