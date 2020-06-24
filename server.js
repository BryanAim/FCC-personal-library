'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
const helmet = require('helmet');
require('dotenv').config();

var app = express();

app.use(helmet());

app.use(helmet.hidePoweredBy({setTo: 'PHP 4.2.0'}));
// app.use(helmet.noCache());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
const MONGODB_CONNECTION_STRING = process.env.DB;
//Start our server and tests!
app.listen(8000, function () {
  console.log("Listening on port " + 8000);
  // console.log(MONGODB_CONNECTION_STRING );
  
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
