var request = require('supertest')
  , printExpress = require('../index.js')

// prints to the system default printer
request(printExpress)
  .post('/jobs')
  .send({ data: 'Hello, World!', type: 'RAW' })
  .expect('Content-Type', /json/)
  .expect(201, /"job_id"/)
  .end(function(err, res){
    if (err) throw err;
  });
