var printer = require('printer'),
    express = require('express'),
    printerExpress = express(),
    bodyParser = require('body-parser'),
    extend = require('util')._extend;

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

  req.printer.printDirect(extend(job, callbacks));
});

module.exports = printerExpress;
