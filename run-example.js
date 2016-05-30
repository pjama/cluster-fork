const TestRunner = require("./test-runner");

var studentCode = `
  var pushPopper = function() {
    var __arr = [];
    return {
      push: function(x) {
        __arr.push(x);
        return __arr;
      },
      pop: function() {
        return __arr.pop() || null
      }
    };
  };

  var x = 12;
`;

let specFile = "./test-code.js";
const testRunner = new TestRunner();

testRunner.run(studentCode, specFile, (err, results) => {
  console.log("FINISHED", results);
});
