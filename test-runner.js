const fs      = require("fs");
const eslint  = require("eslint");
const Mocha   = require("mocha");
const uuid    = require("node-uuid");

const RULES   = require("./rules.json");

class TestRunner {
  constructor() {
    this.mocha = new Mocha({ reporter: "json" });
  }
  
  run(code, specFile, cb) {
    let results = { errors: [] };
    try {
      results.lintResults = this.runLint(code);
      this.concatenateTestFile(code, specFile)
        .then((pathConcatenated) => {
          let mochaResults = this.runMocha(pathConcatenated);
          fs.unlink(pathConcatenated); // delete temp file
          return mochaResults;
        })
        .then((testResults) => {
          results.testResult = testResults;
          cb(null, results);
        });
      
    } catch (e) {
      console.error(e);
      results.errors.push(e);
      cb(e, results);
    }
  }
  
  concatenateTestFile(code, specFile) {
    return new Promise((resolve, reject) => {
      const testFilePath = `./concatenated-code-${uuid.v4()}.js`;
      fs.readFile(specFile, "utf8", (err, specData) => {
        if (err) {
          throw err;
        }
        const concatenatedData = `${code}\n${specData}`;
        fs.writeFile(testFilePath, concatenatedData, "utf8", () => {
          resolve(testFilePath);
        });
      });
    });
  }
  
  runMocha(testFile, cb) {
    let promise = new Promise((resolve, reject) => {
      this.mocha.addFile(testFile);
      this.mocha.run().on("end", function() {
        resolve(this.stats); // return test statistics
      });
    });
    return promise;
  }
  
  runLint(code) {
    let lintOptions = { "rules": RULES };
    let lintResults = eslint.linter.verify(code, lintOptions);
    return lintResults;
  }
}

module.exports = TestRunner;
