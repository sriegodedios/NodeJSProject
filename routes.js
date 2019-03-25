// routes.js
var CASType = require('./models/cas-validation-response');
var emailer = require('./modules/emailer')
const express = require('express')
const router = express.Router()
const layout = require('express-layout')
var fs = require('fs');
var CASAuthentication = require('cas-authentication');
var request = require('request');
var CASURL = "https://signin.k-state.edu/WebISO/";

var bodyParser = require('body-parser'); 
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


var CASAuthentication = require('cas-authentication');
 
var cas = new CASAuthentication({
  cas_url     : CASURL,
  service_url : 'http://127.0.0.1:3000/validate',
  cas_version     : '2.0',
  session_name    : 'cas_user',
  session_info    : 'ValidateTicket',

});

router.get( '/app', cas.bounce, function ( req, res, next ) {
   
  res.send( '<html><body>Hello!</body></html>' );
});


router.get('/', (req, res) => {
  //fs.readFile('templates/index.html', function(err, data) {
   // res.writeHead(200, {'Content-Type': 'text/html'});
   // res.write(data);
    //res.end();
    res.render('templates/index');
 // });
});

router.get('/login', (req,res) => {
  fs.readFile('templates/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

//file server
router.get('/core/:type/:file',(req,res) => {

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
    case 'pdf':
      content = 'application/pdf'
    break;

  }

  console.log(content)

  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': content});
    res.write(data);
    res.end();
  });
});

router.post('/function/:type', (req,res) => {
  var type = req.params.type;
  switch(type){
    case 'email':
      console.log(req.body)
      var name = req.body.Name;
      var email = req.body.Email; 
      var subject = req.body.Subject;
      var messege = req.body.Messege;

      var e = new emailer();
      e.sendEmail(name,email,subject,messege)
      res.send('Email Sent');
    break;


  }
});



//router.post('/login', (req,res) => {
//  res.send('This is the go')
//});

router.route('/register')
    .get((req,res) => {
      fs.readFile('templates/register.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    }).post((req, res) => {
      console.log(req.body);


    });

  router.route('/validate/:location')
    .get((req,res) => {
        var ticket = req.query.ticket
        var location = req.params.location
        
        request(CASURL+'serviceValidate?service=http://127.0.0.1:3000/validate/app/&ticket='+ticket+'&format=JSON', function (error, response, body) {
           // res.send(JSON.parse(body))
           
           console.log(body);
            const validationResponse = new CASType.CASValidationResponse(JSON.parse(body));
            if (!validationResponse.validated) {
              return res.unauthorized();
            }
            res.send(validationResponse.serviceResponse.authenticationSuccess.attributes.ksuPersonWildcatId)


        })
    });

router.route('/login')
    .get((req, res) => {
      fs.readFile('templates/login.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    })
    .post((req, res) => {
      console.log(req.body)
        var username = req.body.username,
            password = req.body.password;

            
            if(password != 'hi')
            {
              res.send('Access Denied')
            }else{
              res.send('This is the go')
            }
       // User.findOne({ where: { username: username } }).then(function (user) {
       //    if (!user) {
        //       res.redirect('/login');
         //   } else if (!user.validPassword(password)) {
         //       res.redirect('/login');
         //   } else {
         //       req.session.user = user.dataValues;
         //       res.redirect('/dashboard');
         //   }
       // });
      
       
    });
  
    

module.exports = router