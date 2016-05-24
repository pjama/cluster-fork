const TestRunner = require("./lib/test-runner");
const assert = require("chai").assert;

var suite = TestRunner.suite;
var test = TestRunner.test;

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
