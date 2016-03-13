var printerExpress = require('./index.js'),
    port = process.env.PORT || 3000;

// Cross Origin Resource Sharing (CORS)
// To allow in browser HTTP requests from the different domains
printerExpress.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

printerExpress.listen(port);
