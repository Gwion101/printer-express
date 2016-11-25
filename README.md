# Printer Express

Share standard printers via JSON API

[![Build Status](https://secure.travis-ci.org/yevgenko/printer-express.png)](http://travis-ci.org/yevgenko/printer-express)

## Usage

### Standalone

Clone repository:

    git clone git@github.com:yevgenko/printer-express.git

Install dependencies:

    cd printer-express
    npm i

Run the server (default port is 3000, but can be adjusted via environment
variable PORT):

    node standalone.js

### ExpressJS Middleware

Install printer-express package with npm:

    npm i printer-express --save

Use middleware with Express application:

    var express = require('express'),
        printerExpress = require('printer-express'),
        app = express(),
        port = process.env.PORT || 3000;

    // mount point for JSON API, i.e. /cloudprint/printers and /cloudprint/jobs
    app.use('/cloudprint', printerExpress);
    app.listen(port);

## JSON API

### GET /printers

Get the list of printers installed on the hosting system:

    curl -v http://localhost:3000/printers

or with jQuery:

    $.getJSON("http://localhost:3000/printers");

### POST /jobs

Submit new printing job:

    curl -v -X POST http://localhost:3000/jobs -H "Content-Type: application/json" -d '{"data":"Hello, World!", "type":"RAW", "printer":"stkPrinter"}'

or with jQuery:

    $.ajax({
      type: 'POST',
      url: "http://localhost:3000/jobs",
      data: JSON.stringify({data: 'Hello, World!', type: 'RAW', printer: 'stkPrinter'}),
      dataType: 'json',
      contentType: "application/json; charset=utf-8"
    });

To print from file, i.e. PDF, simply replace `data` and `type` attributes with
`url` pointing to the publicly accessible file, for example:

    curl -v -X POST http://localhost:3000/jobs -H "Content-Type: application/json" -d '{"url":"http://example.com/print.pdf", "printer":"stkPrinter"}'

We can also omit the `printer` attribute, in which case system default printer
will be used.

### Printing on windows.

Printing pdf files with node-printer is not supported on windows.
Solution here is a bit of a hack, using SumatraPDF can make a child_process passing in the arguments to launch SumatraPDF silenty in the background to push the document to the printer.
To setup, place Sumatra.pdf at the root of C:/ .
The hope in future is to use foxit reader to process the print job.

SumatraPDF can be downloaded here http://www.sumatrapdfreader.org/dl/SumatraPDF-3.1.2.zip
