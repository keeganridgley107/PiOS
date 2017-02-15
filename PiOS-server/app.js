'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const privateKey = 'my_awesome_cookie_signing_key';
const boom = require('boom');
var http = require('http');
var path = require('path');
var cors = require('./routes/cors');


app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(morgan('short'));


const authorize = function(req, res, next) {
  console.log(req.cookie);
  if (req.cookies) {
    console.log('you have a cookie');
    const token = req.cookies.token;
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        console.log(err);
        next(boom.create(400, 'You need a cookie'));
      }
      req.token = decoded;
      next();
    });
  } else {
    console.log('go get a cookie');
    next(boom.create(400, 'You need a cookie'));
  }
};

app.get('/landing', authorize, function (req, res, next) {
  console.log(req.token);
  console.log(res);

  if (req.token === 'dinkydinky@gmail.com') {
    res.sendFile(path.join(__dirname + '/public/user-landing-admin.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/user-landing.html'));
  }
});

app.use(express.static('public'));

var users = require('./routes/users.js');
var uploads = require('./routes/upload-route.js');
var token = require('./routes/token-route.js');

app.use('/users', users);
app.use('/uploads', uploads);
app.use('/token', token);

app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
	  console.error(err.stack);
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
    console.log('Listening on http://localhost:' + port);
});



module.exports = app;
