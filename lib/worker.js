const vm2     = require("vm2");

const VM      = vm2.VM;
const NodeVM  = vm2.NodeVM;

let options = {
  console:        "inherit",
  displayErrors:  false,
  require:        true,
  requireExternal: false,
  requireNative:  [],
  requireRoot:    "./",
  sandbox:        {}
};

process.on("message", function(testCase) {
  let args = []; // temporary
  runCodeInVM(testCase.code, args, (result) => {
    testCase.result = result;
    process.send(testCase);
  });
});

function runCodeInVM(code, args, cb) {
  args = args || [];
  
  const vm = new VM(options);
  let result = vm.run(code);

  cb(result);
}

function runNodeCode(code, args, cb) {
  args = args || [];
  
  const vm = new NodeVM(options);
  let functionInSandbox = vm.run(code);
  
  let result = vm.call(functionInSandbox, ...args);
  cb(result);
}
