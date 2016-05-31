var chai  = require("chai");
var sinon = require("sinon");
var assert = chai.assert;

describe("Function", () => {
  it("Should return null when popping an empty array", () => {
    var pp = new pushPopper();
    
    assert.deepEqual(pp.push(1), [1])
  });
  
  it("Should simply equal to twelve!", () => {
    assert.equal(x, 12);
  });
});
