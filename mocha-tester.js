var Mocha   = require("mocha");
var fs      = require("fs");

// Instantiate a Mocha instance.
var mocha = new Mocha({ reporter: "json" });

var testFile = "./concatenated-code.js";
mocha.addFile(testFile);

// possible alternative approach (see below)

// Run the test concatenated script
try {
  mocha.run(function(failures) {
    console.log("Failures:", failures);
    process.on('exit', function () {
      process.exit(failures);  // exit with non-zero status if there were failures
    });
  });
  
} catch (e) {  
  console.log("Exception", e); // TODO Turn this into some JSON
}

/*
 * Alternative approach using streams?

// var stream  = require("stream");

var testString = fs.readFileSync(testFile, 'utf8');

var readStream = new stream.Readable();
readStream._read = function noop() {};
readStream.push(testString);
readStream.push(null);

mocha.addFile(readStream); // exception. expecting file path
*/
