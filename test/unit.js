var request = require('supertest')
  , printExpress = require('../index.js')
  , express = require('express')

// Triggers success with fake Job ID
var fakePrinter = function (req, res, next) {
  req.printer = {
    printDirect: function (params) {
      var jobID = 1;
      params.success(jobID);
    },
    printFile: function (params) {
      var jobID = 2;
      params.success(jobID);
    }
  }

  next();
};

// returns the list of printers
request(printExpress)
  .get('/printers')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
  });

// returns error when printer not found
request(printExpress)
  .post('/jobs')
  .send({ data: 'Hello, World!', type: 'RAW', printer: '---DOES-NOT-EXISTS---' })
  .expect('Content-Type', /json/)
  .expect(400, /"error"/)
  .end(function(err, res){
    if (err) throw err;
  });

// mount as middleware to the express application
app = express();
app.use(fakePrinter); // see integration test for testing agains real printer
app.use('/cloudprint', printExpress);

// returns job ID when print job is accepted
request(app)
  .post('/cloudprint/jobs')
  .send({ data: 'Hello, World!', type: 'RAW' })
  .expect('Content-Type', /json/)
  .expect(201, /"job_id":1/)
  .end(function(err, res){
    if (err) throw err;
  });

// prints file when URL is passed
request(app)
  .post('/cloudprint/jobs')
  .send({ url: 'http://s3.example.com/print.pdf' })
  .expect('Content-Type', /json/)
  .expect(201, /"job_id":2/)
  .end(function(err, res){
    if (err) throw err;
  });
