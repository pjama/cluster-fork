const cluster = require("cluster");

const TIMEOUT_MS = 2000;
const DEFAULT_ENV = "browser";

class TestRunner {
  constructor() {
    cluster.setupMaster({
      exec : "./lib/worker.js",
      args : process.argv.slice(2),
      silent : false
    });
  }
  
  run(tests) {
    let timeoutHandles = {};
    cluster.on("online", (worker) => {
      console.log("worker", worker.id)
      // let testCase = worker.process.env.test;
      
      worker.on("message", (test) => { // code execution complete
        clearTimeout(timeoutHandles[worker.id]);
        try {
          tests[test.id].callback(test.result);
          console.log(`(${worker.id}): ${test.summary}: Pass`);
        } catch (e) {
          console.log(`(${worker.id}): ${test.summary}: Fail (${e.message})`);
        }
        worker.destroy();
      });
      
      timeoutHandles[worker.id] = setTimeout(() => {
        worker.destroy();
        console.log(`worker (id ${worker.id}) timed out`);
      }, TIMEOUT_MS);
    });
    
    for (var i=0; i<tests.length; i++) {
      // let env = {
      //   test: tests[i]
      // };
      let worker = cluster.fork();
      // worker.process.env = env;
      worker.send(tests[i]);
    }
  }
}

let tests = [];

function suite(cb) {
  cb();
  const testRunner = new TestRunner();
  testRunner.run(tests);
}

function test(code, params, summary, cb) {
  let t = {
    id:       tests.length,
    code:     code,
    params:   params,
    summary:  summary,
    callback: cb
  };
  tests.push(t);
}

module.exports = {
  suite: suite, 
  test: test
}
