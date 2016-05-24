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
    this.numWorkers = 0;
  }
  
  run(tests, onFinish) {
    
    let timeoutHandles = {};
    cluster.on("online", (worker) => {
      console.log(`worker ${worker.id} initialized`);
      let testId = worker.process.env.testId;
      let test = tests[testId];
      worker.on("message", (testResult) => { // code execution complete
        clearTimeout(timeoutHandles[worker.id]);
        try {
          tests[testId].callback(testResult.result);
          console.log(`(${worker.id}) ${test.summary}: Pass`);
        } catch (e) {
          console.log(`(${worker.id}) ${test.summary}: Fail (${e.message})`);
        } finally {
          worker.kill();
        }
      });
      
      timeoutHandles[worker.id] = setTimeout(() => { // graceful timeout handling
        console.log(`(${worker.id}) ${test.summary}: Timeout`);
        this.notifyWorkerExit();
        worker.kill();
        tests[testId].callback()
      }, TIMEOUT_MS);
      
      worker.send(tests[testId]);
    });

    cluster.on('exit', (worker, code, signal) => {
      this.notifyWorkerExit();
    });
    
    this.onFinish = onFinish;
    for (var i=0; i<tests.length; i++) {
      this.createTestWorker(tests[i]);
    }
  }
  
  createTestWorker(test) {
    let worker = cluster.fork();
    worker.process.env = { testId: test.id };
    this.numWorkers += 1;
  }
  
  notifyWorkerExit() {
    this.numWorkers -= 1;
    if (this.numWorkers === 0) {
      this.onFinish();
    }
  }
}

let tests = [];

function suite(cb) {
  cb();
  const testRunner = new TestRunner();
  testRunner.run(tests, (results) => {
    console.log("finished", results);
    process.exit();
  });
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
