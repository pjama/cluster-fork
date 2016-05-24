const TestRunner = require("./lib/test-runner");
const assert = require("chai").assert;

var suite = TestRunner.suite;
var test = TestRunner.test;

const browserCode = `(function() { var x=12; return x; })()`;

const nodeCode = `
  module.exports = function(cb) {
    console.log("student code");
    cb("AAA");
    return function(input) {
      return 2*input; };
    }`;

suite(() => {
  
  test(browserCode, [], "should return a number", (result) => {
    assert.isNumber(result);
    assert.equal(11, result);
  });
  
  test('while(true) {}', [], "should timeout gracefully", (result) => {
    // pass
  });
  
  test(browserCode, [], "should return a number", (result) => {
    assert.isNumber(result);
    assert.equal(12, result);
  });
  
  // test(browserCode, [], "should return a number", (result) => {
  //   assert.isNumber(result);
  //   assert.equal(13, result);
  // });

  
  
  // test(nodeCode, "should return a function", (result) => {
  //   let params = [];
  //   runNodeCode(nodeCode, params, (result) => {
  //   });
  // });
  
});
