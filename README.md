# travis-after-modes
Travis CI After All Event Implementation

### Installation
- `npm install travis-after-modes --save-dev`

### Configuration

```yml
after_success:
  - ./scripts/ci/after-success.sh
```

```bash
RESULT=`$(npm bin)/travis-after-modes`

if [ "$RESULT" = "PASSED" ]; then
  echo "All travis modes passed"
else 
  echo "Some travis modes failed"
fi
```
