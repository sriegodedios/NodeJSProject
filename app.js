
const http = require('http');
var express = require('express');
var app     = express();
const layout = require('express-layout')


const hostname = '127.0.0.1';
const port = 3000;

var database = require('./database');
database.Init();

app.get('/', function(req, res) {
  
  res.send('this is a sample!');  
});

app.get('/test', function(req, res) {
  
  res.send('this is a test!');  
});


// START THE SERVER
// ==============================================
app.listen(port);
console.log(`Server running on http://${hostname}:${port}/`);
