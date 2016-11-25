var printer = require('printer'),
    express = require('express'),
    printerExpress = express(),
    bodyParser = require('body-parser'),
    extend = require('util')._extend,
    http = require('http'),
    fs =  require('fs'),
    tmp = require('tmp');
    child_process = require('child_process');

function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

var printerMiddleware = function (req, res, next) {
  if (!req.printer) {
    req.printer = printer;
  }

  next();
};

printerExpress.use(bodyParser.json());
printerExpress.use(printerMiddleware);

printerExpress.get('/printers', function (req, res) {
  res.json(req.printer.getPrinters());
});

printerExpress.post('/jobs', function (req, res) {
  var job = req.body;
  var callbacks = {
    success: function (jobID) {
      res.status(201).json({ job_id: jobID });
    },
    error: function (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (job.url) {
    job.filename = tmp.tmpNameSync();
    download(job.url, job.filename, function () {
      if (process.platform === 'win32') {
        console.log('win32');
        var command = 'C://SumatraPDF.exe -print-to ' + '"' + job.printer + '" ' + job.filename;
        child_process.exec(command, function(error){
          if (error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(201).json({ result:"success" });
          }
        });
      } else {
        req.printer.printFile(extend(job, callbacks));
      }
    });
  } else {
    req.printer.printDirect(extend(job, callbacks));
  }
});

module.exports = printerExpress;