# Cluster-Fork

## Example

```javascript
const untrustedCode = `(function() { var x=12; return x; })()`;

suite(() => {
  
  test(untrustedCode, [], "should return a number", (result) => {
    assert.isNumber(result);
    assert.equal(11, result);
  });
  
  test('while(true) {}', [], "should timeout gracefully", (result) => {
    // pass
  });

  test(untrustedCode, [], "should return a number", (result) => {
    assert.isNumber(result);
    assert.equal(12, result);
  });
  
});
```

### Results

```commandline
worker 1 initialized
worker 3 initialized
worker 2 initialized
(3) should return a number: Pass
(1) should return a number: Fail (expected 11 to equal 12)
(2) should timeout gracefully: Timeout
finished
```
