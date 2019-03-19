// routes.js
const express = require('express')
const router = express.Router()
const layout = require('express-layout')
var fs = require('fs');

router.get('/', (req, res) => {
  res.send('Hello World!')
});

router.get('/login', (req,res) => {
  fs.readFile('templates/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

//file server
router.get('/core/:type/:file', (req,res) => {

  var type = req.params.type;
  var filename = req.params.file;

  var path = 'core/'+type+'/'+filename

  var content = '';
  switch(type)
  {
    case 'css':
      content = 'text/css';
    break;
    case 'js':
      content = 'text/javascript';
    break;

  }



  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': content});
    res.write(data);
    res.end();
  });
});



router.post('/login', (req,res) => {
  res.send('This is the go')
})

module.exports = router